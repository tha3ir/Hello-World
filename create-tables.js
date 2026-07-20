const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    await client.connect();
    console.log('✔ متصل بـ Neon');

    // جدول الشركة
    await client.query(`
      CREATE TABLE IF NOT EXISTS company (
        id SERIAL PRIMARY KEY,
        name TEXT,
        nameEn TEXT,
        cr TEXT,
        vat TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        logo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول company');

    // جدول المستخدمين
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        uid TEXT UNIQUE,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        mobile TEXT,
        title TEXT,
        photo TEXT,
        role TEXT,
        admin BOOLEAN DEFAULT false,
        readOnly BOOLEAN DEFAULT false,
        approveManager BOOLEAN DEFAULT false,
        partner BOOLEAN DEFAULT false,
        enabled BOOLEAN DEFAULT true,
        views TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول users');

    // جدول العملاء
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nameEn TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        contact TEXT,
        industry TEXT,
        rating INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول customers');

    // جدول المنتجات
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        nameAr TEXT NOT NULL,
        nameEn TEXT,
        category TEXT,
        description TEXT,
        price DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        sku TEXT,
        image TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول products');

    // جدول عروض الأسعار
    await client.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        customer TEXT,
        status TEXT,
        gross DECIMAL(10,2),
        net DECIMAL(10,2),
        vat DECIMAL(10,2),
        total DECIMAL(10,2),
        disc DECIMAL(10,2),
        validity INTEGER,
        pay TEXT,
        warranty TEXT,
        rep TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول quotes');

    // جدول بنود المستندات
    await client.query(`
      CREATE TABLE IF NOT EXISTS lines (
        id TEXT PRIMARY KEY,
        docType TEXT,
        docNo TEXT,
        product TEXT,
        qty INTEGER,
        defPrice DECIMAL(10,2),
        "override" TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول lines');

    // جدول أوامر البيع
    await client.query(`
      CREATE TABLE IF NOT EXISTS sos (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        customer TEXT,
        status TEXT,
        gross DECIMAL(10,2),
        net DECIMAL(10,2),
        vat DECIMAL(10,2),
        total DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول sos');

    // جدول إذون التسليم
    await client.query(`
      CREATE TABLE IF NOT EXISTS dos (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        status TEXT,
        total DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول dos');

    // جدول طلبات الشراء
    await client.query(`
      CREATE TABLE IF NOT EXISTS prs (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        status TEXT,
        total DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول prs');

    // جدول أوامر الشراء
    await client.query(`
      CREATE TABLE IF NOT EXISTS pos (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        supplier TEXT,
        status TEXT,
        total DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول pos');

    // جدول الموردين
    await client.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nameEn TEXT,
        email TEXT,
        phone TEXT,
        rating INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول suppliers');

    // جدول الشحنات
    await client.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY,
        no TEXT UNIQUE NOT NULL,
        date DATE,
        poRef TEXT,
        goods DECIMAL(10,2),
        freight DECIMAL(10,2),
        clr DECIMAL(10,2),
        status TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✔ جدول shipments');

    console.log('\n✅ تم إنشاء جميع الجداول بنجاح!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    await client.end();
    process.exit(1);
  }
}

createTables();
