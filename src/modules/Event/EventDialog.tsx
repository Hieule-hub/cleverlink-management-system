import { useEffect, useState } from "react";

import { ControllerInput } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import type { Event } from "@interfaces/event";
import { Chip, Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import eventService from "@services/event";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export const useEventDialog = dialogStore<Event>();

interface EventDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormValues = Partial<{
    aiCode: string;
    receiver: string[];
    images: string[];
    time: string;
    channel: number;
    solve: string;
    notifyCode: string;

    deviceId: string;
}>;

const initFormValues: FormValues = {
    receiver: [],
    images: [],
    time: "",
    channel: 0,
    solve: "",
    notifyCode: "",
    deviceId: ""
};

export const EventDialog = ({ onClose = () => "" }: EventDialogProps) => {
    const t = useTranslations("EventPage");

    const { item, open, closeDialog, setItem } = useEventDialog();
    const [isLoading, setIsLoading] = useState(false);

    // const editMode = useMemo(() => Boolean(item), [item]);

    const { handleSubmit, control, reset, watch } = useForm<FormValues>({
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            console.log("🚀 ~ useEffect ~ item:", item);
            const newValue: FormValues = {
                ...initFormValues,
                aiCode: item.aiCode,
                channel: item.channel,
                deviceId: item.activate?.boxId || initFormValues.deviceId,
                images: item.images,
                receiver: item.receiver,
                time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
                notifyCode: item.notifyCode,
                solve: item.solve
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
        handleSubmit(async (data: FormValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await eventService.editEvent({
                        _id: item._id,
                        solve: data.solve
                    });
                    if (!response.err) {
                        toast.success({ title: t("Edit record success") });
                        handleClose("success");
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
        <Dialog
            aria-describedby='event-dialog-description'
            aria-labelledby='event-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            title={item ? t("Edit record") : t("Add new record")}
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
                    {/* AI Code Field */}
                    <Grid size={labelSize}>
                        <Label label={t("AI Code")} htmlFor='aiCode' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput disabled control={control} keyName='aiCode' placeholder={t("Company ID")} />
                    </Grid>

                    {/* Event time Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Event time")} htmlFor='time' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput disabled control={control} keyName='time' placeholder={t("Event time")} />
                    </Grid>

                    {/* Device ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Device ID")} htmlFor='deviceId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput disabled control={control} keyName='deviceId' placeholder={t("Device ID")} />
                    </Grid>

                    {/* Channel Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Channel")} htmlFor='channel' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput disabled control={control} keyName='channel' placeholder={t("Channel")} />
                    </Grid>

                    {/* Warning device/location Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Warning device/location")} htmlFor='notifyCode' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            disabled
                            control={control}
                            keyName='notifyCode'
                            placeholder={t("Warning device/location")}
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
                    {/* Action taken Field */}
                    <Grid size={12}>
                        <Label label={t("Action taken")} htmlFor='solve' />
                    </Grid>
                    <Grid size={"grow"}>
                        <ControllerInput
                            control={control}
                            keyName='solve'
                            placeholder={t("Action taken")}
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
                alignItems={"start"}
                alignContent={"start"}
            >
                {/* Maximum resolution Field */}
                <Grid size={labelSize}>
                    <Label label={t("Recipient list")} htmlFor='receiver' />
                </Grid>
                <Grid
                    size={24 - labelSize}
                    gap={1}
                    display={"flex"}
                    flexWrap={"wrap"}
                    maxHeight={"140px"}
                    sx={{
                        overflowY: "auto"
                    }}
                >
                    {watch("receiver")?.map((item) => item && <Chip color='primary' key={item} label={item} />)}
                </Grid>
            </Grid>
        </Dialog>
    );
};
