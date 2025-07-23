import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_BqV53KUxRapD@ep-empty-fire-a4foautf-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
  }
});
