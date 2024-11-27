declare module "common" {
    interface DataResponse<T = any> {
        err: number;
        data: T;
        msg: null | {
            code: string;
            message: string;
        };
    }

    interface Pagination {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    }
}
