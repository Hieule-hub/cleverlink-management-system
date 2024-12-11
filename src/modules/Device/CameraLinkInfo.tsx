import { Dialog } from "@components/Dialog";
import { Device } from "@interfaces/device";
import { Grid2 as Grid, Zoom } from "@mui/material";
import { dialogStore } from "@store/dialogStore";
import { useTranslations } from "next-intl";

import { ChannelInfo } from "./ChannelInfo";

export const useCameraLinkDialog = dialogStore<Device>();

interface CameraLinkInfoProps {
    onClose?: (status?: string) => void;
}

export const CameraLinkInfo = ({ onClose = () => "" }: CameraLinkInfoProps) => {
    const t = useTranslations();
    const { item, open, closeDialog } = useCameraLinkDialog();

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
    };

    return (
        <Dialog
            aria-describedby='camera-link-info-dialog-description'
            aria-labelledby='camera-link-info-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "1080px",
                    height: "auto"
                }
            }}
            open={open}
            title={t("DevicePage.Connected camera information")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleClose}
        >
            <Grid container columns={12}>
                {Array.from({ length: 9 }).map((_, index) => {
                    let channel;

                    try {
                        if (item?.activate && item.activate?.channels[index]) {
                            channel = { ...item?.activate?.channels[index] };
                        }
                    } catch (error) {}

                    const channelId = index + 1;
                    return (
                        <Grid
                            size={4}
                            key={index}
                            sx={{
                                borderRight: (index + 1) % 3 !== 0 ? "1px solid #ccc" : "none",
                                borderBottom: index < 6 ? "1px solid #ccc" : "none",
                                padding: 2
                            }}
                        >
                            <ChannelInfo channel={channel} channelId={channelId} width={"100%"} />
                        </Grid>
                    );
                })}
            </Grid>
        </Dialog>
    );
};
