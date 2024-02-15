import { Request, Response } from 'express';
import * as OrdersService from '../services/orders.services';

export const addComment = async (req: Request, res: Response): Promise<void> => {
    console.log(`Received request to add comment to order with ID ${req.params.id}:`, req.body);
    try {
        const orderId = req.params.id;
        const comment = req.body;

        const updatedOrder = await OrdersService.addCommentToOrder(orderId, comment);

        if (!updatedOrder) {
            console.log(`Order with ID ${orderId} not found.`);
            res.status(404).send('Order not found');
        } else {
            console.log(`Comment added to order ${orderId} successfully.`);
            res.json(updatedOrder);
        }
    } catch (error) {
        console.error(`Error in addComment controller for order ${req.params.id}:`, error);
        res.status(500).send(error.message);
    }
};


export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;
        const sortBy = (req.query.sortBy as string) || 'defaultField';
        const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
        const searchCriteria = req.query.searchCriteria ? JSON.parse(req.query.searchCriteria as string) : {};
        console.log("Parsed Search Criteria:", searchCriteria);
        const orders = await OrdersService.getPaginatedOrders(page, limit, sortBy, sortOrder, searchCriteria);

        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const updateData = req.body;

        const updatedOrder = await OrdersService.updateOrderById(orderId, updateData);

        if (!updatedOrder) {
            res.status(404).send('Order not found');
        } else {
            res.json(updatedOrder);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
