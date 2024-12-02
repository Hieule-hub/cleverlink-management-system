import { GetSceneIdReq, GetSceneListRes, Scene } from "@interfaces/scene";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getSceneId = async (params: GetSceneIdReq) => {
    return apiClient.get<unknown, DataResponse<Scene>>("/scene/getSceneId", {
        params: params
    });
};

const getSceneList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetSceneListRes>("/scene/findAll", {
        params
    });
};

const sceneService = { getSceneId, getSceneList };

export default sceneService;
