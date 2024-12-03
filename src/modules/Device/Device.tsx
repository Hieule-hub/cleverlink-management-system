import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { Breadcrumbs } from "@components/Layout/Breadcrumbs";
import MainLayout from "@components/Layout/MainLayout";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import {
    AddCircleOutlineOutlined,
    DeleteOutline,
    DescriptionOutlined,
    FilterList,
    Search,
    VideocamOutlined
} from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import deviceService from "@/services/device";
import { triggerToastDev } from "@/utils";

export const DevicePage = () => {
    const t = useTranslations("DevicePage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller

    //Delete list
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
        if (!confirm("Are you sure you want to delete the selected: " + ids.join(", "))) {
            return;
        }

        setIsFetching(true);
        try {
            // await userService.deleteUsers({
            //     ids: ids
            // });
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
            return { ...pre, filters: keyword };
        });
    }, [keyword]);

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "deviceId",
                title: t("Device ID"),
                dataIndex: "activate",
                align: "center",
                width: 200,
                render: (value) => value?.boxId
            },
            {
                key: "installDate",
                title: t("Install date"),
                dataIndex: "createdAt",
                align: "center",
                width: 200,
                render: (value) => {
                    return dayjs(value).format("YYYY-MM-DD");
                }
            },
            {
                key: "companyName",
                title: t("Company name"),
                dataIndex: "company",
                width: 200,
                render: (value) => value?.name
            },
            {
                key: "sceneName",
                title: t("Scene name"),
                dataIndex: "scene",
                width: 200,
                render: (value) => value?.name
            },

            {
                key: "user",
                title: t("Manager"),
                dataIndex: "user",
                align: "center",
                width: 200,
                render: (value) => value?.name
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
                                // openUserDialog(record);
                                triggerToastDev();
                            }}
                        >
                            <VideocamOutlined fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            size='small'
                            color='primary'
                            onClick={() => {
                                // openUserDialog(record);
                                triggerToastDev();
                            }}
                        >
                            <DescriptionOutlined fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            size='small'
                            color='error'
                            onClick={() => {
                                handleDeleteItems([record._id]);
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
                            // openUserDialog();
                            triggerToastDev();
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

            {/* <UserDialog onClose={() => console.log("dialog on close ---->")} /> */}
        </MainLayout>
    );
};
