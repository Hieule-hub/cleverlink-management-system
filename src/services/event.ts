import { DeleteEventsReq, EditEventReq, GetEventListRes } from "@interfaces/event";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getEventList = async (params: Partial<GetParams>) => {
    return apiClient.get<Partial<GetParams>, GetEventListRes>("/event/findAll", {
        params
    });
};

const deleteEvents = async (params: DeleteEventsReq) => {
    return apiClient.delete<DeleteEventsReq, DataResponse<unknown>>("/event/delete", {
        data: params
    });
};

const editEvent = async (params: EditEventReq) => {
    const { _id, ...otherParams } = params;

    return apiClient.put<EditEventReq, DataResponse<unknown>>("/event/edit/" + _id, otherParams);
};

const eventService = { getEventList, deleteEvents, editEvent };

export default eventService;
