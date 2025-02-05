import { DataResponse, Pagination } from "common";

export interface Event {
    _id: string;
    serial: string;
    receiver: string[];
    images: string[];
    time: string;
    aiCode: string;
    channel: number;
    solve: string;
    notifyCode: string;
    activate: {
        boxId: string;
        ip?: string;
        port?: number;
    };
    device: {
        place: string;
    };
    user: {
        userId: string;
        name: string;
    };
}

//Request type Event

export type GetEventListRes = DataResponse<{
    paging: Pagination;
    events: Event[];
}>;

export type DeleteEventsReq = {
    ids: string[];
};

export type EditEventReq = {
    _id: string;
    solve: string;
};
