import { Request, Response } from 'express';
import { pool } from '../databases/db';
import { AuthRequest } from '../models/authModel';
const slugify = require("slugify");
export const BlogController = {
    getCategory: async (req: AuthRequest, res: Response) => {
        const { rows } = await pool.query('SELECT * from categories ORDER BY name');
        res.json(rows);
    },
    createCategory: async (req: AuthRequest, res: Response) => {
        const { name, slug } = req.body;
        const result = await pool.query(
            "INSERT INTO categories(name, slug) VALUES($1, $2) RETURNING *",
            [name, slug]
        );
        res.status(201).json(result.rows[0]);
    },
    create: async (req: AuthRequest, res: Response) => {
        const { title, content, categoryId, tags } = req.body;
        try {
            const slug = slugify(title, { lower: true });
            const blogResult = await pool.query(
                `INSERT INTO blogs (title, slug, content, category_id)
                VALUES ($1,$2,$3,$4) RETURNING *`,
                [title, slug, content, categoryId]
            );
            const blogId = blogResult.rows[0].id;
            for (const tag of tags) {
                const tagSlug = slugify(tag, { lower: true });
                const tagResult = await pool.query(
                    `INSERT INTO tags (name, slug)
                    VALUES ($1,$2)
                    ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
                    RETURNING id`,
                    [tag, tagSlug]
                );
                await pool.query(
                    `INSERT INTO blog_tags (blog_id, tag_id)
                    VALUES ($1,$2)
                    ON CONFLICT DO NOTHING`,
                    [blogId, tagResult.rows[0].id]
                );
            }
            res.status(201).json(blogResult.rows[0]);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    },
    get: async (req: AuthRequest, res: Response) => {
        try {
            const result = await pool.query(`
      SELECT 
        b.id, b.title, b.slug, b.content,
        c.name AS category,
        ARRAY_AGG(t.name) AS tags
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN blog_tags bt ON b.id = bt.blog_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      GROUP BY b.id, c.name
      ORDER BY b.created_at DESC
    `);

            res.json(result.rows);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}