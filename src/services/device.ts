import {
    CreateCameraReq,
    CreateDeviceReq,
    DeleteDevicesReq,
    EditCameraReq,
    EditDeviceReq,
    GetActiveListReq,
    GetActiveListRes,
    GetCameraIdReq,
    GetCameraIdRes,
    GetCameraListRes,
    GetDeviceListRes
} from "@interfaces/device";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

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

const getActiveList = async (params: GetActiveListReq) => {
    return apiClient.get<GetActiveListReq, GetActiveListRes>("/activate/findAll", {
        params
    });
};

// Camera
const getCameraList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetCameraListRes>("/camera/findAll", {
        params
    });
};

const getCameraId = async (params: GetCameraIdReq) => {
    return apiClient.get<GetCameraIdReq, GetCameraIdRes>(`/camera/getCameraId`, {
        params: params
    });
};

const createCamera = async (params: CreateCameraReq) => {
    const { token, ...otherParams } = params;

    return apiClient.post<CreateDeviceReq, DataResponse<unknown>>("/camera/create", otherParams, {
        headers: {
            encrypted: token
        }
    });
};

const editCamera = async (params: EditCameraReq) => {
    const { _id, ...otherParams } = params;

    return apiClient.put<CreateDeviceReq, DataResponse<unknown>>(`/camera/edit/` + _id, otherParams);
};

const deleteCameras = async (params: DeleteDevicesReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/camera/deletes`, {
        data: params
    });
};

const deviceService = {
    getDeviceList,
    getCameraList,
    getActiveList,
    createDevice,
    editDevice,
    deleteDevices,
    getCameraId,
    createCamera,
    editCamera,
    deleteCameras
};

export default deviceService;
