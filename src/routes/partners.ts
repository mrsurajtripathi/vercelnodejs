import express from 'express'
import auth from '../middlewares/auth.middleware';
import roles from '../middlewares/roles.middleware';
import { oauthController } from '../controllers/OauthController';
const router = express.Router();

router.post('/', oauthController.create);
router.get('/', oauthController.getlist);

export default router;