import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  await pool.query('SELECT 1');
  console.log('✅ Database connected successfully!');
} catch (err) {
  console.error('❌ Failed to connect to the database.');
  console.error('Error details:', err.message);
  process.exit(1);
}

export const db = drizzle(pool);
