import Order from '../models/order.model';

export const getStatusStatistics = async (): Promise<any> => {
    try {
        const statusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);
        return statusCounts;
    } catch (error) {
        throw new Error(`Failed to get status statistics: ${error.message}`);
    }
};

export const getCourseTypeStatistics = async (): Promise<any> => {
    try {
        const courseTypeCounts = await Order.aggregate([
            {
                $match: { course_type: { $exists: true, $ne: null } }
            },
            {
                $group: {
                    _id: '$course_type',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);
        return courseTypeCounts;
    } catch (error) {
        throw new Error(`Failed to get course type statistics: ${error.message}`);
    }
};



export const repoGetOrdersByMonth = async (): Promise<any> => {
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

