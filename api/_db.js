import pg from 'pg';

// اقرأ رابط الاتصال من أي اسم متغيّر متاح (Neon / Vercel Postgres)
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING;

let pool;

// أعِد Pool واحداً مُعاد استخدامه (أفضل لبيئة Serverless)
export function getPool() {
  if (!connectionString) return null;
  if (!pool) {
    pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}
