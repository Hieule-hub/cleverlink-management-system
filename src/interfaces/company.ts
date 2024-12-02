import { DataResponse, Pagination } from "common";

export type Company = {
    _id: string;
    companyId: string;
    name: string;
    status: string;
    totalDevices: number;
};

//Request type company
export type GetCompanyIdReq = {
    companyId: string;
};

export type GetCompanyListRes = DataResponse<{
    paging: Pagination;
    companies: Company[];
}>;
