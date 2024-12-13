import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { ControllerAsyncSearchSelect, type Option } from "@components/Controller/ControllerAsyncSearchSelect";
import { ControllerSelect } from "@components/Controller/ControllerSelect";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider, Grid2 as Grid, Typography, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import sceneService from "@services/scene";
import userService from "@services/user";
import { toast } from "@store/toastStore";
import { useUserStore } from "@store/userStore";
import { RoleCode } from "common";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface UserDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormUserValues = Partial<{
    userId: string;
    password: string;
    name: string;

    role: string;
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

    role: "",
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
    const t = useTranslations("UserPage");
    const tCommon = useTranslations("Common");
    const { roles } = useAppStore((state) => state);
    const { user, open, closeUserDialog, setUser } = useUserStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const editMode = useMemo(() => Boolean(user), [user]);

    const resolver = yup.object({
        userId: yup.string().required("User ID is required"),
        password: yup.string().required("Password is required"),
        name: yup.string().required("Name is required"),
        sceneId: yup.string().required("Scene is required"),
        companyId: yup.string().required("Company is required"),
        roleId: yup.string().required("Role is required"),
        email: yup.string().email("Email is not valid")
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
        setValue,
        reset,
        watch
    } = useForm<FormUserValues>({
        resolver: yupResolver(resolver),
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (user) {
            const newValue: FormUserValues = {
                ...initFormValues,
                userId: user.userId,
                password: "11111111",
                name: user.name,

                role: user.roleId?.code,
                roleId: user.roleId?.code,
                company: { label: user.company?.name, value: user.company?._id },
                companyId: user.company?.companyId,
                scene: { label: user.scene?.name, value: user.scene?._id },
                sceneId: user.scene?._id,
                task: user?.task || initFormValues.task,
                phone: user?.phone || initFormValues.phone,
                email: user?.email || initFormValues.email,
                kakao: user?.kakao || initFormValues.kakao,
                telegram: user?.telegram || initFormValues.telegram,
                startDate: dayjs(user.createdAt).format("YYYY-MM-DD HH:mm:ss")
            };

            reset(newValue);
        } else {
            reset(initFormValues);
        }
    }, [user, reset]);

    const handleClose = (status?: string) => {
        onClose(status);
        closeUserDialog();
    };

    const handleReset = () => {
        setUser(null);
    };

    const handleSave = () => {
        if (errors) {
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    const element = errors[key];

                    if (element?.message) {
                        toast.error({ title: element.message });
                    }
                }
            }
        }

        handleSubmit(async (data: FormUserValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (user) {
                    const response = await userService.editUser({
                        userId: user._id,
                        name: data.name,
                        sceneId: data.sceneId,
                        task: data.task,
                        phone: data.phone,
                        email: data.email,
                        kakao: data.kakao,
                        telegram: data.telegram
                    });
                    if (!response.err) {
                        toast.success({ title: t("Edit record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Edit record failed") });
                    }
                } else {
                    const response = await userService.createUser({
                        userId: data.userId,
                        password: data.password,
                        name: data.name,
                        roleId: roles.find((role) => role.code === data.roleId)?._id || "",
                        companyId: (data.company?.value || "") as string,
                        sceneId: data.sceneId,
                        task: data.task,
                        phone: data.phone,
                        email: data.email,
                        kakao: data.kakao,
                        telegram: data.telegram,
                        token: data.token
                    });
                    if (!response.err) {
                        toast.success({ title: t("Create record success") });
                        handleClose("success");
                    } else {
                        // toast.error({ title: t("Create record failed") });
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
        setIsFetchingId(true);

        try {
            const response = await userService.getUserId({
                prefix: roleId as RoleCode
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
            setIsFetchingId(false);
        }
    };

    const fetchScenes = useCallback(
        (query: string) => {
            const companyId = watch("company.value");

            return sceneService
                .getSceneList({ filters: query, limit: 10, page: 1, companyId: companyId as string })
                .then((res) => {
                    if (!res.err) {
                        return res.data.scenes.map((scene) => ({
                            label: scene.name,
                            value: scene._id
                        }));
                    } else {
                        return [];
                    }
                });
        },
        [watch("company.value")]
    );

    const fetchCompanies = useCallback((query: string) => {
        return companyService.getCompanyList({ filters: query, limit: 10, page: 1 }).then((res) => {
            if (!res.err) {
                return res.data.companies.map((company) => ({
                    label: company.name,
                    value: company._id,
                    id: company.companyId
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
            title={user ? t("Edit record") : t("Add new record")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Company Field */}
                <Grid size={labelSize}>
                    <Label required label={t("Company")} htmlFor='company' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerAsyncSearchSelect
                        disabled={editMode}
                        control={control}
                        keyName='company'
                        placeholder={t("Company")}
                        request={fetchCompanies}
                        onchangeField={(value) => {
                            if (value) {
                                setValue("companyId", value?.id as string);
                            }
                        }}
                    />
                </Grid>

                {/* User name Field */}
                <Grid size={labelSize}>
                    <Label required label={t("User Name")} htmlFor='name' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='name' placeholder={t("User Name")} />
                </Grid>

                {/* Company ID Field */}
                <Grid size={labelSize}>
                    <Label label={t("Company ID")} htmlFor='companyId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='companyId' placeholder={t("Company ID")} disabled />
                </Grid>

                {/* Role Field */}
                <Grid size={labelSize}>
                    <Label required label={t("Role")} htmlFor='role' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerSelect
                        disabled={editMode}
                        control={control}
                        keyName='role'
                        placeholder={t("Role")}
                        selectProps={{
                            options: roles.map((org) => ({
                                value: org.code,
                                label: org.name
                            }))
                        }}
                        onChangeField={(value) => {
                            setValue("roleId", value);
                        }}
                    />
                </Grid>

                {/* Scene Field */}
                <Grid size={labelSize}>
                    <Label label={t("Scene")} htmlFor='scene' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerAsyncSearchSelect
                        control={control}
                        keyName='scene'
                        placeholder={t("Scene")}
                        request={fetchScenes}
                        onchangeField={(value) => {
                            if (value) {
                                setValue("sceneId", value?.value as string);
                            }
                        }}
                    />
                    <ControllerInput hidden control={control} keyName='sceneId' placeholder={t("Scene ID")} />
                </Grid>

                {/* Role ID Field */}
                <Grid size={labelSize}>
                    <Label label={t("Role ID")} htmlFor='roleId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='roleId' placeholder={t("Role ID")} disabled />
                </Grid>

                {/* Task Field */}
                <Grid size={labelSize}>
                    <Label label={t("Task")} htmlFor='task' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='task' placeholder={t("Task")} />
                </Grid>

                {/* User ID Field */}
                <Grid size={labelSize}>
                    <Label required label={t("User ID")} htmlFor='userId' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='userId' placeholder={t("User ID")} disabled />
                </Grid>

                {/* Register date Field */}
                <Grid size={labelSize}>
                    <Label label={t("Register date")} htmlFor='startDate' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='startDate' placeholder={t("Register date")} disabled />
                </Grid>

                {/* Password Field */}
                <Grid size={labelSize}>
                    <Label required label={t("PW")} htmlFor='password' />
                </Grid>
                <Grid size={5}>
                    <ControllerInput
                        control={control}
                        keyName='password'
                        placeholder={t("PW")}
                        disabled
                        inputProps={{
                            type: "password"
                        }}
                    />
                </Grid>
                <Grid size={3}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='48px'
                        disabled={editMode}
                        onClick={fetchingUserId}
                        loading={isFetchingId}
                    >
                        {tCommon("Init")}
                    </Button>
                </Grid>
            </Grid>

            <Divider />

            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Phone number Field */}
                <Grid size={labelSize}>
                    <Label label={t("Phone number")} htmlFor='phone' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='phone' placeholder={t("Phone number")} />
                </Grid>

                {/* ID Kakao Field */}
                <Grid size={labelSize}>
                    <Label label={t("KakaoTalk ID")} htmlFor='kakao' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='kakao' placeholder={t("KakaoTalk ID")} />
                </Grid>

                {/* Email Field */}
                <Grid size={labelSize}>
                    <Label label={t("Email")} htmlFor='email' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='email' placeholder={t("Email")} />
                </Grid>

                {/* Telegram Field */}
                <Grid size={labelSize}>
                    <Label label={t("Telegram ID")} htmlFor='telegram' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='telegram' placeholder={t("Telegram ID")} />
                </Grid>

                {/* Token Field */}
                <ControllerInput hidden control={control} keyName='token' placeholder={t("Token")} />

                {editMode && (
                    <Grid size={24} textAlign={"end"}>
                        <Typography variant='body1' color='primary'>
                            {t("Notice note")}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Dialog>
    );
};
