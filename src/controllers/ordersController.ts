import {Request, Response} from 'express';
import * as OrdersService from '../services/orders.services';
import {
    getCourseTypeStatisticsService,
    getOrdersByMonth,
    getStatusStatisticsService,
    updateOrderById,
} from "../services/orders.services";
import {NewRequest} from "../types/order.types";


export const addComment = async (req: NewRequest, res: Response): Promise<void> => {
    console.log(`Received request to add comment to order with ID ${req.params.id}:`, req.body);
    try {
        const orderId = req.params.id;
        const comment = req.body;

        const loggedInUserId = req.user._id;

        const updatedOrder = await OrdersService.addCommentToOrder(orderId, comment, loggedInUserId);

        if (!updatedOrder) {
            console.log(`Order with ID ${orderId} not found or permission denied.`);
            res.status(404).send('Order not found or you do not have permission to add a comment');
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
        const managerId = req.query.managerId as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;
        const sortBy = (req.query.sortBy as string) || 'defaultField';
        const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
        const searchCriteria = req.query.searchCriteria ? JSON.parse(req.query.searchCriteria as string) : {};
        console.log("Parsed Search Criteria:", searchCriteria);


        const orders = await OrdersService.getPaginatedOrders(page, limit, sortBy, sortOrder, searchCriteria, managerId);

        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


export const updateOrder = async (req: NewRequest, res: Response): Promise<void> => {
    console.log('updateOrder started', req.params, req.body);
    try {
        const orderId = req.params.id;
        const updateData = req.body;
        console.log('Logged-in user!!!!!!!:', req);

        const loggedInUserId = req.user?._id;

        console.log('Updating order with ID', orderId, 'Data to update', updateData, 'User ID', loggedInUserId);

        const updatedOrder = await updateOrderById(orderId, updateData, loggedInUserId);

        console.log('Order update successful', updatedOrder);
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error in updateOrder', error);
        if (error.message.includes('Order not found or unauthorized')) {
            res.status(403).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
};


export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const orderId = req.params.orderId;
    const commentId = req.params.commentId;

    try {
        const updatedOrder = await OrdersService.deleteCommentFromOrder(orderId, commentId);

        if (!updatedOrder) {
            console.log(`Order with ID ${orderId} not found.`);
            res.status(404).send('Order not found');
        } else {
            console.log(`Comment ${commentId} deleted from order ${orderId} successfully.`);
            res.json(updatedOrder);
        }
    } catch (error) {
        console.error(`Error in deleteComment controller for order ${orderId}:`, error);
        res.status(500).send(error.message);
    }
};


export const getStatusStatisticsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await getStatusStatisticsService();
        res.json(statistics);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getOrdersByMonthController = async (req: Request, res: Response): Promise<void> => {
    try {
        const ordersByMonth = await getOrdersByMonth();
        res.status(200).json(ordersByMonth);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCourseTypeStatisticsController = async (req: Request, res: Response) => {
    try {
        const courseTypeStatistics = await getCourseTypeStatisticsService();
        res.json(courseTypeStatistics);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrdersService.fetchAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).send({message: 'Failed to fetch orders', error: error.message});
    }
};


