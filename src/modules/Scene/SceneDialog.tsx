import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { ControllerAsyncSearchSelect, type Option } from "@components/Controller/ControllerAsyncSearchSelect";
import { ControllerSelect } from "@components/Controller/ControllerSelect";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Scene } from "@interfaces/scene";
import { Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import sceneService from "@services/scene";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { TitleTag } from "@/components/TitleTag";
import companyService from "@/services/company";

export const useSceneDialog = dialogStore<Scene>();

interface SceneDialogProps {
    onClose?: (status?: string) => void;
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
    company: {
        label: "",
        value: "",
        id: ""
    },
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

export const SceneDialog = ({ onClose = () => "" }: SceneDialogProps) => {
    const t = useTranslations();
    const { areas } = useAppStore((state) => state);
    const { item, open, closeDialog, setItem } = useSceneDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingUserId, setIsFetchingUserId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);

    const resolver = yup.object({
        userId: yup.string().required("User ID is required"),
        areaId: yup.string().required("Area is required"),
        name: yup.string().required("Scene name is required"),
        companyId: yup.string().required("Company ID is required")
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
        setValue,
        reset
    } = useForm<FormValues>({
        resolver: yupResolver(resolver),
        defaultValues: {
            userId: ""
        }
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

    const handleClose = () => {
        onClose();
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
                        toast.success({ title: t("ScenePage.Edit record success") });
                        handleClose();
                    } else {
                        // toast.error({ title: t("ScenePage.Edit record failed") });
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
                        toast.success({ title: t("ScenePage.Create record success") });
                        handleClose();
                    } else {
                        // toast.error({ title: t("ScenePage.Create record failed") });
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
            toast.error({ title: "Please select area" });
            return;
        }

        //get role code
        setIsFetchingUserId(true);

        try {
            const response = await sceneService.getSceneIdAndUserId({
                prefixScene: areas.find((o) => o._id === areaId)?.code || "C",
                prefixUser: "BU"
            });
            if (!response.err) {
                const { userId, sceneId, token, roleId, password } = response.data;
                setValue("userId", userId);
                setValue("sceneId", sceneId);
                setValue("password", password);
                setValue("token", token);
                setValue("roleId", roleId._id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingUserId(false);
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
            title={item ? t("ScenePage.Edit record") : t("ScenePage.Add new record")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
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
                        <TitleTag title={t("ScenePage.title")} />
                    </Grid>

                    {/* Company Field */}
                    <Grid size={labelSize}>
                        <Label required label='Company' htmlFor='company' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            disabled={editMode}
                            control={control}
                            keyName='company'
                            placeholder='Company'
                            request={fetchCompanies}
                            onchangeField={(value) => {
                                if (value) {
                                    setValue("companyId", value?.id as string);
                                }
                            }}
                        />
                    </Grid>

                    {/* Company ID Field */}
                    <Grid size={labelSize}>
                        <Label label='Company ID' htmlFor='companyId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='companyId' placeholder='Company ID' disabled />
                    </Grid>

                    {/* Scene name Field */}
                    <Grid size={labelSize}>
                        <Label required label='Scene name' htmlFor='name' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='name' placeholder='Name' />
                    </Grid>

                    {/* Area ID Field */}
                    <Grid size={labelSize}>
                        <Label required label='Area' htmlFor='areaId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='areaId'
                            placeholder='Area'
                            selectProps={{
                                options: areas.map((o) => ({
                                    value: o._id,
                                    label: `${o.code} - ${o.name}`
                                }))
                            }}
                        />
                    </Grid>

                    {/* Scene ID Field */}
                    <Grid size={labelSize}>
                        <Label label='Scene ID' htmlFor='sceneId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='sceneId' placeholder='Scene ID' disabled />
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
                            loading={isFetchingUserId}
                        >
                            {t("Common.Init")}
                        </Button>
                    </Grid>

                    {/* Address Field */}
                    <Grid size={labelSize}>
                        <Label label='Address' htmlFor='address' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='address' placeholder='Address' />
                    </Grid>

                    {/* Phone number Field */}
                    <Grid size={labelSize}>
                        <Label label='Phone number' htmlFor='phone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='phone' placeholder='Phone Number' />
                    </Grid>

                    {/* Website Field */}
                    <Grid size={labelSize}>
                        <Label label='Website' htmlFor='website' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='website' placeholder='Website' />
                    </Grid>

                    {/* Register Date Field */}
                    <Grid size={labelSize}>
                        <Label label='Register date' htmlFor='startDate' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='startDate' placeholder='Register Date' disabled />
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
                        <TitleTag title={t("ScenePage.Manager")} />
                    </Grid>

                    {/* PName Field */}
                    <Grid size={labelSize}>
                        <Label label='Name' htmlFor='pName' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='pName' placeholder='Name' disabled={editMode} />
                    </Grid>

                    {/* PDepartment name Field */}
                    <Grid size={labelSize}>
                        <Label label='Department name' htmlFor='pDepartment' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pDepartment'
                            placeholder='Department name'
                            disabled={editMode}
                        />
                    </Grid>

                    {/* PPhone number Field */}
                    <Grid size={labelSize}>
                        <Label label='Phone number' htmlFor='pPhone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='pPhone'
                            placeholder='Phone number'
                            disabled={editMode}
                        />
                    </Grid>

                    {/* PEmail Field */}
                    <Grid size={labelSize}>
                        <Label label='Email' htmlFor='pEmail' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='pEmail' placeholder='Email' disabled={editMode} />
                    </Grid>
                </Grid>
            </Stack>
        </Dialog>
    );
};
