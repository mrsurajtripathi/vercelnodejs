import { AuthRequest } from "../models/authModel";
import { Request, Response } from 'express';
import { pool } from '../databases/db';

export const getExams = async (_: AuthRequest, res: Response) => {
    const { rows } = await pool.query('SELECT * FROM exams');
    res.json(rows);
};

export const submitExam = async (req: AuthRequest, res: Response) => {
    const { examId } = req.params;
    const { answers } = req.body;

    const { rows } = await pool.query(
        `INSERT INTO exam_attempts (exam_id, student_id) VALUES ($1,$2) RETURNING id`,
        [examId, req.user.id]
    );

    const attemptId = rows[0].id;
    let score = 0;

    for (const a of answers) {
        const q = await pool.query(
            'SELECT correct_option, marks FROM questions WHERE id=$1',
            [a.question_id]
        );

        if (q.rows[0].correct_option === a.selected_option) {
            score += q.rows[0].marks;
        }
    }

    await pool.query(
        'UPDATE exam_attempts SET score=$1 WHERE id=$2',
        [score, attemptId]
    );

    res.json({ score });
};


export const submitExams = async (req: AuthRequest, res: Response) => {
  const { attemptId } = req.params;
  const { answers } = req.body;

  const attempt = await pool.query(
    'SELECT * FROM exam_attempts WHERE id=$1',
    [attemptId]
  );

  if (!attempt.rows.length)
    return res.status(404).json({ message: 'Attempt not found' });

  if (attempt.rows[0].is_submitted)
    return res.status(400).json({ message: 'Already submitted' });

  // Auto-submit if time expired
  const now = new Date();
  if (now > attempt.rows[0].end_time) {
    console.log('⏱ Auto submitting exam...');
  }

  let score = 0;

  for (const a of answers) {
    const q = await pool.query(
      'SELECT correct_option, marks FROM questions WHERE id=$1',
      [a.question_id]
    );

    if (q.rows[0].correct_option === a.selected_option) {
      score += q.rows[0].marks;
    }
  }

  await pool.query(
    `
    UPDATE exam_attempts
    SET score=$1, is_submitted=TRUE, submitted_at=NOW()
    WHERE id=$2
    `,
    [score, attemptId]
  );

  res.json({ score });
};



export const startExam = async (req: AuthRequest, res: Response) => {
  const { examId } = req.params;

  // Get exam duration
  const exam = await pool.query(
    'SELECT duration_minutes FROM exams WHERE id=$1',
    [examId]
  );

  if (!exam.rows.length)
    return res.status(404).json({ message: 'Exam not found' });

  const duration = exam.rows[0].duration_minutes;

  const { rows } = await pool.query(
    `
    INSERT INTO exam_attempts (exam_id, student_id, start_time, end_time)
    VALUES ($1, $2, NOW(), NOW() + ($3 || ' minutes')::INTERVAL)
    RETURNING *
    `,
    [examId, req.user.id, duration]
  );

  res.json({
    attemptId: rows[0].id,
    start_time: rows[0].start_time,
    end_time: rows[0].end_time
  });
};


export const remainingTime = async (req: AuthRequest, res: Response) => {
  const { attemptId } = req.params;

  const { rows } = await pool.query(
    `
    SELECT EXTRACT(EPOCH FROM (end_time - NOW())) AS remaining
    FROM exam_attempts
    WHERE id=$1 AND student_id=$2
    `,
    [attemptId, req.user.id]
  );

  if (!rows.length)
    return res.status(404).json({ message: 'Attempt not found' });

  const remaining = Math.max(0, Math.floor(rows[0].remaining));
  res.json({ remaining_seconds: remaining });
};
