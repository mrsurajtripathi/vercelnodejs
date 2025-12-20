
import { Request, Response } from 'express';
import { pool } from '../databases/db';
import md5 from "md5";
import {sign} from 'jsonwebtoken';

export const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            console.log((process as any).apps);
            const { email, password } = req.body;
            const { rows } = await pool.query(
                'SELECT * FROM users WHERE email=$1',
                [email]
            );
            if (!rows.length) return res.status(401).json({ message: 'User not found' });
            if (md5(password) != rows[0].password) {
                return res.status(401).json({ message: 'Wrong password' });
            }
            const token = sign(
                { id: rows[0].id, role: rows[0].role, email: rows[0].email, name: rows[0].name },
                (process as any).apps.JWT_SECRET,
                { expiresIn: '1d' });
            return res.status(200).json({ token: token });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    }
}

