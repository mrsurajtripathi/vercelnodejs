import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { v4 as uuidv4 } from 'uuid';

export const OauthController = {
    createClient: async (req: Request, res: Response) => {
        const { redirect_uri } = req.body;
        const client_id = uuidv4();
        const client_secret = uuidv4();
        await pool.query(
            `INSERT INTO oauth_clients (developerid,client_id, client_secret, redirect_uri)
     VALUES ($1, $2, $3,$4)`,
            [client_id, client_secret, redirect_uri]
        );
        res.json({ client_id, client_secret });
    }
}