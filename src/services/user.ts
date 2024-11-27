import apiClient from "@libs/apiClient";
import { UserInfo, UserLoginReq, UserLoginRes } from "User";
import { DataResponse } from "common";

const userLogin = async (data: UserLoginReq) => {
    return apiClient.post<UserLoginReq, DataResponse<UserLoginRes>>("/user/login", data);
};

const getUserInfo = async () => {
    return apiClient.get<unknown, DataResponse<UserInfo>>("/user/info");
};

const userService = { userLogin, getUserInfo };

export default userService;
