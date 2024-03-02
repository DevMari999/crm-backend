import express, {Router} from 'express';
import userController from "../controllers/userController";

const router: Router = express.Router();

router.get('/managers', userController.getAllManagers);

router.get('/:id', userController.getUserById);
export default router;
