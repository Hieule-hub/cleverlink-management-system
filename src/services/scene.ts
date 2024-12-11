import {
    CreateSceneReq,
    DeleteScenesReq,
    EditSceneReq,
    GetSceneIdAndUserIdReq,
    GetSceneIdAndUserIdRes,
    GetSceneIdReq,
    GetSceneListRes,
    Scene
} from "@interfaces/scene";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getSceneId = async (params: GetSceneIdReq) => {
    return apiClient.get<unknown, DataResponse<Scene>>("/scene/getSceneId", {
        params: params
    });
};

const getSceneIdAndUserId = async (params: GetSceneIdAndUserIdReq) => {
    return apiClient.get<unknown, GetSceneIdAndUserIdRes>("/scene/getSceneIdAndUserId", {
        params: params
    });
};

const getSceneList = async (params: Partial<GetParams & { companyId: string }>) => {
    if (params.companyId) {
        return apiClient.get<unknown, GetSceneListRes>("/scene/findByCompanyId", {
            params
        });
    }

    return apiClient.get<unknown, GetSceneListRes>("/scene/findAll", {
        params
    });
};

const createScene = async (params: CreateSceneReq) => {
    const { token, ...otherParams } = params;

    return apiClient.post<CreateSceneReq, DataResponse<unknown>>("/scene/create", otherParams, {
        headers: {
            encrypted: token
        }
    });
};

const editScene = async (params: EditSceneReq) => {
    const { _id, ...otherParams } = params;

    return apiClient.put<EditSceneReq, DataResponse<unknown>>(`/scene/edit/` + _id, otherParams);
};

const deleteScenes = async (params: DeleteScenesReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/scene/deletes`, {
        data: params
    });
};

const sceneService = {
    getSceneId,
    getSceneIdAndUserId,
    getSceneList,
    deleteScenes,
    createScene,
    editScene
};

export default sceneService;
