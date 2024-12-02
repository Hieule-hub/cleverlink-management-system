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

    interface Role {
        _id: string;
        name: string;
        code: RoleCode;
        __v: number;
    }

    interface GetParams {
        page: number;
        limit: number;
        name: string;
        sortField: string;
        sortOrder: string;
        filters: string;
    }

    type RoleCode = "CIP" | "TU" | "BU" | "GU"; // CIP: Customer Information Provider, TU: Technical User, BU: Business User, GU: Guest User

    type Organization = {
        _id: string;
        name: string;
        code: string;
        __v: number;
    };

    type Area = Organization;
}
