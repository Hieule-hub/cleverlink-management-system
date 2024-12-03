import { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { ControllerAsyncSearchSelect, type Option } from "@components/Controller/ControllerAsyncSearchSelect";
import { ControllerSelect } from "@components/Controller/ControllerSelect";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { Divider, Grid2 as Grid, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import sceneService from "@services/scene";
import userService from "@services/user";
import { toast, triggerToast } from "@store/toastStore";
import { useUserStore } from "@store/userStore";
import { RoleCode } from "common";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

interface UserDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormUserValues = Partial<{
    userId: string;
    password: string;
    name: string;
    roleId: string;
    company: Option;
    companyId: string;
    scene: Option;
    sceneId: string;

    task: string;
    phone: string;
    email: string;
    kakao: string;
    telegram: string;
    startDate: string;
    token: string;
}>;

const initFormValues: FormUserValues = {
    userId: "",
    password: "",
    name: "",
    roleId: "",
    company: { label: "", value: "" },
    companyId: "",
    scene: { label: "", value: "" },
    sceneId: "",

    task: "",
    phone: "",
    email: "",
    kakao: "",
    telegram: "",
    token: "",
    startDate: dayjs().format("YYYY-MM-DD")
};

export const UserDialog = ({ onClose = () => "" }: UserDialogProps) => {
    const t = useTranslations();
    const { roles } = useAppStore((state) => state);
    const { user, open, closeUserDialog, setUser } = useUserStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingUserId, setIsFetchingUserId] = useState(false);

    const { handleSubmit, control, getValues, setValue, reset } = useForm<FormUserValues>({
        defaultValues: {
            userId: "",
            password: "",
            startDate: dayjs().format("YYYY-MM-DD")
        }
    });

    useEffect(() => {
        //fill form with user data
        if (user) {
            console.log("🚀 ~ useEffect ~ user:", user);

            const newValue: FormUserValues = {
                ...initFormValues,
                userId: user.userId,
                // password: user.password,
                name: user.name,
                roleId: user.roleId.code,
                company: { label: user.company.name, value: user.company._id },
                companyId: user.company.companyId,
                scene: { label: user.scene.name, value: user.scene._id },
                sceneId: user.scene._id,

                // task: user.task,
                // phone: user.phone,
                // email: user.email,
                // kakao: user.kakao,
                // telegram: user.telegram,
                // token: user.token,
                startDate: dayjs(user.createdAt).format("YYYY-MM-DD HH:mm:ss")
            };

            reset(newValue);
        } else {
            reset(initFormValues);
        }
    }, [user]);

    const handleClose = () => {
        onClose();
        closeUserDialog();
    };

    const handleReset = () => {
        setUser(null);
    };

    const handleSave = () => {
        handleSubmit(async (data: FormUserValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (user) {
                    // const response = await userService.createUser({
                    //     userId: data.userId,
                    //     password: data.password,
                    //     name: data.name,
                    //     roleId: data.roleId,
                    //     companyId: data.company?.value,
                    //     sceneId: data.scene?.value,
                    //     task: data.task,
                    //     phone: data.phone,
                    //     email: data.email,
                    //     kakao: data.kakao,
                    //     telegram: data.telegram,
                    //     token: data.token
                    // });
                    // if (!response.err) {
                    //     // triggerToastDev("success", t("UserPage.CreateRecordSuccess"));
                    //     handleClose();
                    // } else {
                    //     // triggerToastDev("error", t("UserPage.CreateRecordFailed"));
                    // }
                } else {
                    const response = await userService.createUser({
                        userId: data.userId,
                        password: data.password,
                        name: data.name,
                        roleId: roles.find((role) => role.code === data.roleId)?._id || "",
                        companyId: (data.company?.value || "") as string,
                        sceneId: (data.scene?.value || "") as string,
                        task: data.task,
                        phone: data.phone,
                        email: data.email,
                        kakao: data.kakao,
                        telegram: data.telegram,
                        token: data.token
                    });
                    if (!response.err) {
                        toast.success({ title: t("UserPage.CreateRecordSuccess") });
                        handleClose();
                    } else {
                        // triggerToastDev("error", t("UserPage.CreateRecordFailed"));
                    }
                }
            } catch (error) {
                console.log("🚀 ~ handleSubmit ~ error:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    const fetchingUserId = async () => {
        const roleId = getValues("roleId");

        //get role code
        const roleCode: RoleCode = "TU";

        setIsFetchingUserId(true);

        try {
            const response = await userService.getUserId({
                prefix: roleCode
            });

            if (!response.err) {
                const { userId, password, token } = response.data;
                // setUserForm(response.data);
                setValue("userId", userId);
                setValue("password", password);
                setValue("token", token);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingUserId(false);
        }
    };

    const fetchScenes = useCallback((query: string) => {
        return sceneService.getSceneList({ filters: query, limit: 10, page: 1 }).then((res) => {
            if (!res.err) {
                return res.data.scenes.map((scene) => ({
                    label: scene.name,
                    value: scene._id
                }));
            } else {
                return [];
            }
        });
    }, []);

    const fetchCompanies = useCallback((query: string) => {
        return companyService.getCompanyList({ filters: query, limit: 10, page: 1 }).then((res) => {
            if (!res.err) {
                return res.data.companies.map((company) => ({
                    label: company.name,
                    value: company._id
                }));
            } else {
                return [];
            }
        });
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
            title={user ? t("UserPage.Edit record") : t("UserPage.Add new record")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Company name */}
                <Grid size={labelSize}>
                    <Label label='Company' htmlFor='company' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerAsyncSearchSelect
                        control={control}
                        keyName='company'
                        placeholder='Company'
                        request={fetchCompanies}
                    />
                </Grid>

                {/* User name */}
                <Grid size={labelSize}>
                    <Label label='User Name' htmlFor='name' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='name' placeholder='Name' />
                </Grid>

                {/* Company ID */}
                <Grid size={labelSize}>
                    <Label label='Company ID' htmlFor='companyId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='companyId' placeholder='Company ID' disabled />
                </Grid>

                {/* Department name */}
                <Grid size={labelSize}>
                    <Label label='Department name' htmlFor='departmentName' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerSelect
                        control={control}
                        keyName='roleId'
                        placeholder='Department name'
                        selectProps={{
                            options: roles.map((org) => ({
                                value: org.code,
                                label: org.name
                            }))
                        }}
                    />
                </Grid>

                {/* Scene */}
                <Grid size={labelSize}>
                    <Label label='Scene' htmlFor='scene' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerAsyncSearchSelect
                        control={control}
                        keyName='scene'
                        placeholder='Scene'
                        request={fetchScenes}
                    />
                </Grid>

                {/* Role */}
                <Grid size={labelSize}>
                    <Label label='Role' htmlFor='roleId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='roleId' placeholder='Role' disabled />
                </Grid>

                {/* Task */}
                <Grid size={labelSize}>
                    <Label label='Task' htmlFor='task' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='task' placeholder='Task' />
                </Grid>

                {/* User ID */}
                <Grid size={labelSize}>
                    <Label label='User ID' htmlFor='userId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='userId' placeholder='User ID' disabled />
                </Grid>

                {/* Register Date */}
                <Grid size={labelSize}>
                    <Label label='Register Date' htmlFor='startDate' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='startDate' placeholder='Register Date' disabled />
                </Grid>

                {/* Password */}
                <Grid size={labelSize}>
                    <Label label='PW' htmlFor='password' />
                </Grid>
                <Grid size={5}>
                    <ControllerInput control={control} keyName='password' placeholder='Password' disabled />
                </Grid>
                <Grid size={3}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='48px'
                        onClick={fetchingUserId}
                        loading={isFetchingUserId}
                    >
                        {t("Common.Reset")}
                    </Button>
                </Grid>
            </Grid>

            <Divider />

            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Phone number */}
                <Grid size={labelSize}>
                    <Label label='Phone number' htmlFor='phone' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='phone' placeholder='Phone Number' />
                </Grid>

                {/* ID Kakao */}
                <Grid size={labelSize}>
                    <Label label='KakaoTalk ID' htmlFor='kakao' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='kakao' placeholder='KakaoTalk ID' />
                </Grid>

                {/* Email */}
                <Grid size={labelSize}>
                    <Label label='Email' htmlFor='email' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='email' placeholder='Email' />
                </Grid>

                {/* Telegram */}
                <Grid size={labelSize}>
                    <Label label='Telegram ID' htmlFor='telegram' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='telegram' placeholder='Telegram ID' />
                </Grid>

                {/* Token */}
                <input type='hidden' />
                <ControllerInput hidden control={control} keyName='token' placeholder='Token' />
            </Grid>
        </Dialog>
    );
};
