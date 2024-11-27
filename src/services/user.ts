import { GetUserListReq, GetUserListRes, UserInfo, UserLoginReq, UserLoginRes } from "@interfaces/user";
import apiClient from "@libs/apiClient";
import { DataResponse } from "common";

const userLogin = async (data: UserLoginReq) => {
    return apiClient.post<UserLoginReq, UserLoginRes>("/user/login", data);
};

const getUserInfo = async () => {
    return apiClient.get<unknown, DataResponse<UserInfo>>("/user/info");
};

const getUserList = async (params: GetUserListReq) => {
    return apiClient.get<unknown, GetUserListRes>("/user/findAll", {
        params: params
    });
};

const userService = { userLogin, getUserInfo, getUserList };

export default userService;
