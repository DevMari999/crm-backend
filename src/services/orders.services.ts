import Order from '../models/order.model';
import {PaginationResult} from "../types/pagination.types";

const getPaginatedOrders = async (page: number, limit: number): Promise<PaginationResult> => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginationResult = {currentData: []};

    if (endIndex < await Order.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.currentData = await Order.find().limit(limit).skip(startIndex).exec();

    return results;
};

export default {getPaginatedOrders};
