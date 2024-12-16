import {
    CreateCameraReq,
    CreateCameraRes,
    CreateDeviceReq,
    DeleteDevicesReq,
    DeleteFileCameraReq,
    EditCameraReq,
    EditCameraRes,
    EditDeviceReq,
    GetActiveListReq,
    GetActiveListRes,
    GetCameraIdReq,
    GetCameraIdRes,
    GetCameraListRes,
    GetDeviceListRes,
    UploadedFileCameraReq
} from "@interfaces/device";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

import { uploadFile } from "./file";

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
    const { token, newFiles, ...otherParams } = params;

    const fileList = [];
    if (newFiles.length > 0) {
        newFiles.forEach((file) => {
            fileList.push(file.name);
        });
    }

    const createRes = await apiClient.post<CreateCameraReq, CreateCameraRes>(
        "/camera/create",
        { ...otherParams, fileList: fileList },
        {
            headers: {
                encrypted: token
            }
        }
    );

    if (fileList.length === 0 && createRes.err) {
        return createRes;
    }

    const { presignedUrls, camera } = createRes.data;

    const uploadPromiseAll = presignedUrls.map((item, index) => {
        return uploadFile(item.signedUrl, newFiles[index]).then(() => {
            return uploadedFileCamera({
                id: camera._id,
                uploadedKeys: [item.key]
            });
        });
    });

    await Promise.all(uploadPromiseAll);

    return createRes;
};

const editCamera = async (params: EditCameraReq) => {
    const { _id, newFiles, deleteFiles, ...otherParams } = params;

    const fileList = [];
    if (newFiles.length > 0) {
        newFiles.forEach((file) => {
            fileList.push(file.name);
        });
    }

    const editRes = await apiClient.put<CreateDeviceReq, EditCameraRes>(`/camera/edit/` + _id, otherParams);

    if (fileList.length === 0 && editRes.err) {
        return editRes;
    }

    const { presignedUrls } = editRes.data;

    const uploadPromiseAll = presignedUrls.map((item, index) => {
        return uploadFile(item.signedUrl, newFiles[index]).then(() => {
            return uploadedFileCamera({
                id: _id,
                uploadedKeys: [item.key]
            });
        });
    });

    await Promise.all(uploadPromiseAll);

    if (deleteFiles.length > 0) {
        const deletePromiseAll = deleteFiles.map((key) => {
            return deleteFileCamera({
                id: _id,
                key: key
            });
        });

        await Promise.all(deletePromiseAll);
    }

    return editRes;
};

const deleteCameras = async (params: DeleteDevicesReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/camera/deletes`, {
        data: params
    });
};

const uploadedFileCamera = async ({ id, uploadedKeys }: UploadedFileCameraReq) => {
    return apiClient.put<UploadedFileCameraReq, DataResponse<unknown>>(`/camera/uploaded/${id}`, {
        uploadedKeys
    });
};

const deleteFileCamera = async ({ id, key }: DeleteFileCameraReq) => {
    return apiClient.delete<DeleteFileCameraReq, DataResponse<unknown>>(`/camera/fileDelete/${id}`, {
        data: {
            key: key
        }
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
    deleteCameras,
    uploadedFileCamera
};

export default deviceService;
