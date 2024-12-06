import { useEffect, useMemo, useState } from "react";

import { ControllerInput } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera } from "@interfaces/device";
import { Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import deviceService from "@services/device";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Button } from "@/components/Button";
import { ControllerSelect } from "@/components/Controller/ControllerSelect";
import { UploadInput } from "@/components/Input";
import { cameraResolutionOptions, cameraVoltageOptions, poeOptions } from "@/configs/app";
import { useAppStore } from "@/providers/AppStoreProvider";

export const useCameraDialog = dialogStore<Camera>();

interface CameraDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormCameraValues = Partial<{
    cameraId: string;
    categoryId: string;
    name: string;
    protocolId: string;
    factory: string;
    poe: number;
    resolution: string;
    input: string;
    description: string;
    path: string[];
    token: string;
}>;

const initFormValues: FormCameraValues = {
    cameraId: "",
    categoryId: "",
    name: "",
    protocolId: "",
    factory: "",
    poe: 0,
    resolution: "",
    input: "",
    description: "",
    path: [],
    token: ""
};

export const CameraDialog = ({ onClose = () => "" }: CameraDialogProps) => {
    const t = useTranslations();
    const { categories, protocols } = useAppStore((state) => state);
    const { item, open, closeDialog, setItem } = useCameraDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);
    const resolutionOptions = useMemo(() => {
        return cameraResolutionOptions.reduce((acc, cur) => {
            acc.push({
                value: cur.category,
                label: t(cur.category),
                options: cur.options.map((o) => ({
                    value: o.value,
                    label: t(o.name)
                }))
            });
            return acc;
        }, []);
    }, [t]);

    const voltageOptions = useMemo(() => {
        return cameraVoltageOptions.reduce((acc, cur) => {
            acc.push({
                value: cur.category,
                label: t(cur.category),
                options: cur.options.map((o) => ({
                    value: o.value,
                    label: t(o.name)
                }))
            });
            return acc;
        }, []);
    }, [t]);

    const resolver = yup.object({
        cameraId: yup.string().required("Camera ID is required"),
        categoryId: yup.string().required("Category ID is required"),
        name: yup.string().required("Name is required"),
        protocolId: yup.string().required("Protocol ID is required")
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
        setValue,
        reset,
        watch
    } = useForm<FormCameraValues>({
        resolver: yupResolver(resolver) as any,
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            console.log("🚀 ~ useEffect ~ item:", item);
            const newValue: FormCameraValues = {
                ...initFormValues,
                cameraId: item.cameraId,
                categoryId: item.category._id,
                name: item.name,
                protocolId: item.protocol._id,
                poe: item.poe,
                factory: item.factory || initFormValues.factory,
                resolution: item.resolution || initFormValues.resolution,
                input: item.input || initFormValues.input,
                description: item.description || initFormValues.description,
                path: [item.path]
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

        handleSubmit(async (data: FormCameraValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await deviceService.editCamera({
                        _id: item._id,
                        categoryId: data.categoryId,
                        name: data.name,
                        protocolId: data.protocolId,
                        factory: data.factory,
                        poe: data.poe,
                        resolution: data.resolution,
                        input: data.input,
                        description: data.description,
                        path: data.path[0] || ""
                    });
                    if (!response.err) {
                        toast.success({ title: t("CameraPage.Edit record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("CameraPage.Edit record failed") });
                    }
                } else {
                    const response = await deviceService.createCamera({
                        cameraId: data.cameraId,
                        categoryId: data.categoryId,
                        name: data.name,
                        protocolId: data.protocolId,
                        factory: data.factory,
                        poe: data.poe,
                        resolution: data.resolution,
                        input: data.input,
                        description: data.description,
                        token: data.token,
                        path: data.path[0] || ""
                    });
                    if (!response.err) {
                        toast.success({ title: t("CameraPage.Create record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("CameraPage.Create record failed") });
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
        const categoryId = getValues("categoryId");

        if (!categoryId) {
            toast.error({ title: "Please select category" });
            return;
        }

        setIsFetchingId(true);

        try {
            const response = await deviceService.getCameraId({
                prefix: categories.find((o) => o._id === categoryId)?.key || "A"
            });
            if (!response.err) {
                const { token, cameraId } = response.data;
                setValue("token", token);
                setValue("cameraId", cameraId);
            }
        } catch (error) {
            console.log("🚀 ~ fetchId ~ error:", error);
        } finally {
            setIsFetchingId(false);
        }
    };

    return (
        <Dialog
            aria-describedby='camera-dialog-description'
            aria-labelledby='camera-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            title={editMode ? t("CameraPage.Edit record") : t("CameraPage.Add new record")}
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
                    {/* Model name Field */}
                    <Grid size={labelSize}>
                        <Label label='Model name' htmlFor='name' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='name' placeholder='Model name' />
                    </Grid>

                    {/* Camera type Field */}
                    <Grid size={labelSize}>
                        <Label label='Camera type' htmlFor='categoryId' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='categoryId'
                            placeholder='Camera type'
                            selectProps={{
                                options: categories.map((org) => ({
                                    value: org._id,
                                    label: org.name
                                }))
                            }}
                        />
                    </Grid>

                    {/* Camera ID Field */}
                    <Grid size={labelSize}>
                        <Label label='Camera ID' htmlFor='cameraId' required />
                    </Grid>
                    <Grid size={inputSize - 3}>
                        <ControllerInput control={control} keyName='cameraId' placeholder='Camera ID' disabled />
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

                    {/* Factory Field */}
                    <Grid size={labelSize}>
                        <Label label='Factory' htmlFor='factory' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='factory' placeholder='Factory' />
                    </Grid>

                    {/* Protocol Field */}
                    <Grid size={labelSize}>
                        <Label label='Protocol' htmlFor='protocolId' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='protocolId'
                            placeholder='Protocol'
                            selectProps={{
                                options: protocols.map((org) => ({
                                    value: org._id,
                                    label: org.name
                                }))
                            }}
                        />
                    </Grid>

                    {/* POE Field */}
                    <Grid size={labelSize}>
                        <Label label='POE' htmlFor='poe' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='poe'
                            placeholder='POE'
                            selectProps={{
                                options: poeOptions.map((org) => ({
                                    value: org.value,
                                    label: t(org.name)
                                }))
                            }}
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
                    {/* Maximum resolution Field */}
                    <Grid size={labelSize}>
                        <Label label='Maximum resolution' htmlFor='resolution' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='resolution'
                            placeholder='Maximum resolution'
                            selectProps={{
                                options: resolutionOptions
                            }}
                        />
                    </Grid>

                    {/* Voltage Field */}
                    <Grid size={labelSize}>
                        <Label label='Voltage' htmlFor='input' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode}
                            control={control}
                            keyName='input'
                            placeholder='Voltage'
                            selectProps={{
                                options: voltageOptions
                            }}
                        />
                    </Grid>

                    {/* Description Field */}
                    <Grid size={"grow"}>
                        <ControllerInput
                            control={control}
                            keyName='description'
                            placeholder='Description'
                            inputProps={{
                                multiline: true,
                                rows: 10
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>

            <Divider />

            <Grid
                padding={2}
                width='100%'
                gap={2}
                container
                spacing={2}
                columns={24}
                alignItems={"center"}
                alignContent={"start"}
            >
                {/* Maximum resolution Field */}
                <Grid size={labelSize}>
                    <Label label='Upload file' htmlFor='path' />
                </Grid>
                <Grid size={24 - labelSize}>
                    <UploadInput />
                </Grid>

                {/* Show file list */}
                <Grid size={labelSize}>
                    <Label label='Download' />
                </Grid>
                <Grid size={24 - labelSize}>
                    {watch("path").map(
                        (item) =>
                            item && (
                                <a key={item} href={item} target='_blank' rel='noreferrer'>
                                    {item}
                                </a>
                            )
                    )}
                </Grid>
            </Grid>
        </Dialog>
    );
};
