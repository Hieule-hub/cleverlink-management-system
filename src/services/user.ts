import {
    CreateUserReq,
    DeleteUsersReq,
    EditUserReq,
    GetUserIdReq,
    GetUserIdRes,
    GetUserListReq,
    GetUserListRes,
    UserInfo,
    UserLoginReq,
    UserLoginRes
} from "@interfaces/user";
import apiClient from "@libs/apiClient";
import { DataResponse } from "common";

const userLogin = async (data: UserLoginReq) => {
    return apiClient.post<UserLoginReq, UserLoginRes>("/user/login", data);
};

const userLogout = async () => {
    return apiClient.post<unknown, unknown>("/user/logout");
};

const getUserInfo = async () => {
    return apiClient.get<unknown, DataResponse<UserInfo>>("/user/info");
};

const getUserList = async (params: GetUserListReq) => {
    return apiClient.get<unknown, GetUserListRes>("/user/findAll", {
        params
    });
};

const getUserId = async (params: GetUserIdReq) => {
    return apiClient.get<GetUserIdReq, GetUserIdRes>(`/user/getUserId`, {
        params
    });
};

const createUser = async (params: CreateUserReq) => {
    const { token, ...otherParams } = params;

    return apiClient.post<CreateUserReq, DataResponse<unknown>>("/user/create", otherParams, {
        headers: {
            encrypted: token
        }
    });
};

const editUser = async (params: EditUserReq) => {
    const { userId, ...otherParams } = params;

    return apiClient.put<CreateUserReq, DataResponse<unknown>>(`/user/edit/` + userId, otherParams);
};

const deleteUsers = async (params: DeleteUsersReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/user/deletes`, {
        data: params
    });
};

const userService = { userLogin, getUserInfo, getUserList, userLogout, deleteUsers, getUserId, createUser, editUser };

export default userService;
