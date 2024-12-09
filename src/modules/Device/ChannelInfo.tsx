import React from "react";

import { Label } from "@components/Label";
import { TitleTag } from "@components/TitleTag";
import { Channel } from "@interfaces/device";
import { Grid2 as Grid, Grid2Props, TextField } from "@mui/material";

const labelSize = 4;
const inputSize = 8;

interface ChannelInfoProps extends Grid2Props {
    channel?: Channel;
    channelId: number;
}

export const ChannelInfo = ({ channel, channelId }: ChannelInfoProps) => {
    return (
        <Grid container spacing={2} columns={12} alignItems={"center"}>
            <Grid size={12}>
                <TitleTag title={`CH.` + channelId} color={channel ? "primary" : "default"} />
            </Grid>

            {/* Model Id Field */}
            <Grid size={labelSize}>
                <Label label='Model ID' />
            </Grid>

            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.modelId || ""} disabled />
            </Grid>

            {/* Model name Field */}
            <Grid size={labelSize}>
                <Label label='Model name' />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.modelName || ""} disabled />
            </Grid>

            {/* IP Field */}
            <Grid size={labelSize}>
                <Label label='IP' />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.ip || ""} disabled />
            </Grid>

            {/* Emplacement Field */}
            <Grid size={labelSize}>
                <Label label='Emplacement' htmlFor='place' />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.place || ""} disabled />
            </Grid>

            {/* Factory Field */}
            <Grid size={labelSize}>
                <Label label='Factory' />
            </Grid>
            <Grid size={inputSize}>
                <TextField fullWidth value={channel?.factory || ""} disabled />
            </Grid>
        </Grid>
    );
};
