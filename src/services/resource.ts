import apiClient from "@libs/apiClient";
import { Area, DataResponse, Organization, Role } from "common";

const getResources = async () => {
    const roles = apiClient.get<unknown, DataResponse<Role[]>>("/resource/roles").then((res) => res.data);
    const organizations = apiClient
        .get<unknown, DataResponse<Organization[]>>("/resource/organizations")
        .then((res) => res.data);
    const areas = apiClient.get<unknown, DataResponse<Area[]>>("/resource/areas").then((res) => res.data);

    return Promise.all([roles, organizations, areas]);
};

const resourceService = { getResources };

export default resourceService;
