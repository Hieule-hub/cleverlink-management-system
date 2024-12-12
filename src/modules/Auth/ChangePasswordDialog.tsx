import { useState } from "react";

import { ControllerInput } from "@components/Controller";
import { Dialog } from "@components/Dialog";
import { Label } from "@components/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@interfaces/user";
import { Grid2 as Grid, Zoom } from "@mui/material";
import userService from "@services/user";
import { dialogStore } from "@store/dialogStore";
import { toast } from "@store/toastStore";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const useChangePasswordDialog = dialogStore<User>();

interface ChangePasswordDialogProps {
    onClose?: (status?: string) => void;
}

const labelSize = 4;
const inputSize = 8;

type FormDeviceValues = Partial<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}>;

const initFormValues: FormDeviceValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
};

export const ChangePasswordDialog = ({ onClose = () => "" }: ChangePasswordDialogProps) => {
    const t = useTranslations();
    const { item, open, closeDialog } = useChangePasswordDialog();

    const [isLoading, setIsLoading] = useState(false);

    const resolver = yup.object({
        confirmPassword: yup
            .string()
            .required(t("LoginPage.Confirm password is required"))
            .oneOf([yup.ref("newPassword"), null], t("LoginPage.Passwords must match")),
        newPassword: yup.string().required(t("LoginPage.New password is required")),
        oldPassword: yup.string().required(t("LoginPage.Old password is required"))
    });

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<FormDeviceValues>({
        resolver: yupResolver(resolver) as any,
        defaultValues: initFormValues
    });

    const handleClose = (status?: string) => {
        onClose(status);
        closeDialog();
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

        handleSubmit(async (data: FormDeviceValues) => {
            // console.log("🚀 ~ handleSubmit ~ data:", data);
            setIsLoading(true);

            try {
                const response = await userService.userUpdatePassword({
                    oldPassword: data.oldPassword as string,
                    newPassword: data.newPassword as string
                });
                if (!response.err) {
                    toast.success({ title: t("LoginPage.Update password success") });
                    handleClose("success");
                } else {
                    // toast.error({ title: t("LoginPage.Create record failed") });
                }
            } catch (error) {
                console.log("🚀 ~ handleSubmit ~ error:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    return (
        <Dialog
            aria-describedby='device-dialog-description'
            aria-labelledby='device-dialog-title'
            TransitionComponent={Zoom}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: "550px",
                    height: "auto"
                }
            }}
            open={open}
            title={t("LoginPage.Change password")}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={handleSave}
            loading={isLoading}
        >
            <Grid padding={2} width='100%' gap={2} container spacing={2} columns={12} alignItems='center'>
                {/* Old password Field */}
                <Grid size={labelSize}>
                    <Label label={t("LoginPage.Old password")} htmlFor='oldPassword' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='oldPassword'
                        placeholder={t("LoginPage.Enter old password")}
                    />
                </Grid>

                {/* New password Field */}
                <Grid size={labelSize}>
                    <Label label={t("LoginPage.New password")} htmlFor='newPassword' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='newPassword'
                        placeholder={t("LoginPage.Enter new password")}
                    />
                </Grid>

                {/* Confirm password Field */}
                <Grid size={labelSize}>
                    <Label label={t("LoginPage.Re-enter password")} htmlFor='confirmPassword' />
                </Grid>
                <Grid size={inputSize}>
                    <ControllerInput
                        control={control}
                        keyName='confirmPassword'
                        placeholder={t("LoginPage.Re-enter new password")}
                    />
                </Grid>
            </Grid>
        </Dialog>
    );
};
