import { useState } from "react";

import { Button } from "@components/Button";
import { Dialog } from "@components/Dialog";
import { ViewPlayer } from "@components/ViewPlayer";
import type { Event } from "@interfaces/event";
import { CastOutlined, Download } from "@mui/icons-material";
import { Box, Divider, Grid2 as Grid, Typography, Zoom, styled } from "@mui/material";
import { dialogStore } from "@store/dialogStore";
import { downloadFile } from "@utils/downloadImage";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

export const useSnapshotDialogDialog = dialogStore<Event>();

interface SnapshotDialogProps {
    onClose?: (status?: string) => void;
}

const GridContainerStyled = styled(Grid)`
    border-bottom: 1px solid rgba(220, 220, 220, 1);
    font-size: 15px;

    &:last-child {
        border-bottom: none;
    }

    .grid-item {
        border-left: 1px solid rgba(220, 220, 220, 1);
        padding: 0 8px;
        min-height: 30px;
        display: flex;
        align-items: center;
    }

    .grid-item:first-child {
        border-left: none;
    }

    .grid-item:nth-child(odd) {
        background-color: rgba(220, 220, 220, 0.3);
    }
`;

export const SnapshotDialog = ({ onClose = () => "" }: SnapshotDialogProps) => {
    const t = useTranslations();
    const tAiCode = useTranslations("AiCode");
    const { item, open, closeDialog } = useSnapshotDialogDialog();
    const [imageSelected, setImageSelected] = useState(item?.images[0] || "");

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
    };

    const handleDownloadImage = async () => {
        if (!imageSelected) {
            return;
        }

        downloadFile(imageSelected, "image-snapshot");
    };

    return (
        <Dialog
            aria-describedby='snapshot-dialog-description'
            aria-labelledby='snapshot-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            onClose={() => handleClose()}
            title={
                <>
                    {t("EventPage.View snapshot")}
                    {item?.aiCode && " | " + tAiCode(item?.aiCode)}
                </>
            }
            footer={
                <Box display='flex' width='100%' alignItems='center' gap='10px'>
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
                    <Button disabled={!imageSelected} startIcon={Download} height='36px' onClick={handleDownloadImage}>
                        {t("Common.Download")}
                    </Button>

                    <Typography
                        sx={{
                            flexGrow: 1
                        }}
                        variant='body1'
                        color='primary'
                    >
                        {t("UserPage.Notice note")}
                    </Typography>

                    <Button onClick={() => handleClose()} height='36px'>
                        {t("Common.Close")}
                    </Button>
                </Box>
            }
        >
            <ViewPlayer
                onChange={(index) => {
                    setImageSelected(item?.images[index]);
                }}
                items={item?.images}
                sx={{
                    margin: "16px"
                }}
            />

            <Divider />

            {item && (
                <Box
                    sx={{
                        margin: "16px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e0e0e0"
                    }}
                >
                    <GridContainerStyled container columns={12} alignItems='stretch'>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Event time")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {dayjs(item?.time).format("YYYY-MM-DD HH:mm:ss")}
                        </Grid>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Emplacement")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {item?.device?.place}
                        </Grid>
                    </GridContainerStyled>
                    <GridContainerStyled container columns={12} alignItems='stretch'>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Channel")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {`CH ${item?.channel}`}
                        </Grid>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Device ID")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {item.activate?.boxId}
                        </Grid>
                    </GridContainerStyled>
                    <GridContainerStyled container columns={12} alignItems='stretch'>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Warning device")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {item?.notifyCode}
                        </Grid>
                        <Grid className='grid-item' size={2}>
                            {t("EventPage.Occurrence")}
                        </Grid>
                        <Grid className='grid-item' size={4}>
                            {tAiCode(item?.aiCode)}
                        </Grid>
                    </GridContainerStyled>
                </Box>
            )}
        </Dialog>
    );
};
