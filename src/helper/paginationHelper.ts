import { Pagination, PaginationResult } from "../types/general/paginationType";

export default function buildPagination(options: any): PaginationResult {
    //  console.log("pagination options : ", options);

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(page, limit, skip);

    return {
        page,
        limit,
        skip,
    };
}
