import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

import { Pagination } from "@components/Pagination";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import { DescriptionOutlined } from "@mui/icons-material";
import { Box, IconButton, Link } from "@mui/material";
import sceneService from "@services/scene";
import { useTranslations } from "next-intl";

import { SceneDialog, useSceneDialog } from "./SceneDialog";

export const SceneReadOnly = () => {
    const t = useTranslations("ScenePage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState([]);

    //Store controller
    const { openDialog } = useSceneDialog();
    const { openDialog: showUserInfo } = useUserInfoDialog();

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

    // const handleSearch = useCallback(() => {
    //     setFilter((pre) => {
    //         return { ...pre, page: 1, filters: keyword };
    //     });
    // }, [keyword]);

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "sceneId",
                title: t("Scene ID"),
                dataIndex: "sceneId",
                width: 200,
                render: (text) => text
            },
            {
                key: "company",
                title: t("Company name"),
                dataIndex: "company",
                align: "center",
                width: 200,
                render: (value) => {
                    return value?.name;
                }
            },
            {
                key: "name",
                title: t("Scene name"),
                dataIndex: "name",
                width: 200,
                render: (text) => text
            },
            {
                key: "address",
                title: t("Address"),
                dataIndex: "address",
                width: 200,
                render: (text) => text
            },

            {
                key: "user",
                title: t("Manager"),
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

    return (
        <React.Fragment>
            <Paper title={t("title")}>
                <Table border isLoading={isFetching} columns={columns} data={dataList} />
            </Paper>

            <Box marginTop='12px' display='flex' gap='12px' alignItems='center' justifyContent={"center"}>
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

            <SceneDialog readonly />
            <UserInfoDialog />
        </React.Fragment>
    );
};
