export interface PaginationResult  {
    next?: {
        page: number;
        limit: number;
    };
    previous?: {
        page: number;
        limit: number;
    };
    currentData: any[];
    totalPages: number;
}
