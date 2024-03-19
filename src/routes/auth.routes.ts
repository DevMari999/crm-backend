import express from 'express';
import {
    register,
    login,
    generateLink,
    setPassword,
    getUserDetails, refresh, logout,
} from '../controllers/auth.controller';
import { validateEmail, validatePassword} from "../middlewares/auth.middleware";


const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Bad request
 */

router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Allows users to login. The email must meet specific validation criteria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be a valid email address.
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request (invalid email format)
 */

router.post('/login', validateEmail, login);

/**
 * @swagger
 * /api/auth/generate-activation-link/{userId}:
 *   post:
 *     summary: Generate activation link
 *     description: Generates an activation link for the user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link generated successfully
 *       404:
 *         description: User not found
 */
router.post('/generate-activation-link/:userId', generateLink);

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     summary: Set or update user password
 *     description: Allows users to set or update their password. The password must meet specific validation criteria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Must meet password complexity requirements.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request (password does not meet complexity requirements)
 */

router.post('/set-password', validatePassword, setPassword);

/**
 * @swagger
 * /api/auth/user-details:
 *   get:
 *     summary: Get user details
 *     description: Retrieves details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user-details',  getUserDetails);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     description: Refreshes the authentication token for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshToken'
 *       401:
 *         description: Unauthorized
 */

router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the current user and invalidates the session.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', logout);

export default router;
