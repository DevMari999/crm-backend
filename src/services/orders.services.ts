import {buildQueryObject, buildSortObject} from '../utils/queryBuilder.utils';
import {IComment, IOrder} from "../types/order.types";
import mongoose from "mongoose";
import Order from '../models/order.model';
import {
    getCourseTypeStatistics,
    getOrderStatsByManager,
    getStatusStatistics,
    repoGetOrdersByMonth
} from "../repositories/orders.repository";

import { Types } from 'mongoose';

export const addCommentToOrder = async (
    orderId: Types.ObjectId | string,
    comment: IComment,
    userId: string,
    managerName: string
): Promise<IOrder | null> => {
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return null;
        }

        const update: {
            $push: { comments: IComment };
            $set?: { manager?: string; managerName?: string; status?: string };
        } = {
            $push: { comments: comment }
        };

        if (order.manager === " ") {
            update.$set = {
                ...(update.$set || {}),
                manager: userId,
                managerName: managerName
            };
        }

        if (order.status === " " || order.status === null) {
            update.$set = {
                ...(update.$set || {}),
                status: 'in work'
            };
        }

        return await Order.findByIdAndUpdate(orderId, update, { new: true });
    } catch (error) {
        throw error;
    }
};



export const deleteCommentFromOrder = async (orderId: mongoose.Types.ObjectId | string, commentId: string): Promise<IOrder | null> => {
    try {
        return await Order.findByIdAndUpdate(
            orderId,
            {$pull: {comments: {_id: commentId}}},
            {new: true}
        );
    } catch (error) {
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

    const startIndex = (page - 1) * limit;
    const queryObject = buildQueryObject(searchCriteria);
    const sortObject = buildSortObject(sortBy, sortOrder);

    if (managerId) {
        queryObject.manager = managerId;
    }

    const totalDocuments = await Order.countDocuments(queryObject);
    const totalPages = Math.ceil(totalDocuments / limit);
    const currentData = await Order.find(queryObject).sort(sortObject).limit(limit).skip(startIndex);

    return {currentData, totalPages};
};

export const updateOrderById = async (
    orderId: mongoose.Types.ObjectId | string,
    updateData: Partial<IOrder>,
    loggedInUserId: string | undefined
) => {
    try {
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            throw new Error('Order not found');
        }

        if (currentOrder.manager === "" && loggedInUserId) {
            updateData.manager = loggedInUserId;
        } else if (updateData.status === 'new') {
            updateData.manager = "";
        }

        if (updateData.status === null || updateData.status === 'new') {
            updateData.status = 'in work';
        }

        const updatedOrder = await Order.findOneAndUpdate(
            {
                _id: orderId,
                $or: [{manager: loggedInUserId}, {manager: ""}, {_id: currentOrder._id}],
            },
            updateData,
            {new: true}
        );

        if (!updatedOrder) {
            throw new Error('Unauthorized to edit this order');
        }

        return updatedOrder;
    } catch (error) {
        throw error;
    }
};


export const getStatusStatisticsService = async (): Promise<any> => {
    try {
        return await getStatusStatistics();
    } catch (error) {
        throw error;
    }
};

export const getOrdersByMonth = async (): Promise<any> => {
    try {
        return await repoGetOrdersByMonth();
    } catch (error) {
        throw error;
    }
};

export const getCourseTypeStatisticsService = async () => {
    try {
        return await getCourseTypeStatistics();
    } catch (error) {
        throw new Error(`Failed to fetch course type statistics: ${error.message}`);
    }
};

export const fetchAllOrders = async () => {
    try {
        return await Order.find({});
    } catch (error) {
        throw error;
    }
};

export const fetchUniqueGroupNames = async (): Promise<string[]> => {
    const result = await Order.aggregate([
        {$unwind: '$group'},
        {$group: {_id: '$group'}},
        {$project: {_id: 0, name: '$_id'}}
    ]);
    return result.map(item => item.name);
};

export const getOrderStatsByManagerService = async () => {
    try {
        return await getOrderStatsByManager();
    } catch (error) {
        throw new Error('Service failed to retrieve order statistics');
    }
};


export const findCommentsByOrderId = async (orderId: string) => {
    const order = await Order.findById(orderId).select('comments');
    if (!order) {
        throw new Error('Order not found');
    }
    return order.comments;
};
