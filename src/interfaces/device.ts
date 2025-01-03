import { DataResponse, Pagination } from "common";

import { User } from "./user";

export interface Device {
    _id: string;
    place: string;
    createdAt: string;
    activate: {
        boxId: string;
        mac: string;
        serial: string;
        ip: string;
        channels: Channel[];
        _id: string;
        port?: number;
    };
    company: {
        _id: string;
        companyId: string;
        name: string;
    };
    scene: {
        _id: string;
        sceneId: string;
        name: string;
        createdAt: string;
    };
    user: User;
}

export interface Camera {
    _id: string;
    cameraId: string;
    name: string;
    factory: string;
    poe: number;
    category: Category;
    resolution: string;
    input: string;
    description: string;
    protocol: Protocol;
    files: CamFile[];
}

export interface Active {
    _id: string;
    serial: string;
    mac: string;
    __v: number;
    channels: Channel[];
    createdAt: string;
    ip: string;
    status: string;
    updatedAt: string;
    boxId: string;
}

export interface CamFile {
    key: string;
    name: string;
    uploadedAt: string | null;
    _id: string;
    url: string;
}

export interface Channel {
    modelId?: string;
    modelName?: string;
    ip?: string;
    place?: string;
    factory?: string;
    _id?: string;
}

export interface Category {
    _id: string;
    name: string;
    code: string;
    key: string;
    __v: number;
}

export interface Protocol {
    _id: string;
    name: string;
    code: string;
    __v: number;
}

//Request type Device

export type GetDeviceListRes = DataResponse<{
    paging: Pagination;
    devices: Device[];
}>;

export type CreateDeviceReq = {
    companyId: string;
    sceneId: string;
    place: string;
    userId: string;
    activateId: string;
};

export type EditDeviceReq = {
    _id: string;
    companyId: string;
    sceneId: string;
    userId: string;
    place: string;
    activateId: string;
};

export type DeleteDevicesReq = {
    ids: string[];
};

export type GetActiveListReq = {
    page: number;
    limit: number;
    filters?: string;
    status?: string;
};

export type GetActiveListRes = DataResponse<{
    paging: Pagination;
    activates: Active[];
}>;

export type UploadedFileCameraReq = {
    id: string;
    uploadedKeys: string[];
};

export type DeleteFileCameraReq = {
    id: string;
    key: string;
};

// Request type Camera

export type GetCameraListRes = DataResponse<{
    paging: Pagination;
    cameras: Camera[];
}>;

export type GetCameraIdReq = {
    prefix: string;
};

export type GetCameraIdRes = DataResponse<{
    cameraId: string;
    token: string;
}>;

export type CreateCameraReq = {
    cameraId: string;
    categoryId: string;
    name: string;
    protocolId: string;
    factory: string;
    poe: number;
    resolution: string;
    input: string;
    description: string;
    token: string;
    newFiles: File[];
};

export type CreateCameraRes = DataResponse<{
    camera: Camera;
    presignedUrls: {
        signedUrl: string;
        key: string;
    }[];
}>;

export type EditCameraReq = {
    _id: string;
    categoryId: string;
    name: string;
    protocolId: string;
    factory: string;
    poe: number;
    resolution: string;
    input: string;
    description: string;
    newFiles: File[];
    deleteFiles: string[];
};

export type EditCameraRes = DataResponse<{
    camera: Camera;
    presignedUrls: {
        signedUrl: string;
        key: string;
    }[];
}>;

export type DeleteCamerasReq = {
    ids: string[];
};

// check type

export function isCamFile(item: any): item is CamFile {
    return (
        typeof item === "object" &&
        item !== null &&
        typeof item.key === "string" &&
        (typeof item.uploadedAt === "string" || item.uploadedAt === null) &&
        typeof item._id === "string" &&
        typeof item.url === "string"
    );
}
