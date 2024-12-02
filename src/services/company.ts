import { Company, GetCompanyIdReq, GetCompanyListRes } from "@interfaces/company";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getCompanyId = async (params: GetCompanyIdReq) => {
    return apiClient.get<unknown, DataResponse<Company>>("/company/getCompanyId", {
        params: params
    });
};

const getCompanyList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetCompanyListRes>("/company/findAll", {
        params
    });
};

const companyService = { getCompanyId, getCompanyList };

export default companyService;
