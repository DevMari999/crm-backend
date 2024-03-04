import express, {Router} from 'express';
import {
    getOrders,
    updateOrder,
    addComment,
    deleteComment,
    getAllOrders,
    getStatusStatisticsController, getOrdersByMonthController, getCourseTypeStatisticsController
} from "../controllers/ordersController";

const router: Router = express.Router();

router.get('/orders', getOrders);

router.post('/orders/:id/comments', addComment);

router.put('/orders/:id', updateOrder);

router.delete('/orders/:orderId/comments/:commentId', deleteComment);

router.get('/orders/status-statistics', getStatusStatisticsController);

router.get('/orders-by-month', getOrdersByMonthController);

router.get('/course-type-statistics', getCourseTypeStatisticsController);

router.get('/orders/exel', getAllOrders);


export default router;
