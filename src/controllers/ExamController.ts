import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { AuthRequest } from '../models/authModel';
import fs from 'fs';
import csv from 'csv-parser';

export const examController = {
    create: async (req: AuthRequest, res: Response) => {
        const { title, duration } = req.body;
        if (!title) {
            res.send({ status: 0, error: 'Title is required' });
            return;
        }
        const { rows } = await pool.query(
            `INSERT INTO exams (title, duration_minutes, created_by)
     VALUES ($1,$2,$3) RETURNING *`,
            [title, duration, req.user.id]
        );
        res.json(rows[0]);
    },
    get: async (req: AuthRequest, res: Response) => {
        const { rows } = await pool.query('SELECT * from exams');
        res.json(rows);
    },
    delete: async (req: AuthRequest, res: Response) => {
        let id = req.params.id || undefined;
        if (!id) {
            res.status(200).send({ status: 1, error: 'Invalid Parameter' });
        }
        try {
            await pool.query('DELETE FROM exams WHERE id = $1', [id]);
            res.status(200).send({ status: 1, message: 'User deleted' });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    update: async (req: AuthRequest, res: Response) => {
        try {
            let id = req.params.id || undefined;
            if (!id) {
                res.status(200).send({ status: 1, error: 'Invalid User' });
            }
            const { title, duration } = req.body;
            const result = await pool.query(
                'UPDATE exams set title=$2, duration_minutes=$3 WHERE id= $1 RETURNING *',
                [id, name]
            );
            res.status(200).send({ status: 1, message: 'Exam Updated' });
        } catch (error: any) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    },
    uploadcsv: async (req: AuthRequest, res: Response) => {
        const { examId } = req.params;
        fs.createReadStream(req.file!.path)
            .pipe(csv())
            .on('data', async (row) => {
                await pool.query(
                    `INSERT INTO questions
        (exam_id, question, option_a, option_b, option_c, option_d, correct_option, marks)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                    [
                        examId,
                        row.question,
                        row.option_a,
                        row.option_b,
                        row.option_c,
                        row.option_d,
                        row.correct_option,
                        row.marks
                    ]
                );
            })
            .on('end', () => {
                res.json({ message: 'Questions uploaded successfully' });
            });
    }
}