import {buildQueryObject, buildSortObject} from '../utils/queryBuilder';
import {IOrder} from "../types/order.types";
import mongoose from "mongoose";
import Order from '../models/order.model';
import {IComment} from "../types/order.types";

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


