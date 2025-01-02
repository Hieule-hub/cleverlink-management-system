import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@components/Dialog";
import { EditIcon } from "@components/Icon";
import { Paper } from "@components/Paper";
import { type Column, Table } from "@components/Table";
import { Device } from "@interfaces/device";
import { UserInfoDialog, useUserInfoDialog } from "@modules/User";
import { DeleteOutline, VideocamOutlined } from "@mui/icons-material";
import { Box, IconButton, Link } from "@mui/material";
import deviceService from "@services/device";
import { toast } from "@store/toastStore";
import { useConfirm } from "@store/useConfirm";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { CameraLinkInfo, useCameraLinkDialog } from "./CameraLinkInfo";
import { DeviceDialog, useDeviceDialog } from "./DeviceDialog";

interface DeviceGroupData {
    _id: string;
    sceneId: string;
    sceneName: string;
    createdAt: string;
    devices: Device[];
}

export const DeviceTU = () => {
    const t = useTranslations("DevicePage");
    const tCommon = useTranslations("Common");

    const [isFetching, setIsFetching] = useState(false);
    const [dataList, setDataList] = useState<DeviceGroupData[]>([]);

    //Store controller
    const { openDialog } = useDeviceDialog();
    const { openDialog: showCameraLinkInfo } = useCameraLinkDialog();
    const { openDialog: showUserInfo } = useUserInfoDialog();
    const { startConfirm } = useConfirm();

    const fetchDataList = useCallback(async () => {
        setIsFetching(true);
        try {
            const listRes = await deviceService.getDeviceList({
                page: 1,
                limit: 999999,
                filters: ""
            });

            if (!listRes.err) {
                const devices = listRes.data?.devices || [];

                const groupData: DeviceGroupData[] = devices.reduce((acc: DeviceGroupData[], device) => {
                    const sceneIndex = acc.findIndex((item) => item.sceneId === device.scene?._id);

                    if (sceneIndex !== -1) {
                        acc[sceneIndex].devices.push(device);
                    } else {
                        acc.push({
                            _id: device.scene?._id,
                            sceneId: device.scene?._id,
                            sceneName: device.scene?.name,
                            createdAt: device.scene?.createdAt,
                            devices: [device]
                        });
                    }

                    return acc;
                }, []);

                //sort by scene createdAt
                groupData.sort((a, b) => {
                    return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
                });

                setDataList(groupData);
            }
        } catch (error) {
            console.log("🚀 ~ fetchDataList ~ error:", error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        // Fetch data
        fetchDataList();
    }, [fetchDataList]);

    const handleDeleteItems = async (ids: string[]) => {
        setIsFetching(true);

        try {
            await deviceService.deleteDevices({
                ids: ids
            });
            fetchDataList();

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

    const columns = useMemo((): Column[] => {
        return [
            {
                key: "deviceId",
                title: t("Device ID"),
                dataIndex: "activate",
                align: "center",
                width: 200,
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
            {dataList.map((groupData) => {
                return (
                    <Paper title={groupData.sceneName} key={groupData.sceneId}>
                        <Table
                            maxHeight={300}
                            border
                            isLoading={isFetching}
                            columns={columns}
                            data={groupData.devices}
                        />
                    </Paper>
                );
            })}

            <DeviceDialog
                onClose={(status) => {
                    if (status === "success") {
                        fetchDataList();
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
