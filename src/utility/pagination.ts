import { pagination } from "../types";

export default class PaginationUtility {
    static createPagination(page: number, limit: number, totalData: number): pagination {
        return {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    }
}