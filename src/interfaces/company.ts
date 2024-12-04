import { DataResponse, Pagination, Role } from "common";

import { User } from "./user";

export type Company = {
    _id: string;
    companyId: string;
    name: string;
    status: string;
    totalDevices: number;
    address?: string;
    website?: string;
    phone?: string;
    organizationId: string;
    user: User;
    createdAt: string;
};

//Request type company
export type GetCompanyIdReq = {
    companyId: string;
};

export type GetCompanyIdAndUserIdReq = {
    prefixCompany: string;
    prefixUser: string;
};

export type GetCompanyIdAndUserIdRes = DataResponse<{
    companyId: string;
    userId: string;
    password: string;
    token: string;
    roleId: Role;
}>;

export type GetCompanyListRes = DataResponse<{
    paging: Pagination;
    companies: Company[];
}>;

export type CreateCompanyReq = {
    companyId: string;
    name: string;
    organizationId: string;
    userId: string;
    password: string;
    roleId: string;
    address: string;
    phone: string;
    website: string;
    token: string;
};

export type EditCompanyReq = {
    _id: string;
    name: string;
    address: string;
    phone: string;
    website: string;
    organizationId: string;
};

export type DeleteCompaniesReq = {
    ids: string[];
};
