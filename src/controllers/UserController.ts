
import { Request, Response } from 'express';
import { pool } from '../databases/db';
import md5 from "md5";

export const userController = {
    get: async (req: Request, res: Response) => {
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
                'INSERT INTO users(name,email,password,status,role) VALUES($1, $2, $3, $4,$5) RETURNING *',
                [name, email, md5(password) , 0 ,2]
            );
            res.status(200).send({ status: 1, message: 'User Added', userid: result.rows[0].id });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    delete: async (req: Request, res: Response) => {
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
            if (!id) {
                res.status(200).send({ status: 1, error: 'Invalid User' });
            }
            const { name, password } = req.body;
            const result = await pool.query(
                'UPDATE users set name=$2, password=$3 WHERE id= $1 RETURNING *',
                [id,name,md5(password)]
            );
            res.status(200).send({ status: 1, message: 'User Updated', userid: result.rows[0].id });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    status:async (req:Request,res:Response)=>{
        try {
            let id = req.params.id || undefined;
            if (!id) {
                res.status(200).send({ status: 1, error: 'Invalid User' });
            }
            const { status } = req.body; 
            const result = await pool.query(
                'UPDATE users set status=$2 WHERE id= $1 RETURNING *',
                [id,status]
            );
            res.status(200).send({ status: 1, message: 'User Updated', userid: result.rows[0].id });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    roleUpdate:async (req:Request,res:Response)=>{
      try {
            let id = req.params.id || undefined;
            const { roleid } = req.body;
            if([1,2].indexOf(roleid)==-1){
                res.status(422).send({ status: 0, error: 'Invalid Role Type' }); 
                return;
            }
            const result = await pool.query(
                'UPDATE users set status=$2 WHERE id= $1 RETURNING *',
                [id,roleid]
            );
            res.status(200).send({ status: 1, message: 'Role Updated'});
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }  
    }
}