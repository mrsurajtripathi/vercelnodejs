import express from 'express'
import { userController } from '../controllers/UserController';
import auth from '../middlewares/auth.middleware';
import roles from '../middlewares/roles.middleware';


const router = express.Router();

router.get('/', auth, roles('1'), userController.get);
router.post('/', auth, roles('1'), userController.create);
router.delete('/:id', auth, roles('1'), userController.delete);
router.put('/:id', auth, roles('1'), userController.update);
router.put('/status/:id', auth, roles('1'), userController.status);
router.put('/role/:id', auth, roles('1'), userController.roleUpdate);

export default router;
