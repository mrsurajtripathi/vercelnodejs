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
    },
    genCode: async (req: Request, res: Response) => {
        const {
            client_id,
            redirect_uri,
            email,
            password,
            code_challenge,
            code_challenge_method
        } = req.query;

        const clientRes = await pool.query(
            'SELECT * FROM oauth_clients WHERE client_id=$1',
            [client_id]
        );

        const client = clientRes.rows[0];
        if (!client || client.redirect_uri !== redirect_uri) {
            return res.status(400).send("Invalid client");
        }

        // authenticate user
        const userRes = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        );

        const user = userRes.rows[0];
        // if (!user || !compareSync(password, user.password_hash)) {
        //     return res.status(401).send("Invalid login");
        // }

        const code = uuidv4();

        await pool.query(
            `INSERT INTO authorization_codes 
     (code, client_id, user_id, code_challenge, code_challenge_method, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6)`,
            [
                code,
                client_id,
                user.id,
                code_challenge,
                code_challenge_method,
                Date.now() + 5 * 60 * 1000
            ]
        );
    },
    authorize: async (req: Request, res: Response) => {
        const {
            client_id,
            redirect_uri,
            code_challenge,
            code_challenge_method,
            state
        } = req.query;

        // Validate client
        const client = await pool.query(
            'SELECT * FROM oauth_clients WHERE client_id=$1',
            [client_id]
        );

        if (!client.rows.length) {
            return res.status(400).send('Invalid client');
        }
        res.send(`
            <form method="POST" action="/oauth/login">
            <input name="email" />
            <input name="password" type="password" />
            <input type="hidden" name="client_id" value="${client_id}" />
            <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
            <input type="hidden" name="code_challenge" value="${code_challenge}" />
            <input type="hidden" name="code_challenge_method" value="${code_challenge_method}" />
            <input type="hidden" name="state" value="${state}" />
            <button>Login</button>
            </form>
        `);
    }
}