import { DataResponse, Pagination } from "common";

import { Scene } from "./scene";

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
    filters: string;
}>;

export type GetUserListRes = DataResponse<{
    paging: Pagination;
    users: UserInfo[];
}>;

export type DeleteUsersReq = {
    ids: string[];
};

export interface UserInfo {
    _id: string;
    userId: string;
    roleId: Role;
    name: string;
    status: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    scene?: Scene;
}

export interface Role {
    _id: string;
    name: string;
    code: RoleCode;
    __v: number;
}

export type RoleCode = "CIP" | "TU" | "BU" | "GU"; // CIP: Customer Information Provider, TU: Technical User, BU: Business User, GU: Guest User
