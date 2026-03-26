import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { v4 } from 'uuid';

export const oauthController = {
    create: async (req: Request, res: Response) => {
        const { name, redirect_uri } = req.body;
        if (!name || !redirect_uri) {
            res.send({ status: 0, error: 'Invalid Parameter' });
            return;
        }
        const client_id = v4();
        const client_secret = v4();
        const { rows } = await pool.query(
            `INSERT INTO oauth_clients (name, client_id, client_secret,redirect_uri,developerid)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [name, client_id, client_secret, redirect_uri, 1]
        );
        res.json({ status: 1, message: 'Client Added', client: rows[0].id });
    },
    getlist: async (req: Request, res: Response) => {
        const { rows } = await pool.query('SELECT * FROM oauth_clients');
        res.send(rows);
    }
}