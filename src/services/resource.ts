import { Device } from "@interfaces/device";
import apiClient from "@libs/apiClient";
import { Area, Category, DataResponse, GetParams, Organization, Pagination, Protocol, Role } from "common";

const getResources = async () => {
    const roles = apiClient.get<unknown, DataResponse<Role[]>>("/resource/roles").then((res) => res.data);
    const organizations = apiClient
        .get<unknown, DataResponse<Organization[]>>("/resource/organizations", {
            params: {
                sortField: "code",
                sortOrder: "asc"
            }
        })
        .then((res) => res.data);
    const areas = apiClient
        .get<unknown, DataResponse<Area[]>>("/resource/areas", {
            params: {
                sortField: "code",
                sortOrder: "asc"
            }
        })
        .then((res) => res.data);
    const protocols = apiClient
        .get<unknown, DataResponse<Protocol[]>>("/resource/protocols", {
            params: {
                sortField: "code",
                sortOrder: "asc"
            }
        })
        .then((res) => res.data);
    const categories = apiClient
        .get<unknown, DataResponse<Category[]>>("/resource/categories", {
            params: {
                sortField: "code",
                sortOrder: "asc"
            }
        })
        .then((res) => res.data);

    return Promise.all([roles, organizations, areas, protocols, categories]);
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
