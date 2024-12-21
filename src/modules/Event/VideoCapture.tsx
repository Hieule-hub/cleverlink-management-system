import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button, ButtonGroup } from "@components/Button";
import { Paper } from "@components/Paper";
import { type Column, StyledTableCell, StyledTableRow } from "@components/Table";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import { DeleteOutline, DescriptionOutlined, FilterList } from "@mui/icons-material";
import { Box, IconButton, Link, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import eventService from "@services/event";
import { useConfirm } from "@store/useConfirm";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { EventDialog, useEventDialog } from "./EventDialog";
import { GridEvent } from "./GridEvent";
import { SnapshotDialog, useSnapshotDialogDialog } from "./SnapshotDialog";

const PAGE_SIZE = 48;

export const VideoCapturePage = () => {
    const t = useTranslations("VideoCapturePage");
    const tEvent = useTranslations("EventPage");

    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [viewSize, setViewSize] = useState("small");

    //Store controller
    const { openDialog } = useEventDialog();
    const { openDialog: showUserInfo } = useUserInfoDialog();
    const { openDialog: showSnapshot } = useSnapshotDialogDialog();
    const { startConfirm } = useConfirm();

    //Delete list
    const [deleteIds, setDeleteIds] = useState([]);

    // Filter
    // const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [filter, setFilter] = useState({
        page: 1,
        limit: PAGE_SIZE,
        filters: "",
        expand: false
    });

    const fetchDataList = useCallback(async () => {
        setIsFetching(true);

        setTimeout(async () => {
            try {
                const listRes = await eventService.getEventList(filter);

                if (!listRes.err) {
                    if (filter.expand) {
                        setDataList((pre) => {
                            return [...pre, ...listRes.data.events];
                        });
                    } else {
                        setDataList(listRes.data.events);
                    }
                    // setTotal(listRes.data.paging.totalItems);
                    setTotalPage(listRes.data.paging.totalPages);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        }, 1000);
    }, [filter]);

    useEffect(() => {
        // Fetch data
        fetchDataList();
    }, [fetchDataList]);

    const handleDeleteItems = async (ids: string[]) => {
        setIsFetching(true);

        try {
            await eventService.deleteEvents({
                ids: ids
            });

            handleSearch();
            setDeleteIds([]);
        } catch (error) {
            console.log("🚀 ~ handleDeleteItems ~ error:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const startDeleteItems = (ids: string[]) => {
        startConfirm({
            onConfirm: () => {
                handleDeleteItems(ids);
            }
        });
    };

    const handleSearch = useCallback(() => {
        setFilter((pre) => {
            return { ...pre, page: 1, filters: "", expand: false };
        });
    }, []);

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "time",
                title: tEvent("Event time"),
                dataIndex: "time",
                width: 200,
                render: (value) => dayjs(value).format("YYYY.MM.DD HH:mm:ss")
            },
            {
                key: "emplacement",
                title: tEvent("Emplacement"),
                dataIndex: "device",
                width: 200,
                render: (value) => value?.place
            },
            {
                key: "aiCode",
                title: tEvent("AI Code"),
                dataIndex: "aiCode",
                width: 200,
                render: (value) => value?.place
            },

            // {
            //     key: "deviceId",
            //     title: tEvent("Device ID"),
            //     dataIndex: "activate",
            //     width: 200,
            //     render: (value) => value?.boxId
            // },
            // {
            //     key: "warningDevice",
            //     title: tEvent("Warning device"),
            //     dataIndex: "warningDevice",
            //     width: 200,
            //     render: (value) => value
            // },
            // {
            //     key: "receiver",
            //     title: tEvent("Receiver"),
            //     dataIndex: "receiver",
            //     align: "center",
            //     width: 200,
            //     render: (value) => {
            //         const title = (value || []).join(", ");
            //         return (
            //             <Tooltip title={title}>
            //                 <Typography width={"200px"} noWrap>
            //                     {title}
            //                 </Typography>
            //             </Tooltip>
            //         );
            //     }
            // },
            {
                key: "user",
                title: tEvent("Manager"),
                dataIndex: "user",
                align: "center",
                width: 200,
                render: (value) => {
                    return (
                        <Link
                            component='button'
                            variant='body2'
                            fontWeight={500}
                            onClick={() => {
                                showUserInfo(value);
                            }}
                        >
                            {value?.name}
                        </Link>
                    );
                }
            },
            {
                title: tCommon("Detail"),
                key: "action",
                align: "right",
                render: (_, record) => (
                    <Box display='flex' justifyContent='end' gap={2}>
                        <IconButton
                            size='small'
                            color='info'
                            onClick={() => {
                                openDialog(record);
                            }}
                        >
                            <DescriptionOutlined fontSize='inherit' />
                        </IconButton>
                    </Box>
                )
            }
        ];
    }, []);

    const showDataList = useMemo(() => {
        return dataList.filter((item) => deleteIds.includes(item._id));
    }, [dataList, deleteIds]);

    const handleLoadMore = useCallback(() => {
        setFilter((pre) => {
            if (!isFetching && totalPage > filter.page) {
                return { ...pre, page: pre.page + 1, expand: true };
            }
            return pre;
        });
    }, [isFetching, totalPage, filter]);

    return (
        <React.Fragment>
            <Paper title={t("title")}>
                <Box display='flex' alignItems='center' gap='12px' marginBottom={"12px"}>
                    <ButtonGroup
                        value={viewSize}
                        onSelected={(value) => {
                            setViewSize(value);
                        }}
                        options={[
                            {
                                label: tCommon("Small"),
                                value: "small"
                            },
                            {
                                label: tCommon("Large"),
                                value: "large"
                            }
                        ]}
                    />
                    <Typography
                        sx={{
                            flexGrow: 1
                        }}
                        variant='body1'
                        color='primary'
                    >
                        {t("Note view size")}
                    </Typography>
                    <Button
                        disabled={isFetching || deleteIds.length === 0}
                        startIcon={DeleteOutline}
                        onClick={() => startDeleteItems(deleteIds)}
                    >
                        {tCommon("Delete")}
                    </Button>
                </Box>

                <GridEvent
                    loading={isFetching}
                    data={dataList}
                    itemSize={viewSize}
                    rowSelection={{
                        keyName: "_id",
                        selectedRowKeys: deleteIds,
                        onChange: (selectedRowKeys) => {
                            // setDeleteIds(selectedRowKeys);
                        }
                    }}
                    onRow={(record, rowIndex) => ({
                        onClick: () => {
                            setDeleteIds((pre) => {
                                if (pre.includes(record._id)) {
                                    return pre.filter((item) => item !== record._id);
                                }
                                return [...pre, record._id];
                            });
                        },
                        onDoubleClick: () => {
                            showSnapshot(record as any);
                        }
                    })}
                    onLoadMore={handleLoadMore}
                />

                <TableContainer
                    sx={{
                        border: "1px solid #e0e0e0",
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
                    {isFetching && <div className='loading-view' />}
                    <Table stickyHeader>
                        <TableHead>
                            <StyledTableRow>
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
                            {showDataList.length > 1 && (
                                <StyledTableRow>
                                    <StyledTableCell
                                        colSpan={columns.length}
                                        align='center'
                                        sx={{
                                            color: "primary.main"
                                        }}
                                    >
                                        {showDataList.length} {tCommon("selected")}
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                            {showDataList.length === 1 &&
                                showDataList.map((item, index) => {
                                    return (
                                        <StyledTableRow key={index}>
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
                            {showDataList.length === 0 && (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={columns.length} align='center'>
                                        -
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <UserInfoDialog />

            <EventDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <SnapshotDialog />
        </React.Fragment>
    );
};
