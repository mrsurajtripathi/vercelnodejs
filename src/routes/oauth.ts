import express from 'express'
import { oauthController } from '../controllers/OauthController';
const router = express.Router();

router.get('/authorize',oauthController.authorize);
// http://localhost:3000/oauth/authorize?response_type=code&client_id=a160c673-da31-4c75-af01-c95fd71d16d1&redirect_uri=http://localhost:3000/callback&scope=read&state=xyz

export default router;