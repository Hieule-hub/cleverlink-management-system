import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { AddCircleOutlineOutlined, DeleteOutline, DescriptionOutlined, FilterList, Search } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import userService from "@services/user";
import { triggerToastDev } from "@utils/index";
import { useTranslations } from "next-intl";

import { useUserStore } from "@/store/userStore";

import { UserDialog } from "./UserDialog";

export const UserPage = () => {
    const t = useTranslations("UserPage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [userList, setUserList] = useState([]);

    //Store controller
    const { user, openUserDialog } = useUserStore();

    //Delete user list
    const [deleteUserIds, setDeleteUserIds] = useState([]);

    // Filter
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        filters: ""
    });

    useEffect(() => {
        // Fetch data
        fetchUserList(filter);
    }, [filter]);

    const fetchUserList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);
        try {
            const userListRes = await userService.getUserList(params);

            setUserList(userListRes.data.users);
            setTotal(userListRes.data.paging.totalItems);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    const handleDeleteUsers = async (ids: string[]) => {
        if (!confirm("Are you sure you want to delete the selected users: " + ids.join(", "))) {
            return;
        }

        setIsFetching(true);
        try {
            await userService.deleteUsers({
                ids: ids
            });
            fetchUserList(filter);
            setDeleteUserIds([]);
        } catch (error) {
            console.log("🚀 ~ handleDeleteUsers ~ error:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearch = useCallback(() => {
        setFilter((pre) => {
            return { ...pre, filters: keyword };
        });
    }, [keyword]);

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "name",
                title: t("Name"),
                dataIndex: "name",
                width: 200,
                render: (text) => text
            },
            {
                key: "userId",
                title: t("ID"),
                dataIndex: "UserId",
                width: 200,
                render: (text) => text
            },
            {
                key: "roleId",
                title: t("Role"),
                dataIndex: "roleId",
                align: "center",
                width: 200,
                render: (value) => {
                    return value?.code;
                }
            },
            {
                key: "scene",
                title: t("Scene"),
                dataIndex: "Scene",
                width: 200,
                render: (value) => {
                    return value.name;
                }
            },
            {
                title: tCommon("Edit") + "/" + tCommon("Delete"),
                key: "action",
                align: "right",
                render: (_, record) => (
                    <Box display='flex' justifyContent='end'>
                        <IconButton
                            size='small'
                            color='primary'
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
                                handleDeleteUsers([record._id]);
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
        <MainLayout title={t("title")}>
            <Breadcrumbs />
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
                        placeholder='Name, ID, classification, work site'
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
                        onClick={triggerToastDev}
                    >
                        {t("Add new user")}
                    </Button>
                </Box>

                <Table
                    border
                    isLoading={isFetching}
                    columns={columns}
                    data={userList}
                    rowSelection={{
                        keyName: "_id",
                        selectedRowKeys: [],
                        onChange: (selectedRowKeys) => {
                            setDeleteUserIds(selectedRowKeys);
                        }
                    }}
                />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center'>
                <Button
                    disabled={isFetching || deleteUserIds.length === 0}
                    height='40px'
                    startIcon={DeleteOutline}
                    onClick={() => handleDeleteUsers(deleteUserIds)}
                >
                    {tCommon("Delete")}
                </Button>
                <Box flex={1}>
                    ({deleteUserIds.length}) {tCommon("selected")}
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

            <UserDialog onClose={() => console.log("dialog on close ---->")} />
        </MainLayout>
    );
};
