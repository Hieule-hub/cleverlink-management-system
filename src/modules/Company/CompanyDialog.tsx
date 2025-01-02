import { useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput, ControllerSelect } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { useYupLocale } from "@configs/yupConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { Company } from "@interfaces/company";
import { Grid2 as Grid, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

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
    const t = useTranslations("CompanyPage");
    const tCommon = useTranslations("Common");

    const { yup, translateRequiredMessage } = useYupLocale({
        page: "CompanyPage"
    });

    const organizations = useAppStore((state) => state.organizations);
    const { item, open, closeDialog, readonly } = useCompanyDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);
    const dialogTitle = useMemo(() => {
        if (readonly) {
            return t("Detail record");
        }

        return editMode ? t("Edit record") : t("Add new record");
    }, [editMode, t, readonly]);

    const organizationOptions = useMemo(
        () =>
            organizations.map((o) => ({
                value: o._id,
                label: `${o.code} (${o.name})`
            })),
        [organizations]
    );

    const resolver = yup.object({
        userId: yup.string().required(translateRequiredMessage("User ID")),
        organizationId: yup.string().required(translateRequiredMessage("Organization")),
        name: yup.string().required(translateRequiredMessage("Name"))
    });

    const { handleSubmit, control, getValues, setValue, reset, clearErrors } = useForm<FormCompanyValues>({
        resolver: yupResolver(resolver),
        defaultValues: initFormValues
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

    const handleSave = () => {
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
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Edit record failed") });
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
                        toast.success({ title: t("Create record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Create record failed") });
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
            toast.error({ title: translateRequiredMessage("Organization") });
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
                clearErrors("userId");

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
            title={dialogTitle}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
            hiddenOk={readonly}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Name Field */}
                <Grid size={labelSize}>
                    <Label required label={t("Name")} htmlFor='name' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='name' placeholder={t("Name")} disabled={readonly} />
                </Grid>

                {/* Address Field */}
                <Grid size={labelSize}>
                    <Label label={t("Address")} htmlFor='address' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='address'
                        placeholder={t("Address")}
                        disabled={readonly}
                    />
                </Grid>

                {/* Organization ID Field */}
                <Grid size={labelSize}>
                    <Label required label={t("Organization")} htmlFor='organizationId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerSelect
                        disabled={readonly || editMode}
                        control={control}
                        keyName='organizationId'
                        placeholder={t("Organization")}
                        selectProps={{
                            options: organizationOptions
                        }}
                    />
                </Grid>

                {/* Phone number Field */}
                <Grid size={labelSize}>
                    <Label label={t("Phone number")} htmlFor='phone' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='phone'
                        placeholder={t("Phone number")}
                        disabled={readonly}
                    />
                </Grid>

                {/* Company ID Field */}
                <Grid size={labelSize}>
                    <Label label={t("Company ID")} htmlFor='companyId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='companyId' placeholder={t("Company ID")} disabled />
                </Grid>

                {/* Website Field */}
                <Grid size={labelSize}>
                    <Label label={t("Website")} htmlFor='website' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='website'
                        placeholder={t("Website")}
                        disabled={readonly}
                    />
                </Grid>

                {/* User ID Field */}
                <Grid size={labelSize}>
                    <Label required label={t("User ID")} htmlFor='userId' />
                </Grid>
                <Grid size={inputSize - 3}>
                    <ControllerInput control={control} keyName='userId' placeholder={t("User ID")} disabled />
                </Grid>
                <Grid size={3} alignSelf={"start"}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='51px'
                        disabled={readonly || editMode}
                        onClick={fetchId}
                        loading={isFetchingId}
                    >
                        {tCommon("Create ID")}
                    </Button>
                </Grid>

                {/* Register date Field */}
                <Grid size={labelSize}>
                    <Label label={t("Register date")} htmlFor='startDate' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='startDate' placeholder={t("Register date")} disabled />
                </Grid>
            </Grid>
        </Dialog>
    );
};
