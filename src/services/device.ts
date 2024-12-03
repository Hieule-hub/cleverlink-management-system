import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

import { GetCameraListRes, GetDeviceListRes } from "@/interfaces/device";

const getDeviceList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetDeviceListRes>("/device/findAll", {
        params
    });
};

export const getCameraList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetCameraListRes>("/camera/findAll", {
        params
    });
};

const deviceService = { getDeviceList, getCameraList };

export default deviceService;
