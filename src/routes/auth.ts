import express from 'express'
const router= express.Router();
import { AuthController } from '../controllers/AuthController';

router.post('/login',AuthController.login);

export default router;
