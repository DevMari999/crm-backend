interface SortCriteria {
    [key: string]: 1 | -1;
}

export const buildSortObject = (sortBy: string, sortOrder: 'asc' | 'desc'): SortCriteria => {
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    console.log("Sort Object:", sortObj);
    return <SortCriteria>sortObj;
};

export const buildQueryObject = (searchCriteria:any) => {
    let query: any = {};
    for (let field in searchCriteria) {
        if (searchCriteria[field]) {
            query[field] = { $regex: searchCriteria[field], $options: 'i' };
        }
    }
    console.log("Query Object:", query);
    return query;
}
