import express, { Router } from 'express';
import UserController from '../controllers/userController'; // Adjust the path as necessary

const router: Router = express.Router();

router.get('/managers', UserController.getAllManagers);

export default router;
