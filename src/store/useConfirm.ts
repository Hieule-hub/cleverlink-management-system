import { create } from "zustand";

import { ButtonProps } from "@/components/Button";

export interface ConfirmSettings {
    onConfirm?: () => void;
    onFinishConfirm?: () => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmDescription?: string;
    icon?: React.ReactNode;
    color?: ButtonProps["color"];
}

type State = {
    open: boolean;
    confirmSettings?: ConfirmSettings;
};

type Actions = {
    startConfirm: (setting?: ConfirmSettings) => void;
    finishConfirm: () => void;
};

export const useConfirm = create<State & Actions>()((set) => ({
    open: false,
    startConfirm: (settings = {}) => set((state) => ({ open: true, confirmSettings: settings })),
    finishConfirm: () => {
        set((state) => ({ open: false }));

        setTimeout(() => {
            set((state) => ({ confirmSettings: {} }));
        }, 300);
    }
}));
