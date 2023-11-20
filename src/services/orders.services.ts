import Order from '../models/order.model';
import {PaginationResult} from "../types/pagination.types";

interface SortCriteria {
    [key: string]: 1 | -1;
}

const getPaginatedOrders = async (
    page: number,
    limit: number,
    sortBy: string = 'defaultField',
    sortOrder: 'asc' | 'desc' = 'asc'
): Promise<PaginationResult> => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginationResult = {currentData: []};

    let sortObject: SortCriteria = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

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

    results.currentData = await Order.find().sort(sortObject).limit(limit).skip(startIndex).exec();

    return results;
};

export default {getPaginatedOrders};

