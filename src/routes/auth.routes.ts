import express from 'express';
import {register, login, generateLink, setPassword} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/generate-activation-link/:userId', generateLink);

router.post('/set-password', setPassword);

export default router;
