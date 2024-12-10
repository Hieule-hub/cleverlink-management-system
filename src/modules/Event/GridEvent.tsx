import React, { useCallback, useEffect, useState } from "react";

import { Checkbox, Grid2 as Grid, styled } from "@mui/material";

const EventBox = styled("div")`
    border-radius: var(--shape-borderRadius);
    border: 1px solid var(--input-border-color);
    padding: 8px;
    aspect-ratio: 163/114;
    background-image: url(${(props) => props.style.backgroundImage});
    background-size: cover;
    background-position: center;
    transition: border 0.3s ease;
    display: flex;

    &.active {
        border: 2px solid var(--palette-primary-main);
    }
`;

interface DataType {
    [key: string]: any;
}

interface GridEventProps {
    data: DataType[];
    itemSize?: string;
    columns?: number;
    rowSelection?: {
        onChange?: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => void;
        selectedRowKeys?: React.Key[];
        keyName: string;
    };
    onRow?: (
        record: DataType,
        index: number
    ) => {
        onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
        onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    };
}

export const GridEvent = ({ data, columns = 16, itemSize = "small", rowSelection, onRow }: GridEventProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    console.log("🚀 ~ selectedRowKeys:", selectedRowKeys);

    useEffect(() => {
        setSelectedRowKeys(rowSelection?.selectedRowKeys || []);
    }, [data]);

    useEffect(() => {
        if (rowSelection?.onChange) {
            rowSelection.onChange(
                selectedRowKeys,
                data.filter((item) => selectedRowKeys.includes(item[rowSelection.keyName]))
            );
        }
    }, [selectedRowKeys]);

    if (rowSelection && !rowSelection.keyName) {
        console.warn("GridEvent component: rowSelection.keyName is required");
    }

    const handleSelectClick = (event: React.ChangeEvent<HTMLInputElement>, key: React.Key) => {
        const selectedIndex = selectedRowKeys.indexOf(key);
        let newSelected: React.Key[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRowKeys, key);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRowKeys.slice(1));
        } else if (selectedIndex === selectedRowKeys.length - 1) {
            newSelected = newSelected.concat(selectedRowKeys.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRowKeys.slice(0, selectedIndex),
                selectedRowKeys.slice(selectedIndex + 1)
            );
        }

        setSelectedRowKeys(newSelected);
    };

    let clickCount = 0;

    const handlePointer = useCallback(
        (item, index, e) => {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 1) {
                    if (onRow && onRow(item, index).onClick) {
                        onRow(item, index).onClick(e);
                    }
                } else if (clickCount === 2) {
                    if (onRow && onRow(item, index).onDoubleClick) {
                        onRow(item, index).onDoubleClick(e);
                    }
                }
                clickCount = 0;
            }, 300);
        },
        [onRow]
    );

    return (
        <Grid
            maxHeight={"590px"}
            overflow={"auto"}
            container
            columns={columns}
            width={"100%"}
            spacing={"4px"}
            marginBottom={2}
        >
            {data.map((item, index) => {
                // const randomIndex = Math.floor(Math.random() * item?.images.length);
                const image =
                    item?.images[0] ||
                    "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg";

                return (
                    <Grid key={index} size={itemSize === "small" ? 2 : 8}>
                        <EventBox
                            onPointerDown={(e) => handlePointer(item, index, e)}
                            className={selectedRowKeys.includes(item[rowSelection.keyName]) ? "active" : ""}
                            style={{
                                cursor: onRow ? "pointer" : "default",
                                backgroundImage: `url(${image})`,
                                alignItems: itemSize === "small" ? "center" : "start"
                            }}
                        >
                            <Checkbox
                                onClick={(e) => e.stopPropagation()}
                                size='small'
                                className='checkbox'
                                checked={selectedRowKeys.includes(item[rowSelection.keyName]) || false}
                                onChange={(e) => handleSelectClick(e, item[rowSelection.keyName])}
                            />
                        </EventBox>
                    </Grid>
                );
            })}
        </Grid>
    );
};
