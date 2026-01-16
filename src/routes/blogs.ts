import express from 'express'
import { BlogController } from '../controllers/BlogController';

const router = express.Router();

router.post('/blogs', BlogController.create);
router.get('/blogs', BlogController.get);
router.put('/blogs/:id', BlogController.updateBlog);
router.delete('/blogs/:id', BlogController.deleteBlog);
router.delete('/blogs/trash/:id', BlogController.trashBlog);
router.get("/blogs/:slug", BlogController.getBlogBySlug);
router.get('/categories', BlogController.getCategory);
router.post('/categories', BlogController.createCategory);
router.get('/tags', BlogController.getTags);

export default router;
