import React from "react";

import { TableBody, TableContainer, TableHead, Table as TableMui, TableRow, styled } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

interface Column {
    key: string;
    title?: React.ReactNode;
    width?: number;
    minWidth?: number;
    align?: "right" | "left" | "center";
    format?: (value: number) => string;
    render?: (value: any, row?: any, index?: number) => React.ReactNode;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: "0.8rem",
        // backgroundColor: "#F7F7F7",
        whiteSpace: "nowrap",
        padding: "0.5rem 0.5rem"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "0.75rem",
        // color: colors.secondary,
        padding: "0.5rem 0.5rem"
    }
}));

interface DataType {
    [key: string]: any;
}

interface TableProps {
    columns: Column[];
    data: DataType[];
}

export const Table = ({ columns, data }: TableProps) => {
    if (columns.length === 0) {
        return "";
    }

    return (
        <TableContainer>
            <TableMui stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <StyledTableCell
                                key={column.key}
                                align={column.align}
                                style={{ minWidth: column.minWidth, width: column.width }}
                            >
                                {column.title}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
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
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <StyledTableCell colSpan={columns.length} align='center' />
                        </TableRow>
                    )}
                </TableBody>
            </TableMui>
        </TableContainer>
    );
};
