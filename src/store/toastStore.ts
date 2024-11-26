import { SnackbarOrigin } from "@mui/material/Snackbar/Snackbar";
import { create } from "zustand";

export interface ToastSettings {
    title: string;
    description: string;
    icon: React.ReactNode;
    duration: number;
    anchorOrigin: SnackbarOrigin;
    severity: "success" | "info" | "warning" | "error";
}

const defaultSettings: ToastSettings = {
    title: "",
    description: "",
    icon: null,
    duration: 3000,
    anchorOrigin: { vertical: "top", horizontal: "right" },
    severity: "info"
};

type State = {
    open: boolean;
    settings: ToastSettings;
};

type Actions = {
    startToast: (settings?: Partial<ToastSettings>) => void;
    finishToast: () => void;
};

export const useToastStore = create<State & Actions>()((set) => ({
    open: false,
    settings: defaultSettings,

    startToast: (settings = {}) => {
        set(() => ({
            open: true,
            settings: {
                ...defaultSettings,
                ...settings
            }
        }));
    },
    finishToast: () => {
        set(() => ({ open: false }));

        setTimeout(() => {
            set(() => ({ settings: defaultSettings }));
        }, 300);
    }
}));

export const triggerToast = (settings?: Partial<ToastSettings>) => {
    const showToast = useToastStore.getState().startToast;
    showToast(settings);
};

export const toast = {
    success: (settings: Partial<ToastSettings>) => triggerToast({ ...settings, severity: "success" }),
    info: (settings: Partial<ToastSettings>) => triggerToast({ ...settings, severity: "info" }),
    warning: (settings: Partial<ToastSettings>) => triggerToast({ ...settings, severity: "warning" }),
    error: (settings: Partial<ToastSettings>) => triggerToast({ ...settings, severity: "error" })
};
