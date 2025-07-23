import { Pool } from 'pg';

export const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'verceldeploy',
  password: 'mind',
  port: 5432
});
