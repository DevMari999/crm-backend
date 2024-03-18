import express, {Router} from 'express';
import {
    getOrders,
    updateOrder,
    addComment,
    deleteComment,
    getAllOrders,
    getStatusStatisticsController,
    getOrdersByMonthController,
    getCourseTypeStatisticsController,
    getUniqueGroupNames,
    getOrderStatsByManagerController
} from "../controllers/orders.controller";
import {authenticate} from "../middlewares/auth.middleware";
import {canAddCommentToOrder, checkUserIsManagerOfOrder, validateOrderUpdate} from "../middlewares/orders.middlewar";

const router: Router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     description: Fetches a list of orders with optional filtering and pagination.
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', getOrders);

/**
 * @swagger
 * /api/orders/{id}/comments:
 *   post:
 *     summary: Add a comment to an order
 *     description: Allows authorized users (e.g., admin, manager) to add comments to an order. Authentication and authorization are required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not allowed to add comment)
 */


router.post('/:id/comments/', authenticate, canAddCommentToOrder, addComment);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     description: Allows updating an order's details. Requires authentication and validation of the order update.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Bad request (validation failed)
 *       401:
 *         description: Unauthorized (authentication required)
 */


router.put('/:id', authenticate, validateOrderUpdate, updateOrder);

/**
 * @swagger
 * /api/orders/{orderId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from an order
 *     description: Allows authorized users (e.g., admin, manager) to delete a comment from an order. Authentication and manager authorization are required.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID to delete
 *     responses:
 *       204:
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not manager of order)
 */

router.delete('/:orderId/comments/:commentId', authenticate, checkUserIsManagerOfOrder, deleteComment);

/**
 * @swagger
 * /api/orders/status-statistics:
 *   get:
 *     summary: Get statistics by order status
 *     description: Retrieves statistics of orders categorized by their status.
 *     responses:
 *       200:
 *         description: Statistics by order status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusStatistics'
 */

router.get('/status-statistics', getStatusStatisticsController);

/**
 * @swagger
 * /api/orders/orders-by-month:
 *   get:
 *     summary: Get orders by month
 *     description: Retrieves a count of orders grouped by month.
 *     responses:
 *       200:
 *         description: Orders count by month
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersByMonth'
 */
router.get('/orders-by-month', getOrdersByMonthController);

/**
 * @swagger
 * /api/orders/course-type-statistics:
 *   get:
 *     summary: Get statistics by course type
 *     description: Retrieves statistics of orders categorized by course type.
 *     responses:
 *       200:
 *         description: Statistics by course type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseTypeStatistics'
 */
router.get('/course-type-statistics', getCourseTypeStatisticsController);

/**
 * @swagger
 * /api/orders/excel:
 *   get:
 *     summary: Export orders to Excel
 *     description: Downloads an Excel file containing all orders.
 *     responses:
 *       200:
 *         description: Excel file of orders
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/excel', getAllOrders);

/**
 * @swagger
 * /api/orders/groups/unique-names:
 *   get:
 *     summary: Get unique order group names
 *     description: Retrieves a list of unique order group names.
 *     responses:
 *       200:
 *         description: A list of unique group names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/groups/unique-names', getUniqueGroupNames);

/**
 * @swagger
 * /api/orders/order-stats-by-manager:
 *   get:
 *     summary: Get order statistics by manager
 *     description: Retrieves order statistics categorized by manager.
 *     responses:
 *       200:
 *         description: Order statistics by manager
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatsByManager'
 */
router.get('/order-stats-by-manager', getOrderStatsByManagerController);

export default router;
