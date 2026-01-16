import express from 'express'
import { BlogController } from '../controllers/BlogController';

const router = express.Router();

router.post('/', BlogController.create);
router.get('/', BlogController.get);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);
router.delete('/trash/:id', BlogController.trashBlog);
router.get("/:slug", BlogController.getBlogBySlug);
router.get('/categories', BlogController.getCategory);
router.post('/categories', BlogController.createCategory);

export default router;
