import React, { useEffect, useState } from "react";

import { Checkbox, TableBody, TableContainer, TableHead, Table as TableMui, TableRow, styled } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

export interface Column<T = any> {
    key: string;
    dataIndex?: string;
    title?: React.ReactNode;
    width?: number;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (value: number) => string;
    render?: (value: T, row?: any, index?: number) => React.ReactNode;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td": {
        borderBottom: "none"
    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // fontSize: "16px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        padding: "18px 16px"
    },
    [`&.${tableCellClasses.body}`]: {
        // fontSize: "16px",
        fontWeight: 500,
        padding: "18px 16px"
    }
}));

const StyledCheckbox = styled(Checkbox)``;

interface DataType {
    [key: string]: any;
}

interface TableProps {
    columns: Column[];
    data: DataType[];
    isLoading?: boolean;
    border?: boolean;
    rowSelection?: {
        onChange?: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => void;
        selectedRowKeys?: React.Key[];
        keyName: string;
    };
    onRow?: (
        record: DataType,
        index: number
    ) => {
        onClick?: () => void;
        onDoubleClick?: () => void;
        onContextMenu?: () => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    };
    onHeaderRow?: (
        columns: Column[],
        index
    ) => {
        onClick?: () => void;
        onDoubleClick?: () => void;
        onContextMenu?: () => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    };
}

export const Table = ({ columns, data, isLoading = false, rowSelection, border }: TableProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
        console.warn("Table component: rowSelection.keyName is required");
    }

    if (columns.length === 0) {
        return "";
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n[rowSelection.keyName]);
            setSelectedRowKeys(newSelected);
            return;
        }
        setSelectedRowKeys([]);
    };

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

    return (
        <TableContainer
            sx={{
                border: border ? "1px solid #e0e0e0" : "none",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                ".loading-view": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 255, 255, 0.5)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }
            }}
        >
            {isLoading && <div className='loading-view' />}
            <TableMui stickyHeader>
                <TableHead>
                    <StyledTableRow>
                        {rowSelection && (
                            <StyledTableCell key='selection-column-header' align='center' style={{ width: 50 }}>
                                <StyledCheckbox size='small' onChange={handleSelectAllClick} />
                            </StyledTableCell>
                        )}
                        {columns.map((column) => (
                            <StyledTableCell
                                key={column.key}
                                align={column.align}
                                style={{ minWidth: column.minWidth, width: column.width }}
                            >
                                {column.title}
                            </StyledTableCell>
                        ))}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => {
                        return (
                            <StyledTableRow key={index}>
                                {rowSelection && (
                                    <StyledTableCell key={index + "selection-column"} align='center'>
                                        <StyledCheckbox
                                            size='small'
                                            checked={selectedRowKeys.includes(item[rowSelection.keyName]) || false}
                                            onChange={(e) => handleSelectClick(e, item[rowSelection.keyName])}
                                        />
                                    </StyledTableCell>
                                )}
                                {columns.map((column) => {
                                    const value = item[column.key];

                                    if (column.render) {
                                        return (
                                            <StyledTableCell key={column.key} align={column.align}>
                                                {column.render(value, item, index)}
                                            </StyledTableCell>
                                        );
                                    }

                                    return (
                                        <StyledTableCell key={column.key} align={column.align}>
                                            {value}
                                        </StyledTableCell>
                                    );
                                })}
                            </StyledTableRow>
                        );
                    })}
                    {data.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={columns.length} align='center' />
                        </StyledTableRow>
                    )}
                </TableBody>
            </TableMui>
        </TableContainer>
    );
};
