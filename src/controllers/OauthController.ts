import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { v4 as uuid4 } from 'uuid';

export const oauthController = {
    create: async (req: Request, res: Response) => {
        const { name, redirect_uri } = req.body;
        if (!name || !redirect_uri) {
            res.send({ status: 0, error: 'Invalid Parameter' });
            return;
        }
        const client_id = uuid4();
        const client_secret = uuid4();
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
    },
    authorize: async (req: Request, res: Response) => {
        const { response_type, client_id, redirect_uri, scope, state, code_challenge,
            code_challenge_method } = req.query;
        if (!response_type || !client_id || !redirect_uri) {
            res.send({ status: 0, error: 'Invalid Parameter' });
            return;
        }
        const { rows } = await pool.query('SELECT * FROM oauth_clients WHERE client_id = $1', [client_id]);
        if (rows.length === 0) {
            res.send({ status: 0, error: 'Invalid Client ID' });
            return;
        }
        const client = rows[0];
        if (client.redirect_uri !== redirect_uri) {
            res.send({ status: 0, error: 'Invalid Redirect URI' });
            return;
        }
        const code = uuid4();
        await pool.query(
            `INSERT INTO oauth_auth_codes
    (code, code_challenge, code_challenge_method, expires_at, client_id, user_id)
    VALUES ($1,$2,$3,NOW() + interval '10 minutes',$4,$5)`,
            [code, code_challenge, code_challenge_method, client_id, 1]
        );
        return res.send({ status: 1, redirecturi: `${redirect_uri}?code=${code}&state=${state}` });
    }
}