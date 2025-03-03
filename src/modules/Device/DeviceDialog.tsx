import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerAsyncSearchSelect, ControllerInput, Option } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { useYupLocale } from "@configs/yupConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { Device } from "@interfaces/device";
import { CastOutlined } from "@mui/icons-material";
import { Box, Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import companyService from "@services/company";
import deviceService from "@services/device";
import sceneService from "@services/scene";
import userService from "@services/user";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { triggerToastDev } from "@/utils";

export const useDeviceDialog = dialogStore<Device>();

interface DeviceDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormDeviceValues = Partial<{
    company: Option;
    scene: Option;
    place: string; // Install place
    active: Option; // Device setting : Device ID - IP Address - MAC
    mac: string; // Device MAC
    ipAddress: string; // Device IP Address
    manager: Option; // Manager
    userId: string; // Manager ID
    phone: string; // Manager phone
    email: string; // Manager email
}>;

const initFormValues: FormDeviceValues = {
    company: null,
    scene: null,
    place: "",
    active: null,
    mac: "",
    ipAddress: "",
    manager: null,
    userId: "",
    phone: "",
    email: ""
};

export const DeviceDialog = ({ onClose = () => "" }: DeviceDialogProps) => {
    const t = useTranslations("DevicePage");
    const tCommon = useTranslations("Common");

    const { yup, translateRequiredMessage } = useYupLocale({
        page: "DevicePage"
    });

    const { item, open, closeDialog, readonly } = useDeviceDialog();

    const [isLoading, setIsLoading] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);
    const dialogTitle = useMemo(() => {
        if (readonly) {
            return t("Detail record");
        }

        return editMode ? t("Edit record") : t("Add new record");
    }, [editMode, t, readonly]);

    const resolver = yup.object({
        company: yup.object().required(translateRequiredMessage("Company")),
        scene: yup.object().required(translateRequiredMessage("Scene")),
        active: yup.object().required(translateRequiredMessage("Device ID")),
        manager: yup.object().required(translateRequiredMessage("Manager"))
    });

    const { handleSubmit, control, setValue, reset, watch, clearErrors } = useForm<FormDeviceValues>({
        resolver: yupResolver(resolver) as any,
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            console.log("🚀 ~ useEffect ~ item:", item);
            const newValue: FormDeviceValues = {
                ...initFormValues,
                company: {
                    value: item.company?._id as string,
                    label: item.company?.name as string,
                    id: item.company?.companyId as string
                },
                scene: {
                    value: item.scene?._id as string,
                    label: item.scene?.name as string,
                    id: item.scene?.sceneId as string
                },
                place: item.place,
                active: {
                    value: item.activate?._id as string,
                    label: item.activate?.boxId as string,
                    id: JSON.stringify({
                        ipAddress: item.activate?.ip,
                        mac: item.activate?.mac
                    })
                },
                mac: item.activate?.mac,
                ipAddress: item.activate?.ip,
                manager: {
                    value: item.user?._id as string,
                    label: item.user?.name as string,
                    id: JSON.stringify({
                        userId: item.user?.userId,
                        phone: item.user?.phone || "",
                        email: item.user?.email || ""
                    })
                },
                userId: item.user?.userId as string,
                phone: item.user?.phone || "",
                email: item.user?.email || ""
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
        handleSubmit(async (data: FormDeviceValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await deviceService.editDevice({
                        _id: item._id,
                        companyId: data.company?.value as string,
                        sceneId: data.scene?.value as string,
                        userId: data.manager?.value as string,
                        place: data.place,
                        activateId: data.active?.value as string
                    });
                    if (!response.err) {
                        toast.success({ title: t("Edit record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Edit record failed") });
                    }
                } else {
                    const response = await deviceService.createDevice({
                        companyId: data.company?.value as string,
                        sceneId: data.scene?.value as string,
                        userId: data.manager?.value as string,
                        place: data.place,
                        activateId: data.active?.value as string
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

    const companySelected = watch("company");
    const sceneSelected = watch("scene");

    const fetchScenes = useCallback(
        (query: string) => {
            return sceneService
                .getSceneList({
                    filters: query,
                    limit: 10,
                    page: 1,
                    companyId: (companySelected?.value || "") as string,
                    sortField: "name",
                    sortOrder: "asc"
                })
                .then((res) => {
                    if (!res.err) {
                        return res.data.scenes.map((scene) => ({
                            label: scene.name,
                            value: scene._id
                        }));
                    } else {
                        return [];
                    }
                });
        },
        [companySelected]
    );

    const fetchCompanies = useCallback((query: string) => {
        return companyService
            .getCompanyList({ filters: query, limit: 10, page: 1, sortField: "name", sortOrder: "asc" })
            .then((res) => {
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

    const fetchActivates = useCallback((query: string) => {
        return deviceService.getActiveList({ filters: query, limit: 10, page: 1, status: "unactive" }).then((res) => {
            if (!res.err) {
                return res.data.activates.map((active) => ({
                    label: active.boxId,
                    value: active._id,
                    id: JSON.stringify({
                        ipAddress: active.ip,
                        mac: active.mac
                    })
                }));
            } else {
                return [];
            }
        });
    }, []);

    const fetchUsers = useCallback(
        (query: string) => {
            if (!companySelected || !sceneSelected) {
                return Promise.resolve([]);
            }

            return userService
                .getUserList({
                    filters: query,
                    limit: 10,
                    page: 1,
                    companyId: companySelected?.value as string,
                    sceneId: sceneSelected?.value as string,
                    sortField: "name",
                    sortOrder: "asc"
                })
                .then((res) => {
                    if (!res.err) {
                        return res.data.users.map((user) => ({
                            label: user.name,
                            value: user._id,
                            id: JSON.stringify({
                                userId: user.userId,
                                phone: user.phone,
                                email: user.email
                            })
                        }));
                    } else {
                        return [];
                    }
                });
        },
        [companySelected, sceneSelected]
    );

    return (
        <Dialog
            aria-describedby='device-dialog-description'
            aria-labelledby='device-dialog-title'
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
            footer={
                <Box display='flex' width='100%' alignItems='center' justifyContent='space-between'>
                    <Button
                        color='primary'
                        startIcon={CastOutlined}
                        height='36px'
                        disabled={!item}
                        onClick={() => {
                            //new tab with url to device
                            if (item) {
                                const port = item.activate?.port || 3000;
                                window.open(`http://${item.activate?.ip}:${port}`, "_blank");
                            }
                        }}
                    >
                        {t("Connecting to the device")}
                    </Button>
                    <Box>
                        <Button onClick={() => handleClose()} height='36px'>
                            {tCommon("Cancel")}
                        </Button>
                        {readonly ? null : (
                            <Button
                                color='primary'
                                height='36px'
                                onClick={handleSave}
                                style={{
                                    marginLeft: "8px"
                                }}
                            >
                                {tCommon("Save")}
                            </Button>
                        )}
                    </Box>
                </Box>
            }
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={<Divider orientation='vertical' flexItem />}
                spacing={2}
            >
                <Grid padding={2} width='100%' gap={2} container spacing={2} columns={12} alignItems='center'>
                    {/* Company Field */}
                    <Grid size={labelSize}>
                        <Label required label={t("Company")} htmlFor='company' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            control={control}
                            disabled={readonly}
                            keyName='company'
                            placeholder={t("Company")}
                            request={fetchCompanies}
                            onchangeField={() => {
                                //reset scene
                                setValue("scene", null);
                                clearErrors("scene");

                                //reset manager
                                setValue("manager", null);
                                clearErrors("manager");
                                setValue("phone", "");
                                setValue("email", "");
                                setValue("userId", "");
                            }}
                        />
                    </Grid>

                    {/* Scene Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Scene")} htmlFor='scene' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            control={control}
                            disabled={!companySelected || readonly}
                            keyName='scene'
                            placeholder={t("Scene")}
                            request={fetchScenes}
                            onchangeField={() => {
                                //reset manager
                                setValue("manager", null);
                                clearErrors("manager");
                                setValue("phone", "");
                                setValue("email", "");
                                setValue("userId", "");
                            }}
                        />
                        <ControllerInput hidden control={control} keyName='sceneId' placeholder={t("Scene ID")} />
                    </Grid>

                    {/* Emplacement Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Emplacement")} htmlFor='place' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='place'
                            placeholder={t("Emplacement")}
                            disabled={readonly}
                        />
                    </Grid>

                    {/* Device ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Device ID")} htmlFor='active' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            control={control}
                            disabled={readonly}
                            keyName='active'
                            placeholder={t("Device ID")}
                            request={fetchActivates}
                            onchangeField={(option) => {
                                if (option) {
                                    const data = JSON.parse(option?.id as string);
                                    setValue("ipAddress", data?.ipAddress as string);
                                    setValue("mac", data?.mac as string);
                                }
                            }}
                            renderOption={(props, option, state) => {
                                const data = JSON.parse(option.id as string);
                                const { key, ...otherProps } = props as any;

                                return (
                                    <li
                                        {...otherProps}
                                        key={option.value}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "start",
                                            padding: "4px 8px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #f0f0f0"
                                        }}
                                    >
                                        {option.label}
                                        {data?.ipAddress && (
                                            <p key={key + "ipaddress"} style={{ color: "gray", fontSize: "12px" }}>
                                                {data?.ipAddress}
                                            </p>
                                        )}
                                        {data?.mac && (
                                            <p key={key + "mac"} style={{ color: "gray", fontSize: "12px" }}>
                                                {data?.mac}
                                            </p>
                                        )}
                                    </li>
                                );
                            }}
                        />
                    </Grid>

                    {/* IP Address Field */}
                    <Grid size={labelSize}>
                        <Label label={t("IP Address")} htmlFor='ipAddress' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='ipAddress' placeholder={t("IP Address")} disabled />
                    </Grid>

                    {/* MAC Field */}
                    <Grid size={labelSize}>
                        <Label label={t("MAC")} htmlFor='mac' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='mac' placeholder={t("MAC")} disabled />
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
                    {/* Manager Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Manager")} htmlFor='manager' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            control={control}
                            disabled={!companySelected || !sceneSelected || readonly}
                            keyName='manager'
                            placeholder={t("Manager")}
                            request={fetchUsers}
                            onchangeField={(option) => {
                                if (option) {
                                    const data = JSON.parse(option?.id as string);
                                    setValue("phone", data?.phone as string);
                                    setValue("email", data?.email as string);
                                    setValue("userId", data?.userId as string);
                                }
                            }}
                        />
                    </Grid>

                    {/* User ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("User ID")} htmlFor='userId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='userId' placeholder={t("User ID")} disabled />
                    </Grid>

                    {/* Phone number Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Phone number")} htmlFor='phone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='phone' placeholder={t("Phone number")} disabled />
                    </Grid>

                    {/* Email Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Email")} htmlFor='email' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='email' placeholder={t("Email")} disabled />
                    </Grid>
                </Grid>
            </Stack>
        </Dialog>
    );
};
