"use client";

import { useState } from "react";

import { Button } from "@components/Button";
import { ContactInformationDialog } from "@components/ContactInformationDialog";
import { UserLoginReq } from "@interfaces/user";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import userService from "@services/user";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { ControllerInput } from "@/components/Controller";
import { Label } from "@/components/Label";

import { StyledLoginPage } from "./styled";

export const LoginPage = () => {
    const t = useTranslations("LoginPage");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // visible password
    const [openDialog, setOpenDialog] = useState(false); //show dialog

    const { setUserInfo } = useAppStore((state) => state);

    const { handleSubmit, control } = useForm<UserLoginReq>({
        defaultValues: {
            userId: "CIP0000001",
            password: "cip0000000"
        }
    });

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            handleSubmit(async (data: UserLoginReq) => {
                try {
                    const response = await userService.userLogin(data);

                    if (!response.err) {
                        // login success
                        const { data } = response;

                        setUserInfo({
                            _id: data._id,
                            userId: data.userId,
                            roleId: data.roleId,
                            name: data.name,
                            status: data.status,
                            __v: data.__v,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt
                        });

                        localStorage.setItem("access-token", data.access);
                        Cookies.set("refresh-token", data.refresh, { expires: 7 });
                    }
                } catch (error) {
                    console.log("🚀 ~ handleSubmit ~ error:", error);
                } finally {
                    setIsLoading(false);
                }
            })();
        }, 1000);
    };

    //handle visible password
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <StyledLoginPage>
            <form className='left-part' onSubmit={handleLogin}>
                <div className='login-form'>
                    <div className='login-logo' />
                    <span className='login-title'>AI CCTV {t("Clever link")}</span>
                    <span className='login-des'>{t("Thank you for your visit")}.</span>

                    <div className='field'>
                        <Label htmlFor='userId' label={t("Email address")} />
                        <ControllerInput
                            keyName='userId'
                            control={control}
                            placeholder={t("Enter username")}
                            inputProps={{
                                sx: {
                                    ".MuiInputBase-root": {
                                        height: "56px"
                                    }
                                },
                                slotProps: {
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <EmailOutlined sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        )
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className='field'>
                        <Label htmlFor='password' label={t("Password")} />
                        <ControllerInput
                            keyName='password'
                            control={control}
                            placeholder={t("Enter password")}
                            inputProps={{
                                sx: {
                                    ".MuiInputBase-root": {
                                        height: "56px"
                                    }
                                },
                                slotProps: {
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <LockOutlined sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={handleShowPassword}>
                                                    {showPassword ? (
                                                        <Visibility sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        <VisibilityOff sx={{ fontSize: 20 }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }
                            }}
                        />
                    </div>

                    <Button
                        fullWidth
                        height={"56px"}
                        color='primary'
                        type='submit'
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {t("Login")}
                    </Button>

                    <button className='btn-link' onClick={handleClickOpenDialog}>
                        {t("Contact us")}
                    </button>
                </div>
            </form>

            <div className='right-part' />
            <ContactInformationDialog openDialog={openDialog} closeDialog={handleCloseDialog} />
        </StyledLoginPage>
    );
};
