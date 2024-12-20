import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerAsyncSearchSelect, ControllerInput, ControllerSelect, type Option } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { TitleTag } from "@components/TitleTag";
import { useYupLocale } from "@configs/yupConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { Scene } from "@interfaces/scene";
import { Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import sceneService from "@services/scene";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export const useSceneDialog = dialogStore<Scene>();

interface SceneDialogProps {
    onClose?: (status?: string) => void;
    readonly?: boolean;
}

const labelSize = 4;
const inputSize = 8;

type FormValues = Partial<{
    company: Option;
    companyId: string;
    name: string;
    areaId: string;
    sceneId: string;
    address: string;
    phone: string;
    website: string;
    userId: string;
    password: string;
    roleId: string;
    token: string;
    startDate: string;

    pName: string;
    pDepartment: string;
    pPhone: string;
    pEmail: string;
}>;

const initFormValues: FormValues = {
    company: null,
    companyId: "",
    name: "",
    areaId: "",
    sceneId: "",
    address: "",
    phone: "",
    website: "",
    userId: "",
    password: "",
    roleId: "",
    token: "",
    startDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),

    pName: "",
    pDepartment: "",
    pPhone: "",
    pEmail: ""
};

export const SceneDialog = ({ onClose = () => "", readonly }: SceneDialogProps) => {
    const t = useTranslations("ScenePage");
    const tCommon = useTranslations("Common");

    const { yup, translateRequiredMessage, translateInvalidMessage } = useYupLocale({
        page: "ScenePage"
    });

    const { areas } = useAppStore((state) => state);
    const { item, open, closeDialog } = useSceneDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);
    const areaOptions = useMemo(
        () => areas.map((area) => ({ label: `${area.code} - ${area.name}`, value: area._id })),
        [areas]
    );

    const resolver = yup.object({
        company: yup.object().required(translateRequiredMessage("Company")),
        userId: yup.string().required(translateRequiredMessage("User ID")),
        areaId: yup.string().required(translateRequiredMessage("Area")),
        name: yup.string().required(translateRequiredMessage("Name")),
        pEmail: yup.string().email(translateInvalidMessage("Email"))
    });

    const { handleSubmit, control, setValue, reset, getValues, clearErrors } = useForm<FormValues>({
        resolver: yupResolver(resolver) as any,
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            console.log("🚀 ~ useEffect ~ item:", item);
            const newValue: FormValues = {
                ...initFormValues,
                company: item.company
                    ? {
                          label: item.company?.name,
                          value: item.company?._id,
                          id: item.company?.companyId
                      }
                    : initFormValues.company,
                companyId: item.company?.companyId,
                userId: item.user?.userId,
                sceneId: item.sceneId,
                address: item.address || initFormValues.address,
                website: item.website || initFormValues.website,
                phone: item.phone || initFormValues.phone,
                name: item.name,
                areaId: item.areaId,
                startDate: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                pName: item.pName,
                pDepartment: item.pDepartment,
                pPhone: item.pPhone,
                pEmail: item.pEmail
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
        handleSubmit(async (data: FormValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await sceneService.editScene({
                        _id: item._id,
                        name: data.name,
                        areaId: data.areaId,
                        phone: data.phone,
                        website: data.website,
                        address: data.address
                    });
                    if (!response.err) {
                        toast.success({ title: t("Edit record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Edit record failed") });
                    }
                } else {
                    const response = await sceneService.createScene({
                        sceneId: data.sceneId,
                        companyId: data.company?.value as string,
                        name: data.name,
                        areaId: data.areaId,
                        userId: data.userId,
                        password: data.password,
                        roleId: data.roleId,
                        address: data.address,
                        phone: data.phone,
                        website: data.website,
                        pName: data.pName,
                        pDepartment: data.pDepartment,
                        pPhone: data.pPhone,
                        pEmail: data.pEmail,
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
        const areaId = getValues("areaId");

        if (!areaId) {
            toast.error({ title: translateRequiredMessage("Area") });
            return;
        }

        //get role code
        setIsFetchingId(true);

        try {
            const response = await sceneService.getSceneIdAndUserId({
                prefixScene: areas.find((o) => o._id === areaId)?.code || "C",
                prefixUser: "BU"
            });
            if (!response.err) {
                const { userId, sceneId, token, roleId, password } = response.data;
                setValue("userId", userId);
                clearErrors("userId");

                setValue("sceneId", sceneId);
                setValue("password", password);
                setValue("token", token);
                setValue("roleId", roleId._id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingId(false);
        }
    };

    const fetchCompanies = useCallback((query: string) => {
        return companyService.getCompanyList({ filters: query, limit: 10, page: 1 }).then((res) => {
            if (!res.err) {
                return res.data.companies.map((company) => ({
                    label: company.name,
                    value: company._id,
                    id: company.companyId
                }));
            } else {
                return [];
            }
        });
    }, []);

    return (
        <Dialog
            aria-describedby='scene-dialog-description'
            aria-labelledby='scene-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            title={editMode ? t("Edit record") : t("Add new record")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            hiddenOk={readonly}
            loading={isLoading}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={<Divider orientation='vertical' flexItem />}
                spacing={2}
            >
                <Grid padding={2} width='100%' gap={2} container spacing={2} columns={12} alignItems='center'>
                    {/* Title Tag */}
                    <Grid size={12}>
                        <TitleTag title={t("title")} />
                    </Grid>

                    {/* Company Field */}
                    <Grid size={labelSize}>
                        <Label required label={t("Company")} htmlFor='company' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            disabled={editMode && readonly}
                            control={control}
                            keyName='company'
                            placeholder={t("Company")}
                            request={fetchCompanies}
                            onchangeField={(value) => {
                                setValue("companyId", (value?.id || "") as string);
                            }}
                        />
                    </Grid>

                    {/* Company ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Company ID")} htmlFor='companyId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='companyId' placeholder={t("Company ID")} disabled />
                    </Grid>

                    {/* Scene name Field */}
                    <Grid size={labelSize}>
                        <Label required label={t("Scene name")} htmlFor='name' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='name' placeholder={t("Name")} disabled={readonly} />
                    </Grid>

                    {/* Area ID Field */}
                    <Grid size={labelSize}>
                        <Label required label={t("Area")} htmlFor='areaId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode && readonly}
                            control={control}
                            keyName='areaId'
                            placeholder={t("Area")}
                            selectProps={{
                                options: areaOptions
                            }}
                        />
                    </Grid>

                    {/* Scene ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Scene ID")} htmlFor='sceneId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='sceneId' placeholder={t("Scene ID")} disabled />
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
                            disabled={editMode && readonly}
                            onClick={fetchId}
                            loading={isFetchingId}
                        >
                            {tCommon("Init")}
                        </Button>
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

                    {/* Register Date Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Register date")} htmlFor='startDate' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='startDate'
                            placeholder={t("Register date")}
                            disabled
                        />
                    </Grid>
                </Grid>

                <Grid
                    padding={2}
                    width='100%'
                    gap={2}
                    container
                    spacing={2}
                    columns={12}
                    alignItems={"center"}
                    alignContent={"start"}
                >
                    {/* PTitle button */}
                    <Grid size={12}>
                        <TitleTag title={t("Manager")} />
                    </Grid>

                    {/* PName Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Name")} htmlFor='pName' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pName'
                            placeholder={t("Name")}
                            disabled={editMode && readonly}
                        />
                    </Grid>

                    {/* PDepartment name Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Department name")} htmlFor='pDepartment' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pDepartment'
                            placeholder={t("Department name")}
                            disabled={editMode && readonly}
                        />
                    </Grid>

                    {/* PPhone number Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Phone number")} htmlFor='pPhone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pPhone'
                            placeholder={t("Phone number")}
                            disabled={editMode && readonly}
                        />
                    </Grid>

                    {/* PEmail Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Email")} htmlFor='pEmail' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pEmail'
                            placeholder={t("Email")}
                            disabled={editMode && readonly}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Dialog>
    );
};
