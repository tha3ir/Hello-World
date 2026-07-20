import { getPool } from './_db.js';

export default async function handler(req, res) {
  const pool = getPool();
  if (!pool) {
    return res.status(500).json({
      error: 'لا يوجد رابط اتصال بقاعدة البيانات. أضِف DATABASE_URL في إعدادات هذا المشروع على Vercel ثم أعِد النشر.',
    });
  }

  if (req.method === 'POST') {
    const { table, data } = req.body || {};
    try {
      if (table === 'users' && Array.isArray(data)) {
        for (const u of data) {
          await pool.query(
            `INSERT INTO users (id, uid, email, name, mobile, title, photo, role, admin, readOnly, approveManager, partner, enabled, views)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name, mobile = EXCLUDED.mobile, admin = EXCLUDED.admin`,
            [u.id, u.uid, u.email, u.name, u.mobile, u.title, u.photo, u.role,
             u.admin, u.readOnly, u.approveManager, u.partner, u.enabled, u.views]
          );
        }
      } else if (table === 'quotes' && Array.isArray(data)) {
        for (const q of data) {
          await pool.query(
            `INSERT INTO quotes (id, no, date, customer, status, gross, net, vat, total, disc, validity, pay, warranty, rep)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
             ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
            [q.id, q.no, q.date, q.customer, q.status, q.gross, q.net, q.vat,
             q.total, q.disc, q.validity, q.pay, q.warranty, q.rep]
          );
        }
      } else {
        return res.status(400).json({ error: 'جدول غير مدعوم أو بيانات غير صحيحة' });
      }
      res.json({ success: true, message: `تم حفظ ${table}` });
    } catch (error) {
      console.error('DB Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const { table } = req.query;
    try {
      let result;
      if (table === 'users') {
        result = await pool.query('SELECT * FROM users');
      } else if (table === 'quotes') {
        result = await pool.query('SELECT * FROM quotes');
      } else {
        return res.status(400).json({ error: 'جدول غير مدعوم' });
      }
      res.json({ data: result.rows });
    } catch (error) {
      console.error('DB Error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
