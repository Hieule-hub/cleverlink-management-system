import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/Dialog";
import { EditIcon } from "@components/Icon";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { AddCircleOutlineOutlined, DeleteOutline, FilterList, Search } from "@mui/icons-material";
import { Box, IconButton, Link, TextField } from "@mui/material";
import deviceService from "@services/device";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import { useTranslations } from "next-intl";

import { CameraDialog, useCameraDialog } from "./CameraDialog";

export const CameraPage = () => {
    const t = useTranslations("CameraPage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller
    const { openDialog } = useCameraDialog();
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
        sortField: "name",
        sortOrder: "desc"
    });

    const fetchDataList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);
        try {
            const listRes = await deviceService.getCameraList(params);

            if (!listRes.err) {
                setDataList(listRes.data.cameras);
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
            await deviceService.deleteCameras({
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
                key: "name",
                title: t("Model name"),
                dataIndex: "name",
                width: 200,
                sorter: true,
                render: (value) => value
            },
            {
                key: "category.name",
                title: t("Type"),
                dataIndex: "category",
                width: 200,
                sorter: true,
                render: (value) => value?.name
            },
            {
                key: "factory",
                title: t("Factory"),
                dataIndex: "factory",
                width: 200,
                sorter: true,
                render: (value) => value
            },

            {
                key: "protocol.name",
                title: t("Protocol"),
                dataIndex: "protocol",
                width: 200,
                sorter: true,
                render: (value) => value?.name
            },
            {
                key: "poe",
                title: t("POE"),
                dataIndex: "poe",
                align: "center",
                width: 200,
                render: (value) => {
                    return value ? tCommon("Yes") : tCommon("No");
                }
            },
            {
                key: "cameraId",
                title: t("Model ID"),
                dataIndex: "cameraId",
                align: "center",
                width: 200,
                sorter: true,
                render: (text, record) => (
                    <Link
                        component='button'
                        variant='body2'
                        fontWeight={500}
                        onClick={() => {
                            openDialog(record, true);
                        }}
                    >
                        {text}
                    </Link>
                )
            },
            {
                title: tCommon("Edit") + "/" + tCommon("Delete"),
                key: "action",
                align: "right",
                render: (_, record) => (
                    <Box display='flex' justifyContent='end' gap={2}>
                        <IconButton
                            size='small'
                            color='info'
                            onClick={() => {
                                // openUserDialog(record);
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

            <CameraDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <ConfirmDialog
                title={tCommon("Delete")}
                description={t("Delete record confirm")}
                color='error'
                confirmText={tCommon("Continue")}
            />
        </React.Fragment>
    );
};
