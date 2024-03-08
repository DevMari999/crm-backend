import express, {Router} from 'express';
import {
    getOrders,
    updateOrder,
    addComment,
    deleteComment,
    getAllOrders,
    getStatusStatisticsController, getOrdersByMonthController, getCourseTypeStatisticsController
} from "../controllers/ordersController";
import {authenticate} from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.get('/orders', getOrders);

router.post('/orders/:id/comments', authenticate, addComment);

router.put('/orders/:id', authenticate, updateOrder);

router.delete('/orders/:orderId/comments/:commentId', deleteComment);

router.get('/orders/status-statistics', getStatusStatisticsController);

router.get('/orders-by-month', getOrdersByMonthController);

router.get('/course-type-statistics', getCourseTypeStatisticsController);

router.get('/orders/exel', getAllOrders);


export default router;
