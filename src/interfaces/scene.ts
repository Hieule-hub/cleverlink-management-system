import { DataResponse, Pagination } from "common";

import { Company } from "./company";
import { User } from "./user";

export interface Scene {
    _id: string;
    sceneId: string;
    name: string;
    address: string;
    company: Company;
    user: User;
}

//Request type Scene
export type GetSceneIdReq = {
    sceneId: string;
};

export type GetSceneListRes = DataResponse<{
    paging: Pagination;
    scenes: Scene[];
}>;
