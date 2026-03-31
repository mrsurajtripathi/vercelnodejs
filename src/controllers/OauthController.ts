import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { v4  as uuid4} from 'uuid';

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
        const { response_type, client_id, redirect_uri, scope, state } = req.query;
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
        // For simplicity, we will skip user authentication and consent
        const authorization_code = uuid4();
        await pool.query(
            `INSERT INTO oauth_authorization_codes (code, client_id, redirect_uri, scope, user_id)
     VALUES ($1, $2, $3, $4, $5)`,
            [authorization_code, client_id, redirect_uri, scope || '', 1]
        );
        const redirectUrl = `${redirect_uri}?code=${authorization_code}&state=${state || ''}`;
        res.redirect(redirectUrl);  
    }
}