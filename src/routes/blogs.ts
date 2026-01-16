import express from 'express'
import { BlogController } from '../controllers/BlogController';

const router = express.Router();

router.post('/', BlogController.create);
router.get('/', BlogController.get);
router.get('/categories', BlogController.getCategory);
router.post('/categories', BlogController.createCategory);

export default router;
