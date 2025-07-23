import { Pool } from 'pg';

export const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-empty-fire-a4foautf-pooler.us-east-1.aws.neon.tech',
  database: 'neondb',
  password: 'npg_BqV53KUxRapD',
  port: 5432
});
