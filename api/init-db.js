import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS company (
        id SERIAL PRIMARY KEY,
        name TEXT, nameEn TEXT, cr TEXT, vat TEXT,
        address TEXT, phone TEXT, email TEXT, website TEXT, logo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, uid TEXT UNIQUE, email TEXT UNIQUE NOT NULL,
        name TEXT, mobile TEXT, title TEXT, photo TEXT, role TEXT,
        admin BOOLEAN DEFAULT false, readOnly BOOLEAN DEFAULT false,
        approveManager BOOLEAN DEFAULT false, partner BOOLEAN DEFAULT false,
        enabled BOOLEAN DEFAULT true, views TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, nameEn TEXT,
        email TEXT, phone TEXT, address TEXT, contact TEXT,
        industry TEXT, rating INTEGER, notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY, nameAr TEXT NOT NULL, nameEn TEXT,
        category TEXT, description TEXT, price DECIMAL,
        stock INTEGER DEFAULT 0, sku TEXT, image TEXT,
        active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY, no TEXT UNIQUE NOT NULL, date DATE,
        customer TEXT, status TEXT, gross DECIMAL, net DECIMAL,
        vat DECIMAL, total DECIMAL, disc DECIMAL, validity INTEGER,
        pay TEXT, warranty TEXT, rep TEXT, created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lines (
        id TEXT PRIMARY KEY, docType TEXT, docNo TEXT, product TEXT,
        qty INTEGER, defPrice DECIMAL, "override" TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, nameEn TEXT,
        email TEXT, phone TEXT, rating INTEGER, created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY, no TEXT UNIQUE NOT NULL, date DATE,
        poRef TEXT, goods DECIMAL, freight DECIMAL, clr DECIMAL,
        status TEXT, created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    res.json({ success: true, message: '✅ تم إنشاء جميع الجداول!' });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: error.message });
  }
}
