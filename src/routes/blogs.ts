import express from 'express'
import { BlogController } from '../controllers/BlogController';

const router= express.Router();

router.get('/',BlogController.create);

export default router;
