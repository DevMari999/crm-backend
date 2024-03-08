import express from 'express';
import {
    register,
    login,
    generateLink,
    setPassword,
    getUserDetails, refresh, logout,
} from '../controllers/authController';
import {authenticate} from "../middlewares/authMiddleware";


const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/generate-activation-link/:userId', generateLink);

router.post('/set-password', setPassword);

router.get('/user-details', authenticate, getUserDetails);

router.post('/refresh', refresh);

router.post('/logout', logout);
export default router;
