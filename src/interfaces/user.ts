import { DataResponse, GetParams, Organization, Pagination, RoleCode } from "common";

import { Company } from "./company";
import { Scene } from "./scene";

export type User = {
    _id: string;
    userId: string;
    name: string;
    roleId: Role;
    company: Company;
    scene: Scene;
    createdAt: string;
};

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

export type GetUserListReq = Partial<GetParams>;

export type GetUserListRes = DataResponse<{
    paging: Pagination;
    users: User[];
}>;

export type DeleteUsersReq = {
    ids: string[];
};

export type CreateUserReq = {
    userId: string;
    password: string;
    name: string;
    roleId: string;
    companyId: string;
    sceneId: string;
    task: string;
    phone: string;
    email: string;
    kakao: string;
    telegram: string;
    token: string;
};

export type GetUserIdReq = {
    prefix: RoleCode;
};

export type GetUserIdRes = DataResponse<{
    userId: string;
    password: string;
    token: string;
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
    scene?: Scene;
}

export interface Role {
    _id: string;
    name: string;
    code: RoleCode;
    __v: number;
}
