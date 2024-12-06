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
    path: string;
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

export interface Channel {
    modelId: string;
    modelName: string;
    ip: string;
    place: string;
    factory: string;
    _id: string;
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
    path: string;
    token: string;
};

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
    path: string;
};

export type DeleteCamerasReq = {
    ids: string[];
};
