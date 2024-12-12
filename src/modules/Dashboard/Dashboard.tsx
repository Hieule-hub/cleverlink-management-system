import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { DescriptionOutlined, FilterList, Search } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import resourceService from "@services/resource";
import { useTranslations } from "next-intl";

import { triggerToastDev } from "@/utils";

export const DashboardPage = () => {
    const t = useTranslations("DashboardPage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller

    // Filter
    const [total, setTotal] = useState(0);
    const [comKeyword, setComKeyword] = useState("");
    const [sceKeyword, setSceKeyword] = useState("");
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        company: "",
        scene: ""
    });

    const fetchDataList = useCallback(async (params: typeof filter) => {
        setIsFetching(true);
        try {
            const listRes = await resourceService.getDashboardData(params);

            setDataList(listRes.data.devices);
            setTotal(listRes.data.paging.totalItems);
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

    const handleSearch = useCallback(() => {
        setFilter((pre) => {
            return { ...pre, company: comKeyword, scene: sceKeyword };
        });
    }, [comKeyword, sceKeyword]);

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "companyID",
                title: t("Company ID"),
                dataIndex: "company",
                align: "center",
                width: 200,
                render: (value) => value?.companyId
            },
            {
                key: "companyName",
                title: t("Company name"),
                dataIndex: "company",
                align: "center",
                width: 200,
                render: (value) => value?.name
            },
            {
                key: "sceneID",
                title: t("Scene ID"),
                dataIndex: "scene",
                align: "center",
                width: 200,
                render: (value) => value?.sceneId
            },
            {
                key: "sceneName",
                title: t("Scene name"),
                dataIndex: "scene",
                width: 200,
                render: (value) => value?.name
            },

            {
                key: "deviceId",
                title: t("Device ID"),
                dataIndex: "activate",
                align: "center",
                width: 200,
                render: (value) => value?.boxId
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
                                // openUserDialog(record);
                                triggerToastDev();
                            }}
                        >
                            <DescriptionOutlined fontSize='inherit' />
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
                            minWidth: 200
                        }}
                        size='small'
                        value={comKeyword}
                        onChange={(e) => setComKeyword(e.target.value)}
                        placeholder={t("Company name")}
                    />
                    <TextField
                        sx={{
                            minWidth: 200
                        }}
                        size='small'
                        value={sceKeyword}
                        onChange={(e) => setSceKeyword(e.target.value)}
                        placeholder={t("Scene name")}
                    />
                    <Button height='48px' startIcon={Search} onClick={handleSearch}>
                        {tCommon("Search")}
                    </Button>
                    {/* <Button height='48px' startIcon={FilterList} onClick={triggerToastDev}>
                        {tCommon("Filter")}
                    </Button> */}
                </Box>

                <Table border isLoading={isFetching} columns={columns} data={dataList} />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center' justifyContent='center'>
                {Math.ceil(total / 10) > 1 && (
                    <Pagination
                        count={Math.ceil(total / 10)}
                        page={filter.page}
                        onChange={(e, page) =>
                            setFilter((pre) => {
                                return { ...pre, page };
                            })
                        }
                    />
                )}
            </Box>
        </React.Fragment>
    );
};
