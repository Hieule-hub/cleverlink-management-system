import React, { useEffect, useState } from "react";

import {
    Checkbox,
    TableBody,
    TableContainer,
    TableHead,
    Table as TableMui,
    TableRow,
    TableSortLabel,
    styled
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import { Empty } from "../Empty";
import { Spinner } from "../Spiner";

export interface Column<T = any> {
    key: string;
    dataIndex?: string;
    title?: React.ReactNode;
    width?: number;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (value: number) => string;
    render?: (value: T, row?: any, index?: number) => React.ReactNode;
    colSpan?: number;
    sorter?: boolean;
}

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:last-child td": {
        borderBottom: "none"
    }
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // fontSize: "16px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        padding: "12px 6px",
        background: "#FCFCFC"
    },
    [`&.${tableCellClasses.body}`]: {
        // fontSize: "16px",
        fontWeight: 500,
        padding: "6px 6px"
    }
}));

const StyledCheckbox = styled(Checkbox)``;

interface DataType {
    [key: string]: any;
}

interface TableProps {
    maxHeight?: number | string;
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
        index: number
    ) => {
        onClick?: () => void;
        onDoubleClick?: () => void;
        onContextMenu?: () => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
    };
    onRequestSort?: (property: string) => void;
    orderBy?: string;
    order?: string;
}

const EnhancedTableHead = (props) => {
    const { columns, rowSelection, handleSelectAllClick, orderBy, order, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(property);
    };

    return (
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
                        {column.sorter ? (
                            <TableSortLabel
                                active={orderBy === column.key}
                                direction={orderBy === column.key ? order : "asc"}
                                onClick={createSortHandler(column.key)}
                            >
                                {column.title}
                            </TableSortLabel>
                        ) : (
                            column.title
                        )}
                    </StyledTableCell>
                ))}
            </StyledTableRow>
        </TableHead>
    );
};

export const Table = ({
    columns,
    data,
    isLoading = false,
    rowSelection,
    border,
    maxHeight = "auto",
    orderBy,
    order = "asc",
    onRequestSort = () => {}
}: TableProps) => {
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

    // const onRequestSort = (property) => {
    //     console.log("🚀 ~ onRequestSort ~ property:", property);
    //     const isAsc = orderBy === property && order === "asc";
    //     setOrder(isAsc ? "desc" : "asc");
    //     setOrderBy(property);
    // };

    return (
        <TableContainer
            sx={{
                border: border ? "1px solid #e0e0e0" : "none",
                borderRadius: "12px",
                position: "relative",
                maxHeight: maxHeight || "auto"
            }}
        >
            {isLoading && (
                <div className='loading-view'>
                    <Spinner />
                </div>
            )}
            <TableMui stickyHeader={maxHeight !== "auto"}>
                <EnhancedTableHead
                    columns={columns}
                    rowSelection={rowSelection}
                    handleSelectAllClick={handleSelectAllClick}
                    onRequestSort={onRequestSort}
                    orderBy={orderBy}
                    order={order}
                />
                {/* <TableHead>
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
                </TableHead> */}
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
                                    const value = item[column.dataIndex];

                                    if (column.render) {
                                        return (
                                            <StyledTableCell
                                                key={column.key}
                                                align={column.align}
                                                colSpan={column.colSpan || 1}
                                            >
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
                            <StyledTableCell
                                colSpan={columns.length + 1}
                                align='center'
                                style={{
                                    height: 200
                                }}
                            >
                                <Empty />
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </TableMui>
        </TableContainer>
    );
};
