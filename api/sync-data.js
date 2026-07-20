import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { table, data } = req.body;
    try {
      if (table === 'users' && data) {
        for (const user of data) {
          await sql`
            INSERT INTO users (id, uid, email, name, mobile, title, photo, role, admin, readOnly, approveManager, partner, enabled, views)
            VALUES (${user.id}, ${user.uid}, ${user.email}, ${user.name}, ${user.mobile}, ${user.title}, ${user.photo}, ${user.role}, ${user.admin}, ${user.readOnly}, ${user.approveManager}, ${user.partner}, ${user.enabled}, ${user.views})
            ON CONFLICT (id) DO UPDATE SET 
              name = EXCLUDED.name, mobile = EXCLUDED.mobile, admin = EXCLUDED.admin
          `;
        }
      } else if (table === 'quotes' && data) {
        for (const quote of data) {
          await sql`
            INSERT INTO quotes (id, no, date, customer, status, gross, net, vat, total, disc, validity, pay, warranty, rep)
            VALUES (${quote.id}, ${quote.no}, ${quote.date}, ${quote.customer}, ${quote.status}, ${quote.gross}, ${quote.net}, ${quote.vat}, ${quote.total}, ${quote.disc}, ${quote.validity}, ${quote.pay}, ${quote.warranty}, ${quote.rep})
            ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
          `;
        }
      }
      res.json({ success: true, message: `تم حفظ ${table}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const { table } = req.query;
    try {
      let result;
      if (table === 'users') {
        result = await sql`SELECT * FROM users`;
      } else if (table === 'quotes') {
        result = await sql`SELECT * FROM quotes`;
      }
      res.json({ data: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
