import React from "react";

import { Alert, Snackbar } from "@mui/material";
import { useToastStore } from "@store/toastStore";

export const Toast = () => {
    const { open, finishToast, settings } = useToastStore();

    return (
        <Snackbar
            open={open}
            autoHideDuration={settings.duration}
            onClose={finishToast}
            anchorOrigin={settings.anchorOrigin}
        >
            <Alert
                onClose={finishToast}
                severity={settings.severity}
                sx={{ width: "100%" }}
                icon={settings.icon || null}
            >
                {settings.title}
                <br />
                {settings.description}
            </Alert>
        </Snackbar>
    );
};
