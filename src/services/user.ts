import { DeleteUsersReq, GetUserListReq, GetUserListRes, UserInfo, UserLoginReq, UserLoginRes } from "@interfaces/user";
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
        params: params
    });
};

const deleteUsers = async (params: DeleteUsersReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/user/deletes`, {
        data: params
    });
};

const userService = { userLogin, getUserInfo, getUserList, userLogout, deleteUsers };

export default userService;
