"use client";

import { useEffect, useMemo, useState } from "react";

import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import { Paper } from "@components/Paper";
import { AddCircleOutlineOutlined, DeleteOutline, DescriptionOutlined, FilterList, Search } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import userService from "@/services/user";
import { triggerToastDev } from "@/utils";

export default function DashboardPage() {
    const t = useTranslations("UserPage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // Fetch data
        fetchUserList();
    }, []);

    const fetchUserList = async () => {
        setIsFetching(true);
        try {
            const userListRes = await userService.getUserList({
                page: 1,
                limit: 10
            });

            console.log("🚀 ~ fetchUserList ~ userListRes:", userListRes);

            setUserList(userListRes.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const columns = useMemo(() => {
        return [
            {
                key: "name",
                title: t("Name"),
                dataIndex: "name",
                width: 200,
                render: (text) => <div>{text}</div>
            },
            {
                key: "userId",
                title: t("ID"),
                dataIndex: "UserId",
                width: 200,
                render: (text) => <div>{text}</div>
            },
            {
                key: "Role",
                title: t("Role"),
                dataIndex: "Role",
                width: 200,
                render: (text) => <div>{text}</div>
            },
            {
                key: "scene",
                title: t("Scene"),
                dataIndex: "Scene",
                width: 200,
                render: (text) => <div>{text}</div>
            },
            {
                title: t("Edit") + "/" + t("Delete"),
                key: "action",
                render: (_, record) => (
                    <Box>
                        <IconButton
                            color='primary'
                            onClick={() => {
                                triggerToastDev();
                            }}
                        >
                            <DescriptionOutlined />
                        </IconButton>
                        <IconButton
                            color='error'
                            onClick={() => {
                                triggerToastDev();
                            }}
                        >
                            <DeleteOutline />
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
                <Box display='flex' alignItems='center' gap='12px'>
                    <div>{tCommon("Search")}</div>
                    <TextField
                        sx={{
                            minWidth: 320
                        }}
                        size='small'
                        placeholder='Name, ID, classification, work site'
                    />
                    <Button height='48px' startIcon={Search} onClick={triggerToastDev}>
                        {tCommon("Search")}
                    </Button>
                    <Button height='48px' startIcon={FilterList} onClick={triggerToastDev}>
                        {tCommon("Search")}
                    </Button>

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

                <Table columns={columns} data={userList} />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center'>
                <Button height='40px' startIcon={DeleteOutline}>
                    {tCommon("Delete")}
                </Button>
                <Box flex={1}>
                    ({3}) {tCommon("selected")}
                </Box>
                <Pagination
                    sx={{
                        marginLeft: "auto",
                        flex: 1
                    }}
                />
            </Box>
        </MainLayout>
    );
}
