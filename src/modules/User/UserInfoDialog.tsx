import { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import { ControllerAsyncSearchSelect, ControllerInput, type Option } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { Spinner } from "@components/Spiner";
import { User } from "@interfaces/user";
import { Divider, Grid2 as Grid, Stack, Zoom } from "@mui/material";
import userService from "@services/user";
import { dialogStore } from "@store/dialogStore";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export const useUserInfoDialog = dialogStore<User>();

interface UserInfoDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormValues = Partial<{
    userId: string;
    password: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    roleId: string;
    company: Option;
    scene: Option;
    address: string;
    website: string;
    startDate: string;
}>;

const initFormValues: FormValues = {
    userId: "",
    password: "",
    name: "",
    roleId: "",
    company: { label: "", value: "" },
    scene: { label: "", value: "" },
    address: "",
    website: "",
    phone: "",
    email: "",
    startDate: dayjs().format("YYYY-MM-DD")
};

export const UserInfoDialog = ({ onClose = () => "" }: UserInfoDialogProps) => {
    const t = useTranslations("UserPage");
    const tCommon = useTranslations("Common");

    const { item, open, closeDialog } = useUserInfoDialog();

    const [isFetching, setIsFetching] = useState(false);

    const { control, reset } = useForm<FormValues>({
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            fetchUserInformation(item.userId);
        } else {
            reset(initFormValues);
        }
    }, [item, reset]);

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
    };

    const fetchUserInformation = useCallback(async (id: string) => {
        setIsFetching(true);

        try {
            const userInfoRes = await userService.getUserList({
                page: 1,
                limit: 1,
                filters: id
            });

            if (!userInfoRes.err) {
                const item = userInfoRes.data.users[0];
                console.log("🚀 ~ fetchUserInformation ~ item:", item);
                if (!item) {
                    return;
                }

                const newValue: FormValues = {
                    ...initFormValues,
                    userId: item.userId,
                    password: "11111111",
                    address: item.company?.address,
                    name: item.name,
                    roleId: item.roleId?.code,
                    company: { label: item.company?.name, value: item.company?._id },
                    scene: { label: item.scene?.name, value: item.scene?._id },
                    phone: item?.phone || initFormValues.phone,
                    email: item?.email || initFormValues.email,
                    website: item?.company?.website || initFormValues.website,
                    startDate: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
                };

                reset(newValue);
            }
        } catch (error) {
            console.log("🚀 ~ fetchUserInformation ~ error:", error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    return (
        <Dialog
            aria-describedby='user-dialog-description'
            aria-labelledby='user-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "960px",
                    height: "auto"
                }
            }}
            open={open}
            title={t("Record information")}
            onClose={handleClose}
            onCancel={handleClose}
            footer={
                <Button height='36px' onClick={() => handleClose()}>
                    {tCommon("Cancel")}
                </Button>
            }
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={<Divider orientation='vertical' flexItem />}
                spacing={2}
                position='relative'
            >
                {isFetching && (
                    <div className='loading-view'>
                        <Spinner />
                    </div>
                )}
                <Grid padding={2} width='100%' gap={2} container spacing={2} columns={12} alignItems='center'>
                    {/* Company Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Company")} htmlFor='company' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            disabled
                            control={control}
                            keyName='company'
                            placeholder={t("Company")}
                        />
                    </Grid>

                    {/* Scene Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Scene")} htmlFor='scene' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerAsyncSearchSelect
                            disabled
                            control={control}
                            keyName='scene'
                            placeholder={t("Scene")}
                        />
                    </Grid>

                    {/* Address Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Address")} htmlFor='address' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='address' placeholder={t("Address")} disabled />
                    </Grid>

                    {/* Website Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Website")} htmlFor='website' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='website' placeholder={t("Website")} disabled />
                    </Grid>

                    {/* Register Date Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Register date")} htmlFor='startDate' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='startDate'
                            placeholder={t("Register Date")}
                            disabled
                        />
                    </Grid>
                </Grid>

                <Grid
                    padding={2}
                    width='100%'
                    gap={2}
                    container
                    spacing={2}
                    columns={12}
                    alignItems={"center"}
                    alignContent={"start"}
                >
                    {/* Name Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Name")} htmlFor='name' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='name' placeholder={t("Name")} disabled />
                    </Grid>

                    {/* Phone number Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Phone number")} htmlFor='phone' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='phone' placeholder={t("Phone number")} disabled />
                    </Grid>

                    {/* PEmail Field */}
                    <Grid size={labelSize}>
                        <Label label={t("Email")} htmlFor='email' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='email' placeholder={t("Email")} disabled />
                    </Grid>

                    {/* User ID Field */}
                    <Grid size={labelSize}>
                        <Label label={t("User ID")} htmlFor='userId' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput control={control} keyName='userId' placeholder={t("User ID")} disabled />
                    </Grid>

                    {/* Password Field */}
                    <Grid size={labelSize}>
                        <Label label={t("PW")} htmlFor='password' />
                    </Grid>
                    <Grid size={inputSize}>
                        <ControllerInput
                            control={control}
                            keyName='password'
                            placeholder={t("Password")}
                            disabled
                            inputProps={{
                                type: "password"
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Dialog>
    );
};
