import axios from "axios";

export const uploadFile = async (url: string, file: File) => {
    return axios.put(url, file, {
        headers: {
            "Content-Type": file.type
        }
    });
};
