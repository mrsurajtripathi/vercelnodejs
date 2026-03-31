import express from 'express'
import { oauthController } from '../controllers/OauthController';
const router = express.Router();

router.get('/authorize',oauthController.authorize);
// http://localhost:3000/oauth/authorize?response_type=code&client_id=a160c673-da31-4c75-af01-c95fd71d16d1&redirect_uri=http://localhost:3000/callback&scope=read&state=xyz
// https://auth.surajtripathi.com/oauth/authorize?response_type=code&client_id=a160c673-da31-4c75-af01-c95fd71d16d1&redirect_uri=https://example.com/callback&scope=read&state=xyz
//GET https://auth.surajtripathi.com/oauth/authorize?client_id=abc123&redirect_uri=http://localhost:5173/callback&response_type=code&code_challenge=XYZ&code_challenge_method=S256&state=abc

export default router;