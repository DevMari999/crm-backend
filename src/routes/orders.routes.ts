import express, {Router} from 'express';
import {getOrders, updateOrder, addComment, deleteComment} from "../controllers/ordersController";

const router: Router = express.Router();

router.get('/orders', getOrders);

router.post('/orders/:id/comments', addComment);

router.put('/orders/:id', updateOrder);

router.delete('/orders/:orderId/comments/:commentId', deleteComment);


export default router;
