import Order from '../models/order.model';

export const getStatusStatistics = async (): Promise<any> => {
    try {
        return await Order.aggregate([
            {
                $addFields: {
                    adjustedStatus: {
                        $cond: {
                            if: {$or: [{$eq: ['$status', null]}, {$eq: ['$status', 'new']}]},
                            then: 'new',
                            else: '$status'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$adjustedStatus',
                    count: {$sum: 1}
                }
            },
            {
                $sort: {'_id': 1}
            }
        ]);
    } catch (error) {
        throw new Error(`Failed to get status statistics: ${error.message}`);
    }
};


export const getCourseTypeStatistics = async (): Promise<any> => {
    try {
        return await Order.aggregate([
            {
                $match: {course_type: {$exists: true, $ne: null}}
            },
            {
                $group: {
                    _id: '$course_type',
                    count: {$sum: 1}
                }
            },
            {
                $sort: {'_id': 1}
            }
        ]);
    } catch (error) {
        throw new Error(`Failed to get course type statistics: ${error.message}`);
    }
};


export const repoGetOrdersByMonth = async (): Promise<any> => {
    try {
        return await Order.aggregate([
            {
                $addFields: {
                    createdAtDate: {
                        $cond: {
                            if: {$eq: [{$type: "$created_at"}, "date"]},
                            then: "$created_at",
                            else: {$toDate: "$created_at"}
                        }
                    }
                }
            },
            {
                $project: {
                    month: {$month: '$createdAtDate'},
                    year: {$year: '$createdAtDate'}
                }
            },
            {
                $group: {
                    _id: {month: '$month', year: '$year'},
                    count: {$sum: 1}
                }
            },
            {
                $sort: {'_id.year': 1, '_id.month': 1}
            }
        ]);
    } catch (error) {
        throw new Error(`Failed to get orders by month: ${error.message}`);
    }
};

export const getOrderStatsByManager = async () => {
    try {
        const stats = await Order.aggregate([
            {$match: {$and: [{manager: {$ne: null}}, {manager: {$ne: ""}}]}},

            {
                $lookup: {
                    from: "users",
                    let: {managerId: {$toObjectId: "$manager"}},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$_id", "$$managerId"]}}}
                    ],
                    as: "managerDetails"
                }
            },
            {$unwind: "$managerDetails"},

            {
                $group: {
                    _id: {manager: "$manager", status: "$status"},
                    count: {$sum: 1}
                }
            },

            {
                $group: {
                    _id: "$_id.manager",
                    statuses: {$push: {status: "$_id.status", count: "$count"}},
                    totalOrders: {$sum: "$count"}
                }
            },

            {
                $project: {
                    _id: 0,
                    manager: "$_id",
                    statuses: 1,
                    totalOrders: 1
                }
            }
        ]);
        console.log(stats);
        return stats;

    } catch (error) {
        console.error('Failed to get order stats by manager:', error);
        throw error;
    }
};


