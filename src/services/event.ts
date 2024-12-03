import { GetEventListRes } from "@interfaces/event";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getEventList = async (params: Partial<GetParams>) => {
    return apiClient.get<Partial<GetParams>, GetEventListRes>("/event/findAll", {
        params
    });
};

const eventService = { getDeviceList: getEventList };

export default eventService;
