import express, {Router} from 'express';
import userController from "../controllers/user.controller";
import isAdmin from "../middlewares/authorise.middleware";
import {authenticate} from "../middlewares/auth.middleware"

const router: Router = express.Router();

/**
 * @swagger
 * /api/users/managers:
 *   get:
 *     tags: [Users]
 *     summary: Get all managers
 *     description: Retrieves a list of all managers. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of managers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/managers', userController.getAllManagers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     description: Retrieves detailed information about a user by their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: Detailed information about the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users/managers/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a manager
 *     description: Permanently deletes a manager's record from the system by their unique identifier. Requires admin permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the manager to be deleted
 *     responses:
 *       204:
 *         description: Manager deleted successfully
 *       404:
 *         description: Manager not found
 */


router.patch('/managers/ban/:id', authenticate, isAdmin, userController.banManager);

/**
 * @swagger
 * /api/users/managers/unban/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Unban a manager
 *     description: Removes a ban from a manager by their unique identifier, restoring their access to previously restricted functionalities. Requires admin permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the manager to be unbanned
 *     responses:
 *       200:
 *         description: Manager unbanned successfully
 *       404:
 *         description: Manager not found
 */

router.patch('/managers/unban/:id', authenticate, isAdmin, userController.unbanManager);

/**
 * @swagger
 * /api/users/managers/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a manager
 *     description: Permanently deletes a manager's record from the system by their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the manager to be deleted
 *     responses:
 *       204:
 *         description: Manager deleted successfully
 *       404:
 *         description: Manager not found
 */
router.delete('/managers/:id', authenticate, isAdmin, userController.deleteManager);

export default router;
