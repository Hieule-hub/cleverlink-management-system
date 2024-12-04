import {
    Company,
    CreateCompanyReq,
    DeleteCompaniesReq,
    EditCompanyReq,
    GetCompanyIdAndUserIdReq,
    GetCompanyIdAndUserIdRes,
    GetCompanyIdReq,
    GetCompanyListRes
} from "@interfaces/company";
import apiClient from "@libs/apiClient";
import { DataResponse, GetParams } from "common";

const getCompanyId = async (params: GetCompanyIdReq) => {
    return apiClient.get<unknown, DataResponse<Company>>("/company/getCompanyId", {
        params: params
    });
};

const getCompanyIdAndUserId = async (params: GetCompanyIdAndUserIdReq) => {
    return apiClient.get<unknown, GetCompanyIdAndUserIdRes>("/company/getCompanyIdAndUserId", {
        params: params
    });
};

const getCompanyList = async (params: Partial<GetParams>) => {
    return apiClient.get<unknown, GetCompanyListRes>("/company/findAll", {
        params
    });
};

const createCompany = async (params: CreateCompanyReq) => {
    const { token, ...otherParams } = params;

    return apiClient.post<CreateCompanyReq, DataResponse<unknown>>("/company/create", otherParams, {
        headers: {
            encrypted: token
        }
    });
};

const editCompany = async (params: EditCompanyReq) => {
    const { _id, ...otherParams } = params;

    return apiClient.put<EditCompanyReq, DataResponse<unknown>>(`/company/edit/` + params._id, otherParams);
};

const deleteCompanies = async (params: DeleteCompaniesReq) => {
    return apiClient.delete<unknown, DataResponse<unknown>>(`/company/deletes`, {
        data: params
    });
};

const companyService = {
    getCompanyId,
    getCompanyIdAndUserId,
    getCompanyList,
    deleteCompanies,
    createCompany,
    editCompany
};

export default companyService;
