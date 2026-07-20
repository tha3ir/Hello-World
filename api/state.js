import { getPool } from './_db.js';

const STATE_ID = 'erp:state';

// يضمن وجود جدول الحالة (رخيص وآمن للتكرار)
async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export default async function handler(req, res) {
  const pool = getPool();
  if (!pool) {
    return res.status(500).json({
      error: 'لا يوجد رابط اتصال بقاعدة البيانات. أضِف DATABASE_URL في إعدادات هذا المشروع على Vercel.',
    });
  }

  try {
    await ensureTable(pool);

    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT value FROM app_state WHERE id = $1', [STATE_ID]);
      return res.json({ value: rows.length ? rows[0].value : null });
    }

    if (req.method === 'POST') {
      const { value } = req.body || {};
      if (typeof value !== 'string') {
        return res.status(400).json({ error: 'قيمة غير صحيحة' });
      }
      await pool.query(
        `INSERT INTO app_state (id, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [STATE_ID, value]
      );
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: error.message });
  }
}
