import { Request, Response } from 'express';
import OrdersService from '../services/orders.services';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const orders = await OrdersService.getPaginatedOrders(page, limit);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
