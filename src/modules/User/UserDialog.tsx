import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@components/Button";
import { ControllerAsyncSearchSelect, ControllerInput, ControllerSelect, type Option } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { DEFAULT_PASSWORD } from "@configs/app";
import { useYupLocale } from "@configs/yupConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@interfaces/user";
import { Divider, Grid2 as Grid, Typography, Zoom } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import companyService from "@services/company";
import sceneService from "@services/scene";
import userService from "@services/user";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import { RoleCode } from "common";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useConfirm } from "@/store/useConfirm";

export const useUserDialog = dialogStore<User>();

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
    company: null,
    companyId: "",
    scene: null,
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

    const { yup, translateRequiredMessage, translateInvalidMessage } = useYupLocale({
        page: "UserPage"
    });

    const roles = useAppStore((state) => state.roles);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingId, setIsFetchingId] = useState(false);

    const { item, open, closeDialog, readonly } = useUserDialog();
    const { startConfirm } = useConfirm();

    const editMode = useMemo(() => Boolean(item), [item]);
    const dialogTitle = useMemo(() => {
        if (readonly) {
            return t("Detail record");
        }

        return editMode ? t("Edit record") : t("Add new record");
    }, [editMode, t, readonly]);

    const roleOptions = useMemo(
        () =>
            roles.map((org) => ({
                value: org.code,
                label: `${org.code} (${org.name})`
            })),
        [roles]
    );

    const resolver = yup.object({
        userId: yup.string().required(translateRequiredMessage("User ID")),
        password: yup.string().required(translateRequiredMessage("PW")),
        name: yup.string().required(translateRequiredMessage("User Name")),
        role: yup.string().required(translateRequiredMessage("Role")),
        email: yup.string().email(translateInvalidMessage("Email")),
        company: yup
            .object()
            .nullable()
            .when("role", {
                is: (val) => ["TU", "BU", "GU"].includes(val),
                then(schema) {
                    return schema.required(translateRequiredMessage("Company"));
                },
                otherwise(schema) {
                    return schema.nullable();
                }
            }),
        scene: yup.object().when("role", {
            is: (val) => val === "BU" || val === "GU",
            then(schema) {
                return schema.required(translateRequiredMessage("Scene"));
            },
            otherwise(schema) {
                return schema.nullable();
            }
        })
    });

    const { handleSubmit, control, getValues, setValue, reset, watch, clearErrors } = useForm<FormUserValues>({
        resolver: yupResolver(resolver) as any,
        defaultValues: initFormValues
    });

    useEffect(() => {
        //fill form with user data
        if (item) {
            const newValue: FormUserValues = {
                ...initFormValues,
                userId: item.userId,
                password: "11111111",
                name: item.name,

                role: item.roleId?.code,
                roleId: item.roleId?.code,
                company: { label: item.company?.name, value: item.company?._id },
                companyId: item.company?.companyId,
                scene: { label: item.scene?.name, value: item.scene?._id },
                sceneId: item.scene?._id,
                task: item?.task || initFormValues.task,
                phone: item?.phone || initFormValues.phone,
                email: item?.email || initFormValues.email,
                kakao: item?.kakao || initFormValues.kakao,
                telegram: item?.telegram || initFormValues.telegram,
                startDate: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
            };

            reset(newValue);
        } else {
            reset(initFormValues);
        }
    }, [item, reset]);

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
    };

    const handleSave = () => {
        handleSubmit(async (data: FormUserValues) => {
            console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                if (item) {
                    const response = await userService.editUser({
                        userId: item._id,
                        name: data.name,
                        sceneId: data.sceneId || "DEFAULT",
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
                        companyId: (data.company?.value || "DEFAULT") as string,
                        sceneId: data.sceneId || "DEFAULT",
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

        if (!roleId) {
            toast.error({ title: translateRequiredMessage("Role") });
            return;
        }

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
                clearErrors("userId");
                setValue("token", token);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingId(false);
        }
    };

    const companySelected = watch("company");
    const roleSelected = watch("role");

    const fetchScenes = useCallback(
        (query: string) => {
            return sceneService
                .getSceneList({
                    filters: query,
                    limit: 10,
                    page: 1,
                    companyId: (companySelected?.value || "") as string,
                    sortField: "name",
                    sortOrder: "asc"
                })
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
        [companySelected]
    );

    const fetchCompanies = useCallback((query: string) => {
        return companyService
            .getCompanyList({ filters: query, limit: 10, page: 1, sortField: "name", sortOrder: "asc" })
            .then((res) => {
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

    const handleResetPassword = async () => {
        if (!item) {
            setValue("password", DEFAULT_PASSWORD);
            clearErrors("password");
            return;
        }

        startConfirm({
            title: t("Reset password"),
            color: "primary",
            onConfirm: async () => {
                try {
                    setIsLoading(true);

                    const response = await userService.userResetPassword({
                        userId: item._id
                    });

                    if (!response.err) {
                        toast.success({ title: t("Reset password success") });
                        setValue("password", DEFAULT_PASSWORD);
                        clearErrors("password");
                    } else {
                        // toast.error({ title: t("Reset password failed") });
                    }
                } catch (error) {
                    console.log("🚀 ~ handleResetPassword ~ error:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

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
            title={dialogTitle}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
            hiddenOk={readonly}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={24} alignItems='center'>
                {/* Company Field */}
                <Grid size={labelSize}>
                    <Label label={t("Company")} htmlFor='company' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerAsyncSearchSelect
                        disabled={readonly || editMode || roleSelected === "CIP"}
                        control={control}
                        keyName='company'
                        placeholder={t("Company")}
                        request={fetchCompanies}
                        onchangeField={(value) => {
                            setValue("companyId", (value?.id || "") as string);

                            //reset scene
                            setValue("scene", null);
                            setValue("sceneId", "");
                            clearErrors("scene");
                        }}
                    />
                </Grid>

                {/* User name Field */}
                <Grid size={labelSize}>
                    <Label required label={t("User Name")} htmlFor='name' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='name'
                        placeholder={t("User Name")}
                        disabled={readonly}
                    />
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
                        disabled={editMode || readonly}
                        control={control}
                        keyName='role'
                        placeholder={t("Role")}
                        selectProps={{
                            options: roleOptions
                        }}
                        onChangeField={(value) => {
                            setValue("roleId", value);

                            if (value === "CIP") {
                                setValue("company", null);
                                clearErrors("company");
                                setValue("companyId", "");

                                setValue("scene", null);
                                setValue("sceneId", "");
                                clearErrors("scene");
                            }

                            if (value === "TU") {
                                setValue("scene", null);
                                setValue("sceneId", "");
                                clearErrors("scene");
                            }
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
                        disabled={!companySelected || ["CIP", "TU"].includes(roleSelected) || readonly}
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
                    <ControllerInput control={control} keyName='task' placeholder={t("Task")} disabled={readonly} />
                </Grid>

                {/* User ID Field */}
                <Grid size={labelSize}>
                    <Label required label={t("User ID")} htmlFor='userId' />
                </Grid>
                <Grid size={inputSize - 3}>
                    <ControllerInput control={control} keyName='userId' placeholder={t("User ID")} disabled />
                </Grid>
                <Grid size={3} alignSelf={"start"}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='51px'
                        disabled={editMode || readonly}
                        onClick={fetchingUserId}
                        loading={isFetchingId}
                    >
                        {tCommon("Create ID")}
                    </Button>
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
                <Grid size={inputSize - 3}>
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
                <Grid size={3} alignSelf={"start"}>
                    <Button
                        color='primary'
                        style={{
                            width: "100%"
                        }}
                        height='51px'
                        disabled={readonly}
                        onClick={handleResetPassword}
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
                    <ControllerInput
                        control={control}
                        keyName='phone'
                        placeholder={t("Phone number")}
                        disabled={readonly}
                    />
                </Grid>

                {/* ID Kakao Field */}
                <Grid size={labelSize}>
                    <Label label={t("KakaoTalk ID")} htmlFor='kakao' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='kakao'
                        placeholder={t("KakaoTalk ID")}
                        disabled={readonly}
                    />
                </Grid>

                {/* Email Field */}
                <Grid size={labelSize}>
                    <Label label={t("Email")} htmlFor='email' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput control={control} keyName='email' placeholder={t("Email")} disabled={readonly} />
                </Grid>

                {/* Telegram Field */}
                <Grid size={labelSize}>
                    <Label label={t("Telegram ID")} htmlFor='telegram' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='telegram'
                        placeholder={t("Telegram ID")}
                        disabled={readonly}
                    />
                </Grid>

                {/* Token Field */}
                <ControllerInput
                    hidden
                    control={control}
                    keyName='token'
                    placeholder={t("Token")}
                    disabled={readonly}
                />

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
