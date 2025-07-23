import express from 'express'
import { BlogController } from '../controllers/blogController';

const router= express.Router();

router.get('/',BlogController.create);

export default router;
