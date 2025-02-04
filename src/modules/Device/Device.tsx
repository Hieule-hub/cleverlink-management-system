import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/Dialog";
import { EditIcon } from "@components/Icon";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import {
    AddCircleOutlineOutlined,
    CastOutlined,
    DeleteOutline,
    FilterList,
    Search,
    VideocamOutlined
} from "@mui/icons-material";
import { Box, IconButton, Link, TextField } from "@mui/material";
import deviceService from "@services/device";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { CameraLinkInfo, useCameraLinkDialog } from "./CameraLinkInfo";
import { DeviceDialog, useDeviceDialog } from "./DeviceDialog";

export const DevicePage = () => {
    const t = useTranslations("DevicePage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller
    const { openDialog } = useDeviceDialog();
    const { openDialog: showCameraLinkInfo } = useCameraLinkDialog();
    const { openDialog: showUserInfo } = useUserInfoDialog();
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
        sortField: "createdAt",
        sortOrder: "desc"
    });

    const fetchDataList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);
        try {
            const listRes = await deviceService.getDeviceList(params);

            if (!listRes.err) {
                setDataList(listRes.data.devices);
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
            await deviceService.deleteDevices({
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
                key: "createdAt",
                title: t("Install date"),
                dataIndex: "createdAt",
                align: "center",
                width: 200,
                sorter: true,
                render: (value) => {
                    return dayjs(value).format("YYYY-MM-DD");
                }
            },
            {
                key: "company.name",
                title: t("Company name"),
                dataIndex: "company",
                width: 200,
                sorter: true,
                render: (value) => value?.name
            },
            {
                key: "scene.name",
                title: t("Scene name"),
                dataIndex: "scene",
                width: 200,
                sorter: true,
                render: (value) => value?.name
            },
            {
                key: "user.name",
                title: t("Manager"),
                dataIndex: "user",
                align: "center",
                width: 200,
                sorter: true,
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
                key: "deviceId",
                title: t("Device ID"),
                dataIndex: "activate",
                align: "center",
                width: 200,
                sorter: true,
                render: (value, record) => (
                    <Link
                        component='button'
                        variant='body2'
                        fontWeight={500}
                        onClick={() => {
                            openDialog(record, true);
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
                title: tCommon("Camera") + "/" + tCommon("Edit") + "/" + tCommon("Delete"),
                key: "action",
                align: "right",
                render: (_, record) => (
                    <Box display='flex' justifyContent='end' gap={2}>
                        <IconButton
                            size='small'
                            color='success'
                            onClick={() => {
                                showCameraLinkInfo(record);
                            }}
                        >
                            <VideocamOutlined fontSize='inherit' />
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
                    {/* <Button height='48px' startIcon={FilterList} onClick={triggerToastDev}>
                        {tCommon("Filter")}
                    </Button> */}

                    <Button
                        style={{
                            marginLeft: "auto"
                        }}
                        height='48px'
                        color='primary'
                        startIcon={AddCircleOutlineOutlined}
                        onClick={() => {
                            openDialog();
                        }}
                    >
                        {t("Add new record")}
                    </Button>
                </Box>

                <Table
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

            <DeviceDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <UserInfoDialog />

            <CameraLinkInfo />

            <ConfirmDialog
                title={tCommon("Delete")}
                description={t("Delete record confirm")}
                color='error'
                confirmText={tCommon("Continue")}
            />
        </React.Fragment>
    );
};
