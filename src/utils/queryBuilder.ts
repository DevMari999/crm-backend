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
        start_date: 'created_at',
        end_date: 'created_at',
    };

    for (let field in searchCriteria) {
        const value = searchCriteria[field];
        if (value) {
            let dbField = fieldMap[field] || field;

            if ((dbField === 'age' || dbField === 'sum') && !isNaN(Number(value))) {
                query[dbField] = Number(value);
            } else if (dbField === 'already_paid' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
                query[dbField] = value.toLowerCase() === 'true';
            } else if (dbField === 'created_at' && !isNaN(Date.parse(value))) {
                query[dbField] = {$gte: new Date(value)};
            } else {
                query[dbField] = {$regex: value, $options: 'i'};
            }
        }
    }
    console.log("Query Object:", query);
    return query;
};



