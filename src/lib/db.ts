import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.NEON_DB_AUTH) {
  throw new Error('NEON_DB_AUTH environment variable is not set');
}

const sql = neon(process.env.NEON_DB_AUTH);
export const db = drizzle(sql);
