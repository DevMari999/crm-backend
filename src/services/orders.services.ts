import {buildQueryObject, buildSortObject} from '../utils/queryBuilder.utils';
import {IOrder} from "../types/order.types";
import mongoose from "mongoose";
import Order from '../models/order.model';
import {IComment} from "../types/order.types";
import {getCourseTypeStatistics, getStatusStatistics, repoGetOrdersByMonth} from "../repositories/orders.repository";


export const addCommentToOrder = async (
    orderId: mongoose.Types.ObjectId | string,
    comment: IComment,
    userId: string
): Promise<IOrder | null> => {
    console.log(`Adding comment to order ${orderId} by user ${userId}:`, comment);
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            console.log(`Order with ID ${orderId} not found.`);
            return null;
        }

        if (!order.manager || order.manager.toString() === userId) {
            const update = !order.manager ? {$push: {comments: comment}, $set: {manager: userId}} : {$push: {comments: comment}};
            const updatedOrder = await Order.findByIdAndUpdate(orderId, update, {new: true});
            console.log(`Updated order with new comment:`, updatedOrder);
            return updatedOrder;
        } else {
            console.error(`User ${userId} does not have permission to add comment to order ${orderId}.`);
            throw new Error('Permission denied');
        }
    } catch (error) {
        console.error(`Error adding comment to order ${orderId}:`, error);
        throw error;
    }
};


export const deleteCommentFromOrder = async (orderId: mongoose.Types.ObjectId | string, commentId: string): Promise<IOrder | null> => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {$pull: {comments: {_id: commentId}}},
            {new: true}
        );
        console.log(`Comment ${commentId} deleted from order ${orderId}:`, updatedOrder);
        return updatedOrder;
    } catch (error) {
        console.error(`Error deleting comment ${commentId} from order ${orderId}:`, error);
        throw error;
    }
};


interface PaginationResult {
    currentData: IOrder[];
    totalPages: number;
}

export const getPaginatedOrders = async (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchCriteria: any,
    managerId?: string
): Promise<PaginationResult> => {
    console.log("Received parameters:", { page, limit, sortBy, sortOrder, searchCriteria, managerId });

    const startIndex = (page - 1) * limit;
    console.log("Start Index:", startIndex);

    const queryObject = buildQueryObject(searchCriteria);
    console.log("Query Object:", queryObject);

    const sortObject = buildSortObject(sortBy, sortOrder);
    console.log("Sort Object:", sortObject);

    if (managerId) {
        queryObject.manager = managerId;
        console.log("Manager ID:", managerId);
    }

    const totalDocuments = await Order.countDocuments(queryObject);
    console.log("Total Documents:", totalDocuments);

    const totalPages = Math.ceil(totalDocuments / limit);
    console.log("Total Pages:", totalPages);

    const currentData = await Order.find(queryObject).sort(sortObject).limit(limit).skip(startIndex);


    return { currentData, totalPages };
};


export const updateOrderById = async (
    orderId: mongoose.Types.ObjectId | string,
    updateData: Partial<IOrder>,
    loggedInUserId: string | undefined
) => {
    console.log('updateOrderById started', { orderId, updateData, loggedInUserId });
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            {
                _id: orderId,
                $or: [{ manager: loggedInUserId }, { manager: "" }],
            },
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            console.log('Order not found or unauthorized to edit');
            throw new Error('Order not found or unauthorized to edit this order');
        }

        console.log('Order updated successfully', updatedOrder);
        return updatedOrder;
    } catch (error) {
        console.error('Error in updateOrderById', error);
        throw error;
    }
};


export const getStatusStatisticsService = async (): Promise<any> => {
    try {
        const statusStatistics = await getStatusStatistics();
        return statusStatistics;
    } catch (error) {
        throw error;
    }
};

export const getOrdersByMonth = async (): Promise<any> => {
    try {
        return await repoGetOrdersByMonth();
    } catch (error) {
        console.error(`Error fetching orders by month: ${error}`);
        throw error;
    }
};

export const getCourseTypeStatisticsService = async () => {
    try {
        const courseTypeStatistics = await getCourseTypeStatistics();
        return courseTypeStatistics;
    } catch (error) {
        throw new Error(`Failed to fetch course type statistics: ${error.message}`);
    }
};


export const fetchAllOrders = async () => {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw error;
    }
};


