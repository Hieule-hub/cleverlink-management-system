import { useEffect, useState } from "react";

import { Button } from "@components/Button";
import { Dialog } from "@components/Dialog";
import type { Event } from "@interfaces/event";
import { Download, InfoOutlined, PauseCircle, PlayCircle, SkipNext, SkipPrevious } from "@mui/icons-material";
import { Box, Divider, Grid2 as Grid, IconButton, Typography, Zoom } from "@mui/material";
import { dialogStore } from "@store/dialogStore";
import { downloadFile } from "@utils/downloadImage";
import { useTranslations } from "next-intl";

export const useSnapshotDialogDialog = dialogStore<Event>();

interface SnapshotDialogProps {
    onClose?: (status?: string) => void;
}

export const SnapshotDialog = ({ onClose = () => "" }: SnapshotDialogProps) => {
    const t = useTranslations();
    const { item, open, closeDialog } = useSnapshotDialogDialog();
    const [imageSelected, setImageSelected] = useState(item?.images[0] || "");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setImageSelected(item?.images[0]);
        setIsPlaying(false);
    }, [item]);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (isPlaying) {
            timer = setInterval(() => {
                handleNextImage();
            }, 500);
        } else {
            if (timer) clearInterval(timer);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPlaying, imageSelected]);

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
        setImageSelected("");
        setIsPlaying(false); // Stop playing on close
    };

    const handleDownloadImage = async () => {
        if (!imageSelected) {
            return;
        }

        downloadFile(imageSelected, "image-snapshot");
    };

    const handleNextImage = () => {
        const currentIndex = item?.images.indexOf(imageSelected) ?? 0;
        const nextIndex = (currentIndex + 1) % item?.images.length;
        setImageSelected(item?.images[nextIndex]);
    };

    const handlePreviousImage = () => {
        const currentIndex = item?.images.indexOf(imageSelected) ?? 0;
        const prevIndex = (currentIndex - 1 + item?.images.length) % item?.images.length;
        setImageSelected(item?.images[prevIndex]);
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
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
                <Box display='flex' alignItems='center'>
                    {t("EventPage.View snapshot")}
                    <InfoOutlined
                        sx={{
                            fontSize: "20px",
                            marginLeft: "6px"
                        }}
                    />
                </Box>
            }
            footer={
                <Box display='flex' width='100%' alignItems='center' gap='10px'>
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
            <Box
                sx={{
                    height: "400px",
                    margin: "16px",
                    backgroundImage: `url(${imageSelected})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />
            <Box display='flex' justifyContent='center' gap={1} marginBottom={2} color={"black"} width={"100%"}>
                <IconButton color='inherit' onClick={handlePreviousImage}>
                    <SkipPrevious color='inherit' />
                </IconButton>
                <IconButton color='inherit' onClick={togglePlayPause}>
                    {isPlaying ? <PauseCircle color='inherit' /> : <PlayCircle color='inherit' />}
                </IconButton>
                <IconButton color='inherit' onClick={handleNextImage}>
                    <SkipNext color='inherit' />
                </IconButton>
            </Box>

            <Divider />

            <Grid padding={2} width='100%' container spacing={"5px"} columns={10} maxHeight={"240px"} overflow={"auto"}>
                {item?.images.map((image, index) => {
                    return (
                        <Grid size={2} key={index}>
                            <Box
                                sx={{
                                    cursor: "pointer",
                                    position: "relative",
                                    width: "100%",
                                    height: "104px",
                                    overflow: "hidden",
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    border: "3px solid",
                                    borderColor: imageSelected === image ? "red" : "transparent"
                                }}
                                onClick={() => setImageSelected(image)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Dialog>
    );
};
