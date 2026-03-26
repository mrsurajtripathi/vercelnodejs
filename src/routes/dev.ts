import express from 'express'
import { OauthController } from '../controllers/OauthController';
const router = express.Router();
// For testing only, to create client_id and client_secret

router.post('/createclient', OauthController.createClient);

export default router;