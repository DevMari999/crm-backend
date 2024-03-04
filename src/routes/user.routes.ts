import express, {Router} from 'express';
import userController from "../controllers/userController";

const router: Router = express.Router();

router.get('/managers', userController.getAllManagers);

router.get('/:id', userController.getUserById);

router.patch('/managers/ban/:id', userController.banManager);

router.patch('/managers/unban/:id', userController.unbanManager);

router.delete('/managers/:id', userController.deleteManager);
export default router;
