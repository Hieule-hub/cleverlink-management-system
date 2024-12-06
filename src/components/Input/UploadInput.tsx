import React, { useState } from "react";

import { Backup } from "@mui/icons-material";
import { Box, Chip, Stack, styled } from "@mui/material";

const StyledUploadInput = styled(Box)`
    transition: background-color 0.3s;
    height: 200px;
    border: 2px dashed;
    border-radius: 20px;
    border-width: 3px;
    cursor: pointer;

    .title {
        font-size: 20px;
        font-weight: 500;
    }

    label {
        color: var(--palette-primary-main);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
`;

interface UploadInputProps {
    placeholder?: string;
    acceptType?: string[];
}

export const UploadInput = ({
    placeholder = "Please drag and drop files here.",
    acceptType = ["DPF", "JPG", "PNG"]
}: UploadInputProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            setFile(files[0]); // Lấy file đầu tiên
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setFile(event.target.files[0]);
        }
    };

    return (
        <StyledUploadInput
            sx={{
                borderColor: dragging ? "primary.main" : "grey.400",
                backgroundColor: dragging ? "action.hover" : "background.paper"
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input type='file' hidden id='upload-input' onChange={handleFileChange} />
            <label htmlFor='upload-input'>
                <Backup
                    color='inherit'
                    sx={{
                        fontSize: 70
                    }}
                />
                <p className='title'>{placeholder}</p>

                <Stack direction='row' spacing={1} marginTop={2}>
                    {acceptType.map((type) => (
                        <Chip key={type} label={type} color='primary' />
                    ))}
                </Stack>
            </label>
        </StyledUploadInput>
    );
};
