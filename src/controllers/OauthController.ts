import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { v4 as uuid4 } from 'uuid';
import { createHash } from 'crypto';
import { generateCodeChallenge } from '../utils/pkce';
import { sign } from 'jsonwebtoken';

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
            `INSERT INTO authorization_codes
    (code, code_challenge, code_challenge_method, expires_at, client_id, user_id)
    VALUES ($1,$2,$3,$4,$5,$6)`,
            [code, code_challenge, code_challenge_method, Date.now() + (60 * 60 * 1000), client_id, 1]
        );

        let direct_uri = client.redirect_uri;
        direct_uri += `?code=${code}`;
        if (state) {
            direct_uri += `&state=${state}`;
        }
        return res.send({ status: 1, redirecturi: `${direct_uri}` });
    },
    token: async (req: Request, res: Response) => {
        const {
            code,
            client_id,
            code_verifier,
            client_secret
        } = req.body;

        if (!code || !client_id || !client_secret) {
            res.send({ status: 0, error: 'Invalid Parameter' });
            return;
        }
        const { rows } = await pool.query(
            `SELECT * FROM authorization_codes WHERE code = $1 AND client_id = $2`,
            [code, client_id]
        );

        if (rows.length === 0) {
            res.send({ status: 0, error: 'Invalid Code' });
            return;
        }
        const authCode = rows[0];

        let clientrow = await pool.query(
            `SELECT * FROM oauth_clients WHERE client_id = $1 AND client_secret = $2`,
            [client_id, client_secret]
        );

        if(clientrow.rows.length === 0){
            res.send({ status: 0, error: 'Invalid Client Credentials' });
            return;
        }

        /*const hash = generateCodeChallenge(code_verifier); //createHash('sha256').update(code_verifier).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        if (hash !== authCode.code_challenge) {
            return res.status(400).json({ error: 'PKCE verification failed' });
        }*/

        // Generate tokens
        const accessToken = sign(
            { user_id: authCode.user_id },
            'SECRET',
            { expiresIn: '1h' }
        );

        const refreshToken = uuid4();
        await pool.query(
            `INSERT INTO oauth_tokens
    (access_token, refresh_token, expires_at, client_id, user_id)
    VALUES ($1,$2,NOW()+interval '1 hour',$3,$4)`,
            [accessToken, refreshToken, client_id, authCode.user_id]
        );

        await pool.query(
            'DELETE FROM oauth_auth_codes WHERE code=$1',
            [code]
        );

        res.json({
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 3600
        });
    }
}