import { Request, Response } from 'express';
import OrdersService from '../services/orders.services';
import Order from "../models/order.model";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;
        const sortBy = req.query.sortBy as string || 'defaultField';
        const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc';
        const searchCriteria = req.query.searchCriteria ? JSON.parse(req.query.searchCriteria as string) : {};

        const orders = await OrdersService.getPaginatedOrders(page, limit, sortBy, sortOrder, searchCriteria);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUniqueFieldValues = async (req: Request, res: Response): Promise<void> => {
    try {
        const fieldName = req.params.fieldName;
        const uniqueValues = await Order.distinct(fieldName);
        res.json(uniqueValues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
