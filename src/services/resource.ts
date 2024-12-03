import { Device } from "@interfaces/device";
import apiClient from "@libs/apiClient";
import { Area, DataResponse, GetParams, Organization, Pagination, Role } from "common";

const getResources = async () => {
    const roles = apiClient.get<unknown, DataResponse<Role[]>>("/resource/roles").then((res) => res.data);
    const organizations = apiClient
        .get<unknown, DataResponse<Organization[]>>("/resource/organizations")
        .then((res) => res.data);
    const areas = apiClient.get<unknown, DataResponse<Area[]>>("/resource/areas").then((res) => res.data);

    return Promise.all([roles, organizations, areas]);
};

type GetDashboardDataRes = DataResponse<{
    devices: Device[];
    paging: Pagination;
}>;

const getDashboardData = async (
    params: Partial<
        GetParams & {
            scene: string;
            company: string;
        }
    >
) => {
    return apiClient.get<unknown, GetDashboardDataRes>("/dashboard/findAll", {
        params
    });
};

const resourceService = { getResources, getDashboardData };

export default resourceService;
