import { DataResponse, Pagination } from "common";

export interface UserLoginReq {
    userId: string;
    password: string;
}

export type UserLoginRes = DataResponse<{
    _id: string;
    userId: string;
    roleId: Role;
    name: string;
    status: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    refresh: string;
    access: string;
}>;

export type GetUserListReq = Partial<{
    page: number;
    limit: number;
    name: string;
    sortField: string;
    sortOrder: string;
}>;

export type GetUserListRes = DataResponse<{
    paging: Pagination;
    users: UserInfo[];
}>;

export interface UserInfo {
    _id: string;
    userId: string;
    roleId: Role;
    name: string;
    status: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
    _id: string;
    name: string;
    code: RoleCode;
    __v: number;
}

export type RoleCode = "CIP" | "TU" | "BU" | "GU"; // CIP: Customer Information Provider, TU: Technical User, BU: Business User, GU: Guest User
