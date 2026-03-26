import express from 'express'
const router = express.Router();
import { AuthController } from '../controllers/AuthController';
import { userController } from '../controllers/UserController';
import { OauthController } from '../controllers/OauthController';

router.post('/login', AuthController.login);
router.post('/register', userController.register);
export default router;
