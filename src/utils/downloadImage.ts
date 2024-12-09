export const downloadImage = (imageSrc: string, fileName?: string) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
