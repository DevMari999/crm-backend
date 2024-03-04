interface SortCriteria {
    [key: string]: 1 | -1;
}

export const buildSortObject = (sortBy: string, sortOrder: 'asc' | 'desc'): SortCriteria => {
    const sortObj = {[sortBy]: sortOrder === 'asc' ? 1 : -1};
    console.log("Sort Object:", sortObj);
    return <SortCriteria>sortObj;
};

export const buildQueryObject = (searchCriteria: any) => {
    let query: any = {};
    const fieldMap: { [key: string]: string } = {
        format: 'course_format',
        type: 'course_type',
    };

    let startDate, endDate;

    for (let field in searchCriteria) {
        const value = searchCriteria[field];
        if (value !== undefined && value !== '') {
            if (field === 'start_date') {
                startDate = new Date(value); // Parse the date string
                startDate.setHours(0, 0, 0, 0);
                continue;
            } else if (field === 'end_date') {
                endDate = new Date(value); // Parse the date string
                endDate.setHours(23, 59, 59, 999);
                continue;
            }

            let dbField = fieldMap[field] || field;
            if ((dbField === 'age' || dbField === 'sum') && !isNaN(Number(value))) {
                query[dbField] = Number(value);
            } else if (dbField === 'already_paid' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
                query[dbField] = value.toLowerCase() === 'true';
            } else {
                query[dbField] = {$regex: value, $options: 'i'};
            }
        }
    }

    if (startDate || endDate) {
        query['created_at'] = {};
        if (startDate) {
            query['created_at']['$gte'] = startDate.toISOString(); // Convert date to ISO string
        }
        if (endDate) {
            query['created_at']['$lte'] = endDate.toISOString(); // Convert date to ISO string
        }
    }

    console.log("Query Object:", query);
    return query;
};

