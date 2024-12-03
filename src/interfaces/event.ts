import { DataResponse, Pagination } from "common";

export interface Event {
    _id: string;
    serial: string;
    receiver: string[];
    images: string[];
    time: string;
    activate: {
        boxId: string;
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
