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
    task: string;
    phone: string;
    email: string;
    kakao: string;
    telegram: string;
    createdAt: string;
};

export interface Role {
    _id: string;
    name: string;
    code: RoleCode;
    __v: number;
}

export interface UserInfo {
    _id: string;
    userId: string;
    companyId?: Company;
    roleId: Role;
    name: string;
    status: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    sceneId?: Scene;
}

// Interface for request

//Login request
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
    passwordAt?: string;
}>;

export type UserRefreshTokenReq = {
    refresh: string;
};

export type UserRefreshTokenRes = DataResponse<{
    refresh: string;
    access: string;
    _id: string;
}>;

export type UserUpdatePasswordReq = {
    oldPassword: string;
    newPassword: string;
};

export type UserUpdatePasswordRes = DataResponse<unknown>;

export type UserResetPasswordReq = {
    userId: string;
};

//User list request
export type GetUserListReq = Partial<
    GetParams & {
        companyId?: string;
        sceneId?: string;
    }
>;

export type GetUserListRes = DataResponse<{
    paging: Pagination;
    users: User[];
}>;

//User list request
export type DeleteUsersReq = {
    ids: string[];
};

//Create user request
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

//Edit user request
export type EditUserReq = {
    name: string;
    task: string;
    phone: string;
    email: string;
    kakao: string;
    telegram: string;
    userId: string;
    sceneId: string;
};

//Get user id request
export type GetUserIdReq = {
    prefix: RoleCode;
};

export type GetUserIdRes = DataResponse<{
    userId: string;
    password: string;
    token: string;
}>;
