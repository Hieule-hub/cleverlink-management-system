import { UserLoginReq, UserLoginRes } from "User";
import { DataResponse } from "common";

import apiClient from "@/libs/apiClient";

const userLogin = async (data: UserLoginReq) => {
    return apiClient.post<UserLoginReq, DataResponse<UserLoginRes>>("/user/login", data);
};

const userService = { userLogin };

export default userService;
