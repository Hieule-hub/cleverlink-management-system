import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import { Button } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { ControllerSelect } from "@components/Controller/ControllerSelect";
import { Label } from "@components/Label";
import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import { Paper } from "@components/Paper";
import { yupResolver } from "@hookform/resolvers/yup";
import { Company } from "@interfaces/company";
import { Save } from "@mui/icons-material";
import { Box, Grid2 as Grid, Typography, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface CompanyInfoProps {
    companyId?: string;
}

const labelSize = 4;
const inputSize = 8;

type FormCompanyValues = Partial<{
    companyId: string;
    name: string;
    organizationId: string;
    password: string;
    roleId: string;
    userId: string;
    address: string;
    website: string;
    phone: string;
    token: string;
    startDate: string;
}>;

const initFormValues: FormCompanyValues = {
    companyId: "",
    name: "",
    organizationId: "",
    roleId: "",
    userId: "",
    password: "",
    address: "",
    website: "",
    phone: "",
    token: "",
    startDate: dayjs().format("YYYY-MM-DD")
};

export const CompanyInfo = ({ companyId }: CompanyInfoProps) => {
    const t = useTranslations("CompanyPage");
    const tCommon = useTranslations("Common");

    const { organizations } = useAppStore((state) => state);
    const [item, setItem] = useState<Company>(null as Company);

    const [isLoading, setIsLoading] = useState(false);

    const resolver = yup.object({
        userId: yup.string().required("User ID is required"),
        organizationId: yup.string().required("Organization is required"),
        name: yup.string().required("Company name is required")
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<FormCompanyValues>({
        resolver: yupResolver(resolver),
        defaultValues: initFormValues
    });

    const fetchDataList = useCallback(async () => {
        setIsLoading(true);
        try {
            const listRes = await companyService.getCompanyList({
                page: 1,
                filters: "",
                limit: 1
            });

            if (!listRes.err && listRes.data.companies.length > 0) {
                setItem(listRes.data.companies[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fetch data
        fetchDataList();
    }, [fetchDataList]);

    useEffect(() => {
        //fill form with user data
        if (item) {
            console.log("🚀 ~ useEffect ~ item:", item);
            const newValue: FormCompanyValues = {
                ...initFormValues,
                userId: item.user?.userId,
                companyId: item.companyId,
                address: item.address || initFormValues.address,
                website: item.website || initFormValues.website,
                phone: item.phone || initFormValues.phone,
                name: item.name,
                organizationId: item.organizationId,
                startDate: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
            };
            reset(newValue);
        } else {
            reset(initFormValues);
        }
    }, [item, reset]);

    const handleSave = () => {
        if (errors) {
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    const element = errors[key];

                    if (element?.message) {
                        toast.error({ title: element.message });
                    }
                }
            }
        }

        handleSubmit(async (data: FormCompanyValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await companyService.editCompany({
                        _id: item._id,
                        name: data.name,
                        phone: data.phone,
                        website: data.website,
                        address: data.address,
                        organizationId: data.organizationId
                    });
                    if (!response.err) {
                        toast.success({ title: t("Edit record success") });
                    } else {
                        // toast.error({ title: t("Edit record failed") });
                    }
                }
            } catch (error) {
                console.log("🚀 ~ handleSubmit ~ error:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    return (
        <React.Fragment>
            <Paper title={t("title")}>
                <Grid
                    padding={2}
                    width='100%'
                    gap={2}
                    container
                    spacing={2}
                    columns={{ xs: 12, md: 24 }}
                    alignItems='center'
                >
                    {/* Company name Field */}
                    <Grid size={labelSize}>
                        <Label align='right' required label='Company name' htmlFor='name' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='name' placeholder='Name' disabled />
                    </Grid>

                    {/* Address Field */}
                    <Grid size={labelSize}>
                        <Label align='right' label='Address' htmlFor='address' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='address' placeholder='Address' />
                    </Grid>

                    {/* Organization ID Field */}
                    <Grid size={labelSize}>
                        <Label align='right' required label='Organization' htmlFor='organizationId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled
                            control={control}
                            keyName='organizationId'
                            placeholder='Organization'
                            selectProps={{
                                options: organizations.map((o) => ({
                                    value: o._id,
                                    label: o.name
                                }))
                            }}
                        />
                    </Grid>

                    {/* Phone number Field */}
                    <Grid size={labelSize}>
                        <Label align='right' label='Phone number' htmlFor='phone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='phone' placeholder='Phone Number' />
                    </Grid>

                    {/* Company ID Field */}
                    <Grid size={labelSize}>
                        <Label align='right' label='Company ID' htmlFor='companyId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='companyId' placeholder='Company ID' disabled />
                    </Grid>

                    {/* Website Field */}
                    <Grid size={labelSize}>
                        <Label align='right' label='Website' htmlFor='website' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='website' placeholder='Website' />
                    </Grid>

                    {/* User ID Field */}
                    <Grid size={labelSize}>
                        <Label align='right' required label='User ID' htmlFor='userId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='userId' placeholder='User ID' disabled />
                    </Grid>

                    {/* Register Date Field */}
                    <Grid size={labelSize}>
                        <Label align='right' label='Register Date' htmlFor='startDate' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='startDate' placeholder='Register Date' disabled />
                    </Grid>
                </Grid>
            </Paper>

            <Box display='flex' justifyContent='end' marginTop={2}>
                <Button loading={isLoading} startIcon={Save} onClick={handleSave} color='primary'>
                    {tCommon("Save")}
                </Button>
            </Box>
        </React.Fragment>
        // <MainLayout title={t("title")}>
        //     <Breadcrumbs />

        // </MainLayout>
    );
};
