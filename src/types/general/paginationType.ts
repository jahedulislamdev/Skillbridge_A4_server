export type Pagination = {
    page?: number | string;
    limit?: number | string;
    skip?: number;
};
export type PaginationResult = {
    page: number;
    limit: number;
    skip: number;
};
