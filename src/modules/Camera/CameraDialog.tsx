import { useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput, ControllerSelect } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { UploadInput } from "@components/Input";
import { Label } from "@components/Label";
import { cameraResolutionOptions, cameraVoltageOptions, poeOptions } from "@configs/app";
import { useYupLocale } from "@configs/yupConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { CamFile, Camera } from "@interfaces/device";
import { Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import deviceService from "@services/device";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import { downloadFile } from "@utils/downloadImage";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

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
    const t = useTranslations("CameraPage");
    const tCommon = useTranslations("Common");
    const tGlobal = useTranslations();

    const { yup, translateRequiredMessage } = useYupLocale({
        page: "CameraPage"
    });

    const { categories, protocols } = useAppStore((state) => state);
    const { item, open, closeDialog, readonly } = useCameraDialog();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(item), [item]);
    const dialogTitle = useMemo(() => {
        if (readonly) {
            return t("Detail record");
        }

        return editMode ? t("Edit record") : t("Add new record");
    }, [editMode, t, readonly]);

    const protocolOptions = useMemo(
        () =>
            protocols.map((org) => ({
                value: org._id,
                label: `${org.code} (${org.name})`
            })),
        [protocols]
    );

    const categoryOptions = useMemo(
        () =>
            categories.map((org) => ({
                value: org._id,
                label: `${org.code} (${org.name})`
            })),
        [categories]
    );

    const resolutionOptions = useMemo(() => {
        return cameraResolutionOptions.reduce((acc, cur) => {
            acc.push({
                value: cur.category,
                label: tGlobal(cur.category),
                options: cur.options.map((o) => ({
                    value: o.value,
                    label: tGlobal(o.name)
                }))
            });
            return acc;
        }, []);
    }, [tGlobal]);

    const voltageOptions = useMemo(() => {
        return cameraVoltageOptions.reduce((acc, cur) => {
            acc.push({
                value: cur.category,
                label: tGlobal(cur.category),
                options: cur.options.map((o) => ({
                    value: o.value,
                    label: tGlobal(o.name)
                }))
            });
            return acc;
        }, []);
    }, [tGlobal]);

    const resolver = yup.object({
        cameraId: yup.string().required(translateRequiredMessage("Camera ID")),
        categoryId: yup.string().required(translateRequiredMessage("Camera type")),
        name: yup.string().required(translateRequiredMessage("Model name")),
        protocolId: yup.string().required(translateRequiredMessage("Protocol")),
        poe: yup.number().required(translateRequiredMessage("POE"))
    });

    const { handleSubmit, control, getValues, setValue, reset, watch, clearErrors } = useForm<FormCameraValues>({
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

    const handleSave = () => {
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
                        toast.success({ title: t("Edit record success") });
                        handleClose("success");
                    } else {
                        toast.error({
                            title: t("Edit record failed")
                        });
                    }
                } catch (error) {
                    toast.error({ title: t("Edit record failed"), description: error.message });
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
                        toast.success({ title: t("Create record success") });
                        handleClose("success");
                    } else {
                        toast.error({ title: t("Create record failed") });
                    }
                } catch (error) {
                    toast.error({ title: t("Create record failed"), description: error.message });
                } finally {
                    setIsLoading(false);
                }
            }
        })();
    };

    const fetchId = async () => {
        const categoryId = getValues("categoryId");

        if (!categoryId) {
            toast.error({ title: translateRequiredMessage("Camera type") });
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

                clearErrors("cameraId");
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
            title={dialogTitle}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
            hiddenOk={readonly}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={<Divider orientation='vertical' flexItem />}
                spacing={2}
            >
                <Grid padding={2} width='100%' gap={2} container spacing={2} columns={12} alignItems='center'>
                    {/* Model name Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Model name")} htmlFor='name' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='name'
                            placeholder={t("Model name")}
                            disabled={readonly}
                        />
                    </Grid>

                    {/* Camera type Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Camera type")} htmlFor='categoryId' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode || readonly}
                            control={control}
                            keyName='categoryId'
                            placeholder={t("Camera type")}
                            selectProps={{
                                options: categoryOptions
                            }}
                        />
                    </Grid>

                    {/* Camera ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Camera ID")} htmlFor='cameraId' required />
                    </Grid>
                    <Grid size={inputSize - 3}>
                        <ControllerInput control={control} keyName='cameraId' placeholder={t("Camera ID")} disabled />
                    </Grid>

                    <Grid size={3} alignSelf={"start"}>
                        <Button
                            color='primary'
                            style={{
                                width: "100%"
                            }}
                            height='51px'
                            disabled={editMode || readonly}
                            onClick={fetchId}
                            loading={isFetchingId}
                        >
                            {tCommon("Create ID")}
                        </Button>
                    </Grid>

                    {/* Factory Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Factory")} htmlFor='factory' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='factory'
                            placeholder={t("Factory")}
                            disabled={readonly}
                        />
                    </Grid>

                    {/* Protocol Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Protocol")} htmlFor='protocolId' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode || readonly}
                            control={control}
                            keyName='protocolId'
                            placeholder={t("Protocol")}
                            selectProps={{
                                options: protocolOptions
                            }}
                        />
                    </Grid>

                    {/* POE Field */}
                    <Grid size={labelSize}>
                        <Label label={t("POE")} htmlFor='poe' required />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode || readonly}
                            control={control}
                            keyName='poe'
                            placeholder={t("POE")}
                            selectProps={{
                                options: poeOptions.map((org) => ({
                                    value: org.value,
                                    label: tGlobal(org.name)
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
                        <Label label={t("Maximum resolution")} htmlFor='resolution' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode || readonly}
                            control={control}
                            keyName='resolution'
                            placeholder={t("Maximum resolution")}
                            selectProps={{
                                options: resolutionOptions
                            }}
                        />
                    </Grid>

                    {/* Voltage Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Voltage")} htmlFor='input' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerSelect
                            disabled={editMode || readonly}
                            control={control}
                            keyName='input'
                            placeholder={t("Voltage")}
                            selectProps={{
                                options: voltageOptions
                            }}
                        />
                    </Grid>

                    {/* Description Field */}
                    <Grid size={"grow"}>
                        <ControllerInput
                            control={control}
                            disabled={readonly}
                            keyName='description'
                            placeholder={t("Description")}
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

                {!readonly && (
                    <>
                        <Grid size={labelSize}>
                            <Label label={t("Upload file")} htmlFor='path' />
                        </Grid>
                        <Grid size={24 - labelSize}>
                            <UploadInput onFileChange={handleChangeFiles} placeholder={t("Upload placeholder")} />
                        </Grid>
                    </>
                )}

                {/* Show file list */}
                <Grid size={labelSize}>
                    <Label label={t("Download")} />
                </Grid>
                <Grid size={24 - labelSize} display='flex' gap={1} flexWrap='wrap'>
                    {watch("files")
                        .filter((item) => item.uploadedAt)
                        .map((item) => (
                            <FileInfo
                                key={item._id}
                                file={item}
                                onDownload={() => {
                                    downloadFile(item.url, item.name);
                                }}
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
