import React from "react";

import { type CamFile, isCamFile } from "@interfaces/device";
import { Cancel, Download, TextSnippet } from "@mui/icons-material";
import { IconButton, Tooltip, Typography, styled } from "@mui/material";

const StyledFileInfo = styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: var(--shape-borderRadius);
    cursor: pointer;
    gap: 6px;
    border: 1px solid;
    border-color: var(--palette-grey-400);
    transition: border-color 0.3s ease;
    max-width: 300px;

    &:hover {
        border-color: var(--palette-primary-light);
    }

    .file-image {
        overflow: hidden;
        flex-shrink: 0;

        img {
            width: 50px;
            height: 50px;
            object-fit: cover;
        }
    }
`;

interface FileInfoProps {
    file: File | CamFile;
    onDelete?: () => void;
    onDownload?: () => void;
}
export const FileInfo = ({ file, onDelete, onDownload }: FileInfoProps) => {
    let url = "";
    let fileName = "";
    let fileType = "";

    if (file instanceof File) {
        url = URL.createObjectURL(file);
        fileName = file.name;

        if (file.type.includes("image")) {
            fileType = "image";
        }
    } else if (isCamFile(file)) {
        url = file.url;
        fileName = file.name || file.key;

        if (file.url.includes("png") || file.url.includes("jpg") || file.url.includes("jpeg")) {
            fileType = "image";
        }
    }

    return (
        <StyledFileInfo>
            <div className='file-image'>
                {fileType === "image" ? (
                    <img
                        src={url}
                        alt={fileName}
                        onError={(e) => {
                            e.currentTarget.src = "/assets/images/noImage.jpg";
                        }}
                    />
                ) : (
                    <TextSnippet
                        color='primary'
                        sx={{
                            fontSize: 50
                        }}
                    />
                )}
            </div>

            <Tooltip title={fileName}>
                <Typography variant='body1' noWrap>
                    {fileName}
                </Typography>
            </Tooltip>

            {onDownload && (
                <IconButton onClick={onDownload} size='small'>
                    <Download fontSize='small' />
                </IconButton>
            )}

            {onDelete && (
                <IconButton onClick={onDelete} size='small'>
                    <Cancel fontSize='small' />
                </IconButton>
            )}
        </StyledFileInfo>
    );
};
