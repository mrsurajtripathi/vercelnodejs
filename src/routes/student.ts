import express from 'express'
import auth from '../middlewares/auth.middleware';
import roles from '../middlewares/roles.middleware';
import { getExams, startExam,remainingTime,submitExams } from '../controllers/StudentController';

const router = express.Router();

router.get('/exams', auth, roles('2'), getExams);
// router.post('/exams/:examId/submit', authMiddleware, rolesMiddleware('2'), submitExams);
router.post('/exams/:examId/start',auth, roles('2'), startExam);
router.get('/attempt/:attemptId/time',auth, roles('2'), remainingTime);
router.post('/attempt/:attemptId/submit', auth, roles('2'), submitExams);

export default router;
