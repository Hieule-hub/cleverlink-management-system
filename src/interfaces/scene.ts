import { DataResponse, Pagination, Role } from "common";

import { Company } from "./company";
import { User } from "./user";

export interface Scene {
    _id: string;
    sceneId: string;
    name: string;
    address: string;
    company: Company;
    user: User;
    phone: string;
    website: string;
    areaId: string;
    pName: string;
    pDepartment: string;
    pPhone: string;
    pEmail: string;
    createdAt: string;
}

//Request type Scene
export type GetSceneIdReq = {
    sceneId: string;
};

export type GetSceneListRes = DataResponse<{
    paging: Pagination;
    scenes: Scene[];
}>;

export type GetSceneIdAndUserIdReq = {
    prefixScene: string;
    prefixUser: string;
};

export type GetSceneIdAndUserIdRes = DataResponse<{
    sceneId: string;
    userId: string;
    password: string;
    token: string;
    roleId: Role;
}>;

export type CreateSceneReq = {
    sceneId: string;
    companyId: string;
    name: string;
    areaId: string;
    userId: string;
    password: string;
    roleId: string;
    address: string;
    phone: string;
    website: string;
    pName: string;
    pDepartment: string;
    pPhone: string;
    pEmail: string;
    token: string;
};

export type EditSceneReq = {
    _id: string;
    name: string;
    areaId: string;
    address: string;
    phone: string;
    website: string;
};

export type DeleteScenesReq = {
    ids: string[];
};
