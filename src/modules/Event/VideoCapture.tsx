import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, ButtonGroup } from "@components/Button";
import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import { DeleteOutline, DescriptionOutlined, FilterList, PhotoCameraBackOutlined, Search } from "@mui/icons-material";
import { Box, IconButton, Link, TextField, Tooltip, Typography } from "@mui/material";
import eventService from "@services/event";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { EventDialog, useEventDialog } from "./EventDialog";
import { EventNavigation } from "./EventNavigation";
import { GridEvent } from "./GridEvent";
import { SnapshotDialog, useSnapshotDialogDialog } from "./SnapshotDialog";

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

    //Delete list
    const [deleteIds, setDeleteIds] = useState([]);

    // Filter
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        filters: ""
    });

    const fetchDataList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);
        try {
            const listRes = await eventService.getEventList(params);

            if (!listRes.err) {
                setDataList(listRes.data.events);
                setTotal(listRes.data.paging.totalItems);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        // Fetch data
        fetchDataList(filter);
    }, [filter, fetchDataList]);

    const handleDeleteItems = async (ids: string[]) => {
        if (!confirm("Are you sure you want to delete the selected: " + ids.join(", "))) {
            return;
        }

        setIsFetching(true);
        try {
            await eventService.deleteEvents({
                ids: ids
            });
            fetchDataList(filter);
            setDeleteIds([]);
        } catch (error) {
            console.log("🚀 ~ handleDeleteItems ~ error:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearch = useCallback(() => {
        setFilter((pre) => {
            return { ...pre, page: 1, filters: "" };
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
                title: tEvent("AI code"),
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

    const filterDataList = useCallback((list: any[], listSelected: string[]) => {
        return list.filter((item) => listSelected.includes(item._id));
    }, []);

    return (
        <MainLayout title={t("title")}>
            <Box display='flex' justifyContent='space-between'>
                <Breadcrumbs /> <EventNavigation />
            </Box>
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
                        onClick={() => handleDeleteItems(deleteIds)}
                    >
                        {tCommon("Delete")}
                    </Button>
                </Box>

                <GridEvent
                    data={dataList}
                    itemSize={viewSize}
                    rowSelection={{
                        keyName: "_id",
                        selectedRowKeys: [],
                        onChange: (selectedRowKeys) => {
                            setDeleteIds(selectedRowKeys);
                        }
                    }}
                    onRow={(record, rowIndex) => ({
                        onClick: () => {
                            console.log("🚀 ~ onClick - record:", record);
                        },
                        onDoubleClick: () => {
                            console.log("🚀 ~ onDoubleClick - record:", record);
                            showSnapshot(record as any);
                        }
                    })}
                />

                <Table
                    border
                    isLoading={isFetching}
                    columns={columns}
                    data={filterDataList(dataList, deleteIds)}
                    // rowSelection={{
                    //     keyName: "_id",
                    //     selectedRowKeys: [],
                    //     onChange: (selectedRowKeys) => {
                    //         setDeleteIds(selectedRowKeys);
                    //     }
                    // }}
                />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center'>
                <Button
                    disabled={isFetching || deleteIds.length === 0}
                    height='40px'
                    startIcon={DeleteOutline}
                    onClick={() => handleDeleteItems(deleteIds)}
                >
                    {tCommon("Delete")}
                </Button>
                <Box flex={1}>
                    ({deleteIds.length}) {tCommon("selected")}
                </Box>
                {Math.ceil(total / 10) > 1 && (
                    <Pagination
                        count={Math.ceil(total / 10)}
                        page={filter.page}
                        onChange={(e, page) =>
                            setFilter((pre) => {
                                return { ...pre, page };
                            })
                        }
                        sx={{
                            marginLeft: "auto",
                            flex: 1
                        }}
                    />
                )}
            </Box>
            <UserInfoDialog />

            <EventDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <SnapshotDialog />
        </MainLayout>
    );
};
