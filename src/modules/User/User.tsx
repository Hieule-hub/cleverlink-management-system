import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/Dialog";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { User } from "@interfaces/user";
import { AddCircleOutlineOutlined, DeleteOutline, DescriptionOutlined, FilterList, Search } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import userService from "@services/user";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import { useUserStore } from "@store/userStore";
import { useTranslations } from "next-intl";

import { UserDialog } from "./UserDialog";

export const UserPage = () => {
    const t = useTranslations("UserPage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState<User[]>([]);

    //Store controller
    const { user, openUserDialog } = useUserStore();
    const { startConfirm } = useConfirm();

    //Delete user list
    const [deleteIds, setDeleteIds] = useState([]);

    // Filter
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        filters: ""
    });

    const fetchDataList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);

        try {
            const listRes = await userService.getUserList(params);

            if (!listRes.err) {
                setDataList(listRes.data.users);
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
            await userService.deleteUsers({
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

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "name",
                title: t("Name"),
                dataIndex: "name",
                width: 200,
                render: (value) => value
            },
            {
                key: "userId",
                title: t("ID"),
                dataIndex: "userId",
                align: "center",
                width: 200,
                render: (value) => value
            },
            {
                key: "roleId",
                title: t("Role"),
                dataIndex: "roleId",
                align: "center",
                width: 200,
                render: (value) => value?.code
            },
            {
                key: "scene",
                title: t("Scene name"),
                dataIndex: "scene",
                width: 200,
                render: (value) => value?.name
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
                                openUserDialog(record);
                            }}
                        >
                            <DescriptionOutlined fontSize='inherit' />
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
                        onClick={() => openUserDialog()}
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

            <UserDialog
                onClose={(status) => {
                    if (status === "success") {
                        handleSearch();
                    }
                }}
            />

            <ConfirmDialog title={tCommon("Delete")} description={t("Delete record confirm")} color='error' />
        </React.Fragment>
    );
};
