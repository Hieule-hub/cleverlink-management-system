import React from "react";

import { Label } from "@components/Label";
import { TitleTag } from "@components/TitleTag";
import { Channel } from "@interfaces/device";
import { Grid2 as Grid, Grid2Props, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

const labelSize = 4;
const inputSize = 8;

interface ChannelInfoProps extends Grid2Props {
    channel?: Channel;
    channelId: number;
}

export const ChannelInfo = ({ channel, channelId }: ChannelInfoProps) => {
    const t = useTranslations("CameraPage");

    return (
        <Grid container spacing={2} columns={12} alignItems={"center"}>
            <Grid size={12}>
                <TitleTag title={`CH.` + channelId} color={channel ? "primary" : "default"} />
            </Grid>

            {/* Model Id Field */}
            <Grid size={labelSize}>
                <Label label={t("Model ID")} />
            </Grid>

            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.modelId || ""} disabled />
            </Grid>

            {/* Model name Field */}
            <Grid size={labelSize}>
                <Label label={t("Model name")} />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.modelName || ""} disabled />
            </Grid>

            {/* IP Field */}
            <Grid size={labelSize}>
                <Label label={t("IP Address")} />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.ip || ""} disabled />
            </Grid>

            {/* Emplacement Field */}
            <Grid size={labelSize}>
                <Label label={t("Emplacement")} htmlFor='place' />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.place || ""} disabled />
            </Grid>

            {/* Factory Field */}
            <Grid size={labelSize}>
                <Label label={t("Factory")} />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.factory || ""} disabled />
            </Grid>
        </Grid>
    );
};
