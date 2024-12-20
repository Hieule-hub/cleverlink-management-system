import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { Spinner } from "@components/Spiner";
import { Check } from "@mui/icons-material";
import { Checkbox, Grid2 as Grid, styled } from "@mui/material";
import { debounce } from "@mui/material/utils";

const EventBox = styled("div")`
    border-radius: var(--shape-borderRadius);
    border: 1px solid var(--input-border-color);
    padding: 8px;
    aspect-ratio: 163/114;
    background-image: url(${(props) => props.style.backgroundImage});
    background-size: cover;
    background-position: center;
    transition: border 0.3s ease;
    border: 2px solid var(--input-border-color);

    &.active {
        border: 2px solid var(--palette-primary-main);
    }

    .check-icon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            width: 100%;
            height: 100%;
            border: 1px solid var(--input-border-color);
            background-color: white;
            border-radius: 4px;
        }

        .checked-icon {
            width: 100%;
            height: 100%;
            background-color: #0072ff;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
    }
`;

interface DataType {
    [key: string]: any;
}

interface GridEventProps {
    data: DataType[];
    itemSize?: string;
    loading?: boolean;
    columns?: number;
    rowSelection?: {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => void;
        selectedRowKeys: React.Key[];
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
    onLoadMore?: () => void;
}

export const GridEvent = ({
    data,
    columns = 16,
    loading,
    itemSize = "small",
    rowSelection,
    onRow,
    onLoadMore
}: GridEventProps) => {
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const clickCountRef = useRef(0);

    // useEffect(() => {
    //     setSelectedRowKeys(rowSelection?.selectedRowKeys || []);
    // }, [data]);

    const setSelectedRowKeys = useCallback(
        (selectedRowKeys) => {
            if (rowSelection) {
                rowSelection.onChange(
                    selectedRowKeys,
                    data.filter((item) => selectedRowKeys.includes(item[rowSelection.keyName]))
                );
            }
        },
        [data, rowSelection]
    );

    const selectedRowKeys = useMemo(() => rowSelection?.selectedRowKeys || [], [rowSelection]);

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

    const handlePointer = useCallback(
        (item, index, e) => {
            clickCountRef.current++;
            setTimeout(() => {
                if (clickCountRef.current === 1) {
                    onRow?.(item, index)?.onClick?.(e);
                } else if (clickCountRef.current === 2) {
                    onRow?.(item, index)?.onDoubleClick?.(e);
                }
                clickCountRef.current = 0;
            }, 200);
        },
        [onRow]
    );

    const handleScroll = useCallback(
        debounce(() => {
            if (!gridRef.current || !onLoadMore) return;
            if (loading) return;

            const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                console.log("load more...");

                onLoadMore(); // Call the loadMore function when scrolled to the bottom
            }
        }, 300),
        [loading, onLoadMore]
    );

    useEffect(() => {
        if (!gridRef.current) return;
        gridRef.current.addEventListener("scroll", handleScroll);
        return () => {
            if (!gridRef.current) return;
            gridRef.current.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <Grid
            component={"div"}
            ref={gridRef}
            maxHeight={"400px"}
            container
            columns={columns}
            spacing={1}
            sx={{
                width: "100%",
                overflow: "auto",
                marginBottom: 2
            }}
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
                                className='checkbox'
                                icon={
                                    <div className='check-icon'>
                                        <div className='icon' />
                                    </div>
                                }
                                checkedIcon={
                                    <div className='check-icon'>
                                        <div className='checked-icon'>
                                            <Check fontSize='inherit' />
                                        </div>
                                    </div>
                                }
                                checked={selectedRowKeys.includes(item[rowSelection.keyName]) || false}
                                onChange={(e) => handleSelectClick(e, item[rowSelection.keyName])}
                            />
                        </EventBox>
                    </Grid>
                );
            })}

            {loading && (
                <Grid
                    size={columns}
                    display='flex'
                    justifyContent='center'
                    alignContent={"center"}
                    marginY={1}
                    height={50}
                >
                    <Spinner />
                </Grid>
            )}
        </Grid>
    );
};
