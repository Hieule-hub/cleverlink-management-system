import { create } from "zustand";

type DialogState<T> = {
    open: boolean;
    item: T | null;
};

type DialogActions<T> = {
    openDialog: (item?: T) => void;
    closeDialog: () => void;
    setItem: (item: Partial<T>) => void;
};

type DialogStore<T> = DialogState<T> & DialogActions<T>;

export const dialogStore = <T>() => {
    const defaultState: DialogState<T> = {
        open: false,
        item: null
    };

    return create<DialogStore<T>>()((set) => ({
        ...defaultState,
        openDialog: (item) => set({ open: true, item }),
        closeDialog: () => set({ open: false, item: null }),
        setItem: (item) =>
            set((state) => ({
                item: item ? { ...state.item, ...item } : (item as T)
            }))
    }));
};
