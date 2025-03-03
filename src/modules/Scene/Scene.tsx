import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/Dialog";
import { EditIcon } from "@components/Icon";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import { AddCircleOutlineOutlined, DeleteOutline, Search } from "@mui/icons-material";
import { Box, IconButton, Link, TextField } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import sceneService from "@services/scene";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import { useTranslations } from "next-intl";

import { SceneDialog, useSceneDialog } from "./SceneDialog";

export const ScenePage = () => {
    const t = useTranslations("ScenePage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller
    const { openDialog } = useSceneDialog();
    const { openDialog: showUserInfo } = useUserInfoDialog();
    const { startConfirm } = useConfirm();
    const areas = useAppStore((state) => state.areas);

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
            const listRes = await sceneService.getSceneList(params);

            if (!listRes.err) {
                setDataList(listRes.data.scenes);
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
            await sceneService.deleteScenes({
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
                key: "company.name",
                title: t("Company name"),
                dataIndex: "company",
                width: 200,
                sorter: true,
                render: (value) => {
                    return value?.name;
                }
            },
            {
                key: "name",
                title: t("Scene name"),
                dataIndex: "name",
                width: 200,
                sorter: true,
                render: (text) => text
            },
            {
                key: "areaId",
                title: t("Area"),
                dataIndex: "areaId",
                width: 200,
                render: (text) => {
                    const area = areas.find((item) => item._id === text);
                    return area?.name;
                }
            },
            {
                key: "address",
                title: t("Address"),
                dataIndex: "address",
                width: 200,
                render: (text) => text
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
                key: "phone",
                title: t("Phone number"),
                dataIndex: "phone",
                width: 200,
                render: (text) => text
            },
            {
                key: "sceneId",
                title: t("Scene ID"),
                dataIndex: "sceneId",
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

            <SceneDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <UserInfoDialog />

            <ConfirmDialog
                title={tCommon("Delete")}
                description={t("Delete record confirm")}
                color='error'
                confirmText={tCommon("Continue")}
            />
        </React.Fragment>
    );
};
