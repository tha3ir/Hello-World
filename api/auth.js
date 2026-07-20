import crypto from 'crypto';
import { getPool } from './_db.js';

// حسابات المالكَين المعروفة (تُثبَّت UID لتوافق صلاحيات النظام) — يُسمح لها بالتفعيل الأول فقط
const OWNERS = {
  'tha3ir@gmail.com': 'dD73Rqzh2UeVaNtXdv4q8HZAm7H3',
  'osamahomaidan@gmail.com': 'RUiGaQTOz9PcYVCOs3cBrHnNJqk1',
};

// سرّ توقيع الرموز (يُفضَّل ضبط AUTH_SECRET؛ وإلا نشتقّه من رابط قاعدة البيانات السرّي)
const SECRET =
  process.env.AUTH_SECRET ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'erp-fallback-secret';

const norm = (e) => String(e || '').trim().toLowerCase();
const makeSalt = () => crypto.randomBytes(16).toString('hex');
const hashPassword = (password, salt) =>
  crypto.scryptSync(String(password), salt, 64).toString('hex');

function samePass(plain, salt, expectedHash) {
  const h = hashPassword(plain, salt);
  const a = Buffer.from(h);
  const b = Buffer.from(expectedHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(payloadObj) {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return payload + '.' + sig;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expect = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (obj.exp && Date.now() > obj.exp) return null;
    return obj;
  } catch (e) {
    return null;
  }
}

const issue = (user) =>
  sign({ uid: user.uid, email: user.email, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 });

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth_users (
      email TEXT PRIMARY KEY,
      uid TEXT UNIQUE NOT NULL,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export default async function handler(req, res) {
  const pool = getPool();
  if (!pool) return res.status(500).json({ error: 'لا يوجد اتصال بقاعدة البيانات' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await ensureTable(pool);
    const body = req.body || {};
    const action = body.action;

    // ── تسجيل الدخول ──
    if (action === 'login') {
      const email = norm(body.email);
      const { rows } = await pool.query('SELECT * FROM auth_users WHERE email=$1', [email]);
      if (!rows.length) return res.status(401).json({ error: 'invalid' });
      const u = rows[0];
      if (!samePass(body.password || '', u.salt, u.hash))
        return res.status(401).json({ error: 'invalid' });
      return res.json({ token: issue(u), user: { uid: u.uid, email: u.email } });
    }

    // ── التفعيل الأول لحساب مالك (مرة واحدة فقط) ──
    if (action === 'setup') {
      const email = norm(body.email);
      const password = String(body.password || '');
      if (!(email in OWNERS)) return res.status(403).json({ error: 'not-owner' });
      if (password.length < 6) return res.status(400).json({ error: 'weak' });
      const { rows } = await pool.query('SELECT 1 FROM auth_users WHERE email=$1', [email]);
      if (rows.length) return res.status(409).json({ error: 'exists' });
      const salt = makeSalt();
      const uid = OWNERS[email];
      await pool.query(
        'INSERT INTO auth_users (email, uid, salt, hash) VALUES ($1,$2,$3,$4)',
        [email, uid, salt, hashPassword(password, salt)]
      );
      return res.json({ token: issue({ uid, email }), user: { uid, email } });
    }

    // ── التحقق من الرمز (استعادة الجلسة) ──
    if (action === 'me') {
      const t = verifyToken(body.token);
      if (!t) return res.status(401).json({ error: 'invalid' });
      return res.json({ user: { uid: t.uid, email: t.email } });
    }

    // ── إنشاء مستخدم (يتطلّب جلسة صالحة) ──
    if (action === 'createUser') {
      const t = verifyToken(body.token);
      if (!t) return res.status(401).json({ error: 'unauthorized' });
      const email = norm(body.email);
      const password = String(body.password || '');
      if (!email.includes('@')) return res.status(400).json({ error: 'invalid-email' });
      if (password.length < 6) return res.status(400).json({ error: 'weak' });
      const { rows } = await pool.query('SELECT 1 FROM auth_users WHERE email=$1', [email]);
      if (rows.length) return res.status(409).json({ error: 'email-already-in-use' });
      const salt = makeSalt();
      const uid = OWNERS[email] || 'u_' + crypto.randomBytes(10).toString('hex');
      await pool.query(
        'INSERT INTO auth_users (email, uid, salt, hash) VALUES ($1,$2,$3,$4)',
        [email, uid, salt, hashPassword(password, salt)]
      );
      return res.json({ uid });
    }

    // ── تغيير كلمة المرور الخاصة بي ──
    if (action === 'changePassword') {
      const t = verifyToken(body.token);
      if (!t) return res.status(401).json({ error: 'unauthorized' });
      const newP = String(body.newPassword || '');
      if (newP.length < 6) return res.status(400).json({ error: 'weak' });
      const { rows } = await pool.query('SELECT * FROM auth_users WHERE email=$1', [t.email]);
      if (!rows.length) return res.status(404).json({ error: 'not-found' });
      const u = rows[0];
      if (!samePass(body.oldPassword || '', u.salt, u.hash))
        return res.status(401).json({ error: 'wrong-password' });
      const salt = makeSalt();
      await pool.query('UPDATE auth_users SET salt=$1, hash=$2 WHERE email=$3', [
        salt, hashPassword(newP, salt), t.email,
      ]);
      return res.json({ success: true });
    }

    // ── إعادة تعيين كلمة مرور مستخدم آخر (يتطلّب جلسة صالحة) ──
    if (action === 'resetUser') {
      const t = verifyToken(body.token);
      if (!t) return res.status(401).json({ error: 'unauthorized' });
      const email = norm(body.email);
      const password = String(body.password || '');
      if (password.length < 6) return res.status(400).json({ error: 'weak' });
      const { rows } = await pool.query('SELECT 1 FROM auth_users WHERE email=$1', [email]);
      if (!rows.length) return res.status(404).json({ error: 'not-found' });
      const salt = makeSalt();
      await pool.query('UPDATE auth_users SET salt=$1, hash=$2 WHERE email=$3', [
        salt, hashPassword(password, salt), email,
      ]);
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'unknown-action' });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
}
