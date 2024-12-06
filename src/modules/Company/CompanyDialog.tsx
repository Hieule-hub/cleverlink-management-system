import { useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { ControllerSelect } from "@components/Controller/ControllerSelect";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Company } from "@interfaces/company";
import { Grid2 as Grid, Typography, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const useCompanyDialog = dialogStore<Company>();

interface CompanyDialogProps {
    onClose?: (status?: string) => void;
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

export const CompanyDialog = ({ onClose = () => "" }: CompanyDialogProps) => {
    const t = useTranslations();
    const { organizations } = useAppStore((state) => state);
    const { item, open, closeDialog, setItem } = useCompanyDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);

    const resolver = yup.object({
        userId: yup.string().required("User ID is required"),
        organizationId: yup.string().required("Organization is required"),
        name: yup.string().required("Company name is required")
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
        setValue,
        reset
    } = useForm<FormCompanyValues>({
        resolver: yupResolver(resolver),
        defaultValues: {
            userId: ""
        }
    });

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

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
    };

    const handleReset = () => {
        setItem(null);
    };

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
                        toast.success({ title: t("CompanyPage.Edit record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("CompanyPage.Edit record failed") });
                    }
                } else {
                    const response = await companyService.createCompany({
                        userId: data.userId,
                        name: data.name,
                        companyId: data.companyId,
                        organizationId: data.organizationId,
                        roleId: data.roleId,
                        phone: data.phone,
                        address: data.address,
                        website: data.website,
                        password: data.password,
                        token: data.token
                    });
                    if (!response.err) {
                        toast.success({ title: t("CompanyPage.Create record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("CompanyPage.Create record failed") });
                    }
                }
            } catch (error) {
                console.log("🚀 ~ handleSubmit ~ error:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    const fetchId = async () => {
        const organizationId = getValues("organizationId");

        if (!organizationId) {
            toast.error({ title: "Please select organization" });
            return;
        }

        //get role code
        setIsFetchingId(true);

        try {
            const response = await companyService.getCompanyIdAndUserId({
                prefixCompany: organizations.find((o) => o._id === organizationId)?.code || "C",
                prefixUser: "TU"
            });

            if (!response.err) {
                const { userId, companyId, token, roleId, password } = response.data;
                setValue("userId", userId);
                setValue("password", password);
                setValue("companyId", companyId);
                setValue("token", token);
                setValue("roleId", roleId._id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingId(false);
        }
    };

    return (
        <Dialog
            aria-describedby='company-dialog-description'
            aria-labelledby='company-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            title={item ? t("CompanyPage.Edit record") : t("CompanyPage.Add new record")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Company name Field */}
                <Grid size={labelSize}>
                    <Label required label='Company name' htmlFor='name' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='name' placeholder='Name' />
                </Grid>

                {/* Address Field */}
                <Grid size={labelSize}>
                    <Label label='Address' htmlFor='address' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='address' placeholder='Address' />
                </Grid>

                {/* Organization ID Field */}
                <Grid size={labelSize}>
                    <Label required label='Organization' htmlFor='organizationId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerSelect
                        disabled={editMode}
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
                    <Label label='Phone number' htmlFor='phone' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='phone' placeholder='Phone Number' />
                </Grid>

                {/* Company ID Field */}
                <Grid size={labelSize}>
                    <Label label='Company ID' htmlFor='companyId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='companyId' placeholder='Company ID' disabled />
                </Grid>

                {/* Website Field */}
                <Grid size={labelSize}>
                    <Label label='Website' htmlFor='website' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='website' placeholder='Website' />
                </Grid>

                {/* User ID Field */}
                <Grid size={labelSize}>
                    <Label required label='User ID' htmlFor='userId' />
                </Grid>
                <Grid size={inputSize - 3}>
                    <ControllerInput control={control} keyName='userId' placeholder='User ID' disabled />
                </Grid>
                <Grid size={3}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='48px'
                        disabled={editMode}
                        onClick={fetchId}
                        loading={isFetchingId}
                    >
                        {t("Common.Init")}
                    </Button>
                </Grid>

                {/* Register Date Field */}
                <Grid size={labelSize}>
                    <Label label='Register Date' htmlFor='startDate' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='startDate' placeholder='Register Date' disabled />
                </Grid>
            </Grid>
        </Dialog>
    );
};
