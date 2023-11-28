import express, { Router } from 'express';
import {getOrders, getUniqueFieldValues} from '../controllers/ordersController';

const router: Router = express.Router();

router.get('/orders', getOrders);
router.get('/unique-values/:fieldName', getUniqueFieldValues);

export default router;
