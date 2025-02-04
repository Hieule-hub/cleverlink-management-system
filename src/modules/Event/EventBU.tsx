import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/Dialog";
import { Empty } from "@components/Empty";
import { EditIcon } from "@components/Icon";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { Slider } from "@components/Slider";
import { Spinner } from "@components/Spiner";
import { type Column, Table } from "@components/Table";
import { Event } from "@interfaces/event";
import { CastOutlined, DeleteOutline, MovieCreationOutlined, Search } from "@mui/icons-material";
import { Box, IconButton, Link, TextField, Tooltip, Typography } from "@mui/material";
import eventService from "@services/event";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import { useTranslations } from "next-intl";

import { DeviceDialog, useDeviceDialog } from "../Device/DeviceDialog";
import { EventCard } from "./EventCard";
import { EventDialog, useEventDialog } from "./EventDialog";
import { EventImage } from "./EventImage";
import { SnapshotDialog, useSnapshotDialogDialog } from "./SnapshotDialog";

export const EventBU = () => {
    const t = useTranslations("EventPage");
    const tCommon = useTranslations("Common");
    const tAiCode = useTranslations("AiCode");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller
    const { openDialog } = useEventDialog();
    const { openDialog: showDeviceInfo } = useDeviceDialog();
    const { openDialog: showSnapshot } = useSnapshotDialogDialog();
    const { startConfirm } = useConfirm();

    //Delete list
    const [deleteIds, setDeleteIds] = useState([]);

    // Filter
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        filters: "",
        sortField: "time",
        sortOrder: "desc"
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
        setIsFetching(true);

        try {
            await eventService.deleteEvents({
                ids: ids
            });

            fetchDataList(filter);
            setDeleteIds([]);

            toast.success({ title: t("Delete record success") });
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
            return { ...pre, page: 1, filters: keyword };
        });
    }, [keyword]);

    const handleRequestSort = (property: string) => {
        const isAsc = filter.sortField === property && filter.sortOrder === "asc";

        setFilter((pre) => {
            return { ...pre, sortField: property, sortOrder: isAsc ? "desc" : "asc" };
        });
    };

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "time",
                title: t("Event snapshot"),
                dataIndex: "time",
                width: 200,
                sorter: true,
                render: (_, record) => <EventImage item={record} />
            },
            {
                key: "aiCode",
                title: t("Occurrence"),
                dataIndex: "aiCode",
                width: 200,
                render: (value) => tAiCode(value)
            },
            {
                key: "device.place",
                title: t("Emplacement"),
                dataIndex: "device",
                width: 200,
                sorter: true,
                render: (value) => value?.place
            },
            {
                key: "notifyCode",
                title: t("Warning device"),
                dataIndex: "notifyCode",
                align: "center",
                width: 200,
                render: (value) => value
            },
            {
                key: "deviceId",
                title: t("Device ID"),
                dataIndex: "activate",
                width: 200,
                render: (value) => (
                    <Link
                        component='button'
                        variant='body2'
                        fontWeight={500}
                        onClick={() => {
                            showDeviceInfo(value, true);
                        }}
                    >
                        {value?.boxId}
                    </Link>
                )
            },
            {
                key: "connecting",
                title: t("Equipment access"),
                dataIndex: "activate",
                align: "center",
                width: 200,
                render: (value, item) => (
                    <Button
                        color='primary'
                        startIcon={CastOutlined}
                        height='34px'
                        onClick={() => {
                            //new tab with url to device
                            if (item) {
                                const port = item.activate?.port || 3000;
                                window.open(`http://${item.activate?.ip}:${port}`, "_blank");
                            }
                        }}
                    />
                )
            },
            {
                title: tCommon("Snapshot") + "/" + tCommon("Edit") + "/" + tCommon("Delete"),
                key: "action",
                align: "right",
                render: (_, record) => (
                    <Box display='flex' justifyContent='end' gap={2}>
                        <IconButton
                            size='small'
                            color='warning'
                            onClick={() => {
                                showSnapshot(record);
                            }}
                        >
                            <MovieCreationOutlined fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            size='small'
                            color='info'
                            onClick={() => {
                                openDialog(record);
                            }}
                        >
                            <EditIcon fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            size='small'
                            color='error'
                            onClick={() => {
                                startDeleteItems([record._id]);
                            }}
                        >
                            <DeleteOutline fontSize='inherit' />
                        </IconButton>
                    </Box>
                )
            }
        ];
    }, []);

    return (
        <React.Fragment>
            <Box display='flex' alignItems='center' gap='12px' marginRight={"56px"}>
                <Typography
                    sx={{
                        marginLeft: "auto"
                    }}
                    variant='body1'
                    color='info'
                >
                    {t("Event note")}
                </Typography>
            </Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "316px",
                    marginTop: "16px",
                    overflow: "auto",
                    overflowX: "hidden",
                    borderRadius: 4
                }}
            >
                {isFetching && (
                    <div className='loading-view'>
                        <Spinner />
                    </div>
                )}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        backgroundColor: isFetching ? "rgba(255,255,255,0.5)" : "transparent"
                    }}
                >
                    <Slider
                        items={dataList}
                        render={(item) => {
                            return (
                                <Box paddingRight={1}>
                                    <EventCard
                                        item={item as Event}
                                        onClickButton={() => {
                                            showDeviceInfo(item, true);
                                        }}
                                        onDoubleClickImage={() => {
                                            showSnapshot(item as Event);
                                        }}
                                    />
                                </Box>
                            );
                        }}
                    />
                </Box>
                {dataList.length === 0 && !isFetching && (
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            background: "#ffff"
                        }}
                    >
                        <Empty title={t("No event")} />
                    </Box>
                )}
            </Box>
            <Paper title={t("title")}>
                <Box display='flex' alignItems='center' gap='12px' marginBottom={"12px"}>
                    <div>{tCommon("Search")}</div>
                    <TextField
                        sx={{
                            minWidth: 320
                        }}
                        size='small'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t("Placeholder search")}
                    />
                    <Button height='48px' startIcon={Search} onClick={handleSearch}>
                        {tCommon("Search")}
                    </Button>
                </Box>

                <Table
                    maxHeight={400}
                    border
                    isLoading={isFetching}
                    columns={columns}
                    data={dataList}
                    rowSelection={{
                        keyName: "_id",
                        selectedRowKeys: [],
                        onChange: (selectedRowKeys) => {
                            setDeleteIds(selectedRowKeys);
                        }
                    }}
                    order={filter.sortOrder}
                    orderBy={filter.sortField}
                    onRequestSort={handleRequestSort}
                />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center'>
                <Button
                    disabled={isFetching || deleteIds.length === 0}
                    height='40px'
                    startIcon={DeleteOutline}
                    onClick={() => startDeleteItems(deleteIds)}
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

            <DeviceDialog />

            <EventDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <SnapshotDialog />

            <ConfirmDialog
                title={tCommon("Delete")}
                description={t("Delete record confirm")}
                color='error'
                confirmText={tCommon("Continue")}
            />
        </React.Fragment>
    );
};
