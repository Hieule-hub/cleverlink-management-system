import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

import {
    CreateDeviceReq,
    DeleteDevicesReq,
    EditDeviceReq,
    GetActiveListReq,
    GetActiveListRes,
    GetCameraListRes,
    GetDeviceListRes
} from "@/interfaces/device";

const getDeviceList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetDeviceListRes>("/device/findAll", {
        params
    });
};

const createDevice = async (params: CreateDeviceReq) => {
    return apiClient.post<CreateDeviceReq, DataResponse<unknown>>("/device/create", params);
};

const editDevice = async (params: EditDeviceReq) => {
    const { _id, ...otherParams } = params;

    return apiClient.put<CreateDeviceReq, DataResponse<unknown>>(`/device/edit/` + _id, otherParams);
};

const deleteDevices = async (params: DeleteDevicesReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/device/deletes`, {
        data: params
    });
};

const getCameraList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetCameraListRes>("/camera/findAll", {
        params
    });
};

const getActiveList = async (params: GetActiveListReq) => {
    return apiClient.get<GetActiveListReq, GetActiveListRes>("/activate/findAll", {
        params
    });
};

const deviceService = { getDeviceList, getCameraList, getActiveList, createDevice, editDevice, deleteDevices };

export default deviceService;
