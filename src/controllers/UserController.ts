
import { Request, Response } from 'express';
import { pool } from '../databases/db';
import md5 from "md5";

export const userController = {
    get: async (req: Request, res: Response) => {
        const client = await pool.connect();
        try {
            const { rows } = await pool.query('SELECT * FROM users');
            res.send(rows);
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            const result = await pool.query(
                'INSERT INTO users(name,email,password_hash,is_active,role) VALUES($1, $2, $3, $4,$5) RETURNING *',
                [name, email, password, 1, 1]
            );
            res.status(200).send({ status: 1, message: 'User Added', userid: result.rows[0].id });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    delete: async (req: Request, res: Response) => {
        console.log(req.params.id);
        let id = req.params.id || undefined;
        if (!id) {
            res.status(200).send({ status: 1, error: 'Invalid Parameter' });
        }
        try {
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
            res.status(200).send({ status: 1, message: 'User deleted'});
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            let id = req.params.id || undefined;
            const { name, email, password } = req.body;
            const result = await pool.query(
                'UPDATE users set  WHERE id= $1 RETURNING *',
                [id]
            );
            res.status(200).send({ status: 1, message: 'User Added', userid: result.rows[0].id });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    }
}