import express from "express";
const router = express.Router();
import { OauthController } from "../controllers/OauthController";
router.post("/authorize", OauthController.createClient);

export default router;