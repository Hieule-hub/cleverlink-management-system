import { useEffect, useMemo, useState } from "react";

import { ControllerInput } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { CamFile, Camera } from "@interfaces/device";
import { Chip, Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
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

import { FileInfo } from "./FileInfo";

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
    files: CamFile[];
    newFiles: File[];
    deleteFiles: string[];
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
    files: [],
    newFiles: [],
    deleteFiles: [],
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
                categoryId: item.category?._id,
                name: item.name,
                protocolId: item.protocol?._id,
                poe: item.poe,
                factory: item.factory || initFormValues.factory,
                resolution: item.resolution || initFormValues.resolution,
                input: item.input || initFormValues.input,
                description: item.description || initFormValues.description,
                files: item.files || initFormValues.files
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

            if (item) {
                try {
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
                        newFiles: data.newFiles,
                        deleteFiles: data.deleteFiles
                    });
                    if (!response.err) {
                        toast.success({ title: t("CameraPage.Edit record success") });
                        handleClose("success");
                    } else {
                        toast.error({
                            title: t("CameraPage.Edit record failed")
                        });
                    }
                } catch (error) {
                    toast.error({ title: t("CameraPage.Edit record failed"), description: error.message });
                } finally {
                    setIsLoading(false);
                }
            } else {
                try {
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
                        newFiles: data.newFiles
                    });
                    if (!response.err) {
                        toast.success({ title: t("CameraPage.Create record success") });
                        handleClose("success");
                    } else {
                        toast.error({ title: t("CameraPage.Create record failed") });
                    }
                } catch (error) {
                    toast.error({ title: t("CameraPage.Create record failed"), description: error.message });
                } finally {
                    setIsLoading(false);
                }
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

    const handleChangeFiles = (files: File[]) => {
        console.log("🚀 ~ handleChangeFiles ~ files:", files);
        const newFiles = getValues("newFiles");
        setValue("newFiles", [...newFiles, ...files]);
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
                    <UploadInput onFileChange={handleChangeFiles} />
                </Grid>

                {/* Show file list */}
                <Grid size={labelSize}>
                    <Label label='Download' />
                </Grid>
                <Grid size={24 - labelSize} display='flex' gap={1} flexWrap='wrap'>
                    {watch("files").map((item) => (
                        <FileInfo
                            key={item._id}
                            file={item}
                            onDelete={() => {
                                const deleteFiles = getValues("deleteFiles");

                                setValue("deleteFiles", [...deleteFiles, item.key]);

                                setValue(
                                    "files",
                                    watch("files").filter((o) => o.key !== item.key)
                                );
                            }}
                        />
                    ))}
                    {watch("newFiles").map((item) => (
                        <FileInfo
                            key={item.name}
                            file={item}
                            onDelete={() =>
                                setValue(
                                    "newFiles",
                                    watch("newFiles").filter((o) => o.name !== item.name)
                                )
                            }
                        />
                    ))}
                </Grid>
            </Grid>
        </Dialog>
    );
};
