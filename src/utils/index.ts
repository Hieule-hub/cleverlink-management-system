import { useToastStore } from "@store/toastStore";

export const getPublicImageUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_URL}/${path}`;
};

export const triggerToastDev = () => {
    const showToast = useToastStore.getState().startToast;
    showToast({
        title: "This feature is under development.",
        anchorOrigin: { vertical: "bottom", horizontal: "center" }
    });
};

export const cloneObject = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
};

export const generateUID = () => {
    // Create a UID with 16 hexadecimal characters divided into 4 groups of 4
    let uid = "";
    for (let i = 0; i < 4; i++) {
        if (i > 0) uid += "-";
        uid += Math.random().toString(16).substr(2, 4);
    }
    return uid;
};
