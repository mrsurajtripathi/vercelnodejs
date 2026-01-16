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
        const { title, content, categoryId, tags, meta_title, meta_description, meta_keywords } = req.body;
        const client = await pool.connect();
        try {
            const slug = slugify(title, { lower: true });
            await client.query("BEGIN");
            const blogResult = await client.query(
                `INSERT INTO blogs (title, slug, content, category_id,meta_title, meta_description, meta_keywords)
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
                [title, slug, content, categoryId, meta_title, meta_description, meta_keywords]
            );
            const blogId = blogResult.rows[0].id;
            for (const tag of tags) {
                const tagSlug = slugify(tag, { lower: true });
                const tagResult = await client.query(
                    `INSERT INTO tags (name, slug)
                    VALUES ($1,$2)
                    ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
                    RETURNING id`,
                    [tag, tagSlug]
                );
                await client.query(
                    `INSERT INTO blog_tags (blog_id, tag_id)
                    VALUES ($1,$2)
                    ON CONFLICT DO NOTHING`,
                    [blogId, tagResult.rows[0].id]
                );
            }
            await client.query("COMMIT");
            res.status(201).json(blogResult.rows[0]);
        } catch (err: any) {
            await client.query("ROLLBACK");
            res.status(400).json({ error: err.message });
        } finally {
            client.release();
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
    },
    getBlogBySlug: async (req: Request, res: Response) => {
        const { slug } = req.params;

        try {
            const result = await pool.query(
                `
      SELECT 
        b.id,
        b.title,
        b.slug,
        b.content,
        b.meta_title,
        b.meta_description,
        b.meta_keywords,
        b.created_at,
        c.name AS category,
        ARRAY_REMOVE(ARRAY_AGG(t.name), NULL) AS tags
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN blog_tags bt ON b.id = bt.blog_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      WHERE b.slug = $1 AND b.published = true
      GROUP BY b.id, c.name
      LIMIT 1
      `,
                [slug]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: "Blog not found" });
            }

            res.json({
                seo: {
                    title:
                        result.rows[0].meta_title || result.rows[0].title,
                    description:
                        result.rows[0].meta_description ||
                        result.rows[0].content.substring(0, 160),
                    keywords: result.rows[0].meta_keywords,
                    slug: result.rows[0].slug
                },
                blog: result.rows[0]
            });

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    },
    updateBlog: async (req: AuthRequest, res: Response) => {
        let blogId = req.params.id || undefined;
        if (!blogId) {
            res.status(200).send({ status: 1, error: 'Invalid User' });
        }
        const {
            title,
            content,
            categoryId,
            tags,
            meta_title,
            meta_description,
            meta_keywords,
            published
        } = req.body;

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Get existing blog
            const existing = await client.query(
                "SELECT * FROM blogs WHERE id = $1",
                [blogId]
            );

            if (!existing.rows.length) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Blog not found" });
            }

            const slug = title
                ? slugify(title, { lower: true })
                : existing.rows[0].slug;

            // Update blog table
            const updateBlog = await client.query(
                `
      UPDATE blogs
      SET 
        title = COALESCE($1, title),
        slug = $2,
        content = COALESCE($3, content),
        category_id = COALESCE($4, category_id),
        meta_title = COALESCE($5, meta_title),
        meta_description = COALESCE($6, meta_description),
        meta_keywords = COALESCE($7, meta_keywords),
        published = COALESCE($8, published),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
      `,
                [
                    title,
                    slug,
                    content,
                    categoryId,
                    meta_title,
                    meta_description,
                    meta_keywords,
                    published,
                    blogId
                ]
            );

            // Update tags (if provided)
            if (Array.isArray(tags)) {
                // Remove old tags
                await client.query(
                    "DELETE FROM blog_tags WHERE blog_id = $1",
                    [blogId]
                );

                // Insert new tags
                for (const tag of tags) {
                    const tagSlug = slugify(tag, { lower: true });
                    const tagResult = await client.query(
                        `
          INSERT INTO tags (name, slug)
          VALUES ($1, $2)
          ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
          `,
                        [tag, tagSlug]
                    );

                    await client.query(
                        `
          INSERT INTO blog_tags (blog_id, tag_id)
          VALUES ($1, $2)
          `,
                        [blogId, tagResult.rows[0].id]
                    );
                }
            }

            await client.query("COMMIT");

            res.json({
                message: "Blog updated successfully",
                blog: updateBlog.rows[0]
            });

        } catch (err: any) {
            await client.query("ROLLBACK");
            console.log(err.stack || err.message);
            res.status(500).json({ error: err.message });
        } finally {
            client.release();
        }
    },
    deleteBlog: async (req: AuthRequest, res: Response) => {
        let blogId = req.params.id || undefined;
        if (!blogId) {
            res.status(200).send({ status: 1, error: 'Invalid Blog' });
        }

        try {
            const result = await pool.query(
                `
      UPDATE blogs
      SET deleted_at = CURRENT_TIMESTAMP,
          published = false
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, title, slug
      `,
                [blogId]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: "Blog not found or already deleted" });
            }

            res.json({
                message: "Blog deleted successfully",
                blog: result.rows[0]
            });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    },
    trashBlog: async (req: AuthRequest, res: Response) => {
        let blogId = req.params.id || undefined;
        if (!blogId) {
            res.status(200).send({ status: 1, error: 'Invalid Blog' });
        }
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const exists = await client.query(
                "SELECT id FROM blogs WHERE id = $1",
                [blogId]
            );
            if (!exists.rows.length) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Blog not found" });
            }
            // blog_tags will auto-delete due to ON DELETE CASCADE
            await client.query("DELETE FROM blogs WHERE id = $1", [blogId]);
            await client.query("COMMIT");
            res.json({ message: "Blog permanently deleted" });
        } catch (err: any) {
            await client.query("ROLLBACK");
            res.status(500).json({ error: err.message });
        } finally {
            client.release();
        }
    },
    getTags:async(req:Request,res:Response)=>{
        const { rows } = await pool.query('SELECT * from tags ORDER BY name');
        res.json(rows);
    }
}

