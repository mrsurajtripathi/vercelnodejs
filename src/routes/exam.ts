import express from 'express'
import { examController } from '../controllers/ExamController';
import authMiddleware from '../middlewares/auth.middleware';
import rolesMiddleware from '../middlewares/roles.middleware';
import upload from '../utils/csvUploads';
const router = express.Router();

router.get('/', authMiddleware, rolesMiddleware('1'), examController.get);
router.post('/', authMiddleware, rolesMiddleware('1'), examController.create);
router.put('/', authMiddleware, rolesMiddleware('1'), examController.update);
router.delete('/', authMiddleware, rolesMiddleware('1'), examController.delete);
router.post('/:examId/upload', authMiddleware, rolesMiddleware('1'), upload.single('file'), examController.uploadcsv);
export default router;
