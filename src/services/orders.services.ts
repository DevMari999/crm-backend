import {buildQueryObject, buildSortObject} from '../utils/queryBuilder';
import {IOrder} from "../types/order.types";
import mongoose from "mongoose";
import Order from '../models/order.model';
import {IComment} from "../types/order.types";
import { getCourseTypeStatistics, getStatusStatistics} from "../repositories/orders.repository";


export const addCommentToOrder = async (orderId: mongoose.Types.ObjectId | string, comment: IComment): Promise<IOrder | null> => {
    console.log(`Adding comment to order ${orderId}:`, comment);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {$push: {comments: comment}},
            {new: true}
        );
        console.log(`Updated order with new comment:`, updatedOrder);
        return updatedOrder;
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


export const updateOrderById = async (orderId: mongoose.Types.ObjectId | string, updateData: Partial<IOrder>) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {new: true});
        return updatedOrder;
    } catch (error) {
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
        const ordersByMonth = await Order.aggregate([
            {
                $addFields: {
                    createdAtDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$created_at" }, "date"] },
                            then: "$created_at",
                            else: { $toDate: "$created_at" }
                        }
                    }
                }
            },
            {
                $project: {
                    month: { $month: '$createdAtDate' },
                    year: { $year: '$createdAtDate' }
                }
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        return ordersByMonth;
    } catch (error) {
        throw new Error(`Failed to get orders by month: ${error.message}`);
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
