import { DataResponse, Pagination } from "common";

export interface Device {
    _id: string;
    place: string;
    companyId: string;
    sceneId: string;
    userId: string;
    createdAt: string;
    activate: {
        boxId: string;
    };
    company: {
        name: string;
    };

    user: {
        name: string;
    };
}

export interface Camera {
    _id: string;
    cameraId: string;
    name: string;
    factory: string;
    poe: number;
    category: Category;
    protocol: Protocol;
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

export type GetCameraListRes = DataResponse<{
    paging: Pagination;
    cameras: Camera[];
}>;
