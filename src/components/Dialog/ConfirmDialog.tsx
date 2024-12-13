import { ErrorOutline } from "@mui/icons-material";
import { Box, Typography, Zoom } from "@mui/material";
import { ConfirmSettings, useConfirm } from "@store/useConfirm";
import { useTranslations } from "next-intl";

import { Button } from "../Button";
import { Dialog } from "./Dialog";

export const ConfirmDialog: React.FC<ConfirmSettings> = (props) => {
    const { open, finishConfirm, confirmSettings } = useConfirm();
    const t = useTranslations("Common");

    const {
        onConfirm = () => {},
        onFinishConfirm = () => {},
        title = "",
        description = "",
        confirmText = "",
        cancelText = "",
        color = "primary",
        confirmDescription = "",
        icon = <ErrorOutline color='error' />,
        ...otherProps
    } = { ...confirmSettings, ...props };

    const handleConfirm = () => {
        onConfirm();
        finishConfirm();
    };

    const handleFinishConfirm = () => {
        onFinishConfirm();
        finishConfirm();
    };

    return (
        <Dialog
            sx={{
                ".MuiDialog-paper": {
                    width: "100%",
                    maxWidth: "25rem",
                    borderRadius: "0.5rem"
                }
            }}
            open={open}
            TransitionComponent={Zoom}
            onClose={handleFinishConfirm}
            title={
                <Box display='flex' alignItems='center' gap={1}>
                    {icon}
                    <Typography fontWeight='inherit'>{title}</Typography>
                </Box>
            }
            showFooter={false}
            {...otherProps}
        >
            <Box padding={2} paddingBottom={0}>
                {description}
                <Typography>{confirmDescription || t("Confirm description")}</Typography>
            </Box>
            <Box margin={2} display='flex' justifyContent='flex-end' gap='12px' mt={2}>
                <Button onClick={handleFinishConfirm}>{cancelText || t("Cancel")}</Button>
                <Button onClick={handleConfirm} color={color}>
                    {confirmText || t("Save")}
                </Button>
            </Box>
        </Dialog>
    );
};
