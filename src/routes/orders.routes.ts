import express, { Router } from 'express';
import { getOrders } from '../controllers/ordersController';

const router: Router = express.Router();

router.get('/orders', getOrders);

export default router;
