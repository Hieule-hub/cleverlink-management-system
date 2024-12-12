"use client";

import { useState } from "react";

import { Button, ContactInfoButton } from "@components/Button";
import { ControllerInput } from "@components/Controller";
import { Label } from "@components/Label";
import type { UserLoginReq } from "@interfaces/user";
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, styled } from "@mui/material";
import { useAppStore } from "@providers/AppStoreProvider";
import userService from "@services/user";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { ChangePasswordDialog, useChangePasswordDialog } from "./ChangePasswordDialog";

const StyledLoginPage = styled("div")`
    display: flex;
    height: 100vh;
    width: 100vw;

    .left-part {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0 24px;
        min-width: 700px;
    }

    .right-part {
        background-image: url("/assets/images/login_bg.png");
        background-size: cover;
        width: 100%;
        flex: 1;
    }

    @media screen and (max-width: 1024px) {
        .left-part {
            min-width: 100%;
        }
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
        width: 528px;

        .login-title {
            font-size: 36px;
            font-weight: 600;
            color: #081735;
        }

        .login-des {
            font-size: 16px;
            font-weight: 700;
            color: #8f95b2;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    }

    .login-logo {
        background-image: url("/assets/images/clever_link_logo.png");
        background-size: contain;
        height: 36px;
        width: 175px;
    }
`;

export const LoginPage = () => {
    const t = useTranslations("LoginPage");

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // visible password

    //Store controller
    const { fetUserInfo } = useAppStore((state) => state);
    const { openDialog } = useChangePasswordDialog();

    const { handleSubmit, control } = useForm<UserLoginReq>({
        defaultValues: {
            userId: "CIP0000001",
            password: "cip0000000"
        }
    });

    const handleLogin = () => {
        // e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            handleSubmit(async (data: UserLoginReq) => {
                try {
                    const response = await userService.userLogin(data);

                    if (!response.err) {
                        // login success
                        const { data } = response;
                        // console.log("🚀 ~ handleSubmit ~ data:", data);

                        localStorage.setItem("access-token", data.access);
                        Cookies.set("refresh-token", data.refresh, { expires: 7 });

                        const isFistLogin = !data?.passwordAt || data?.passwordAt === data.createdAt;

                        if (isFistLogin) {
                            openDialog();
                        } else {
                            fetUserInfo();
                        }
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

    return (
        <StyledLoginPage>
            <div className='left-part'>
                <div className='login-form'>
                    <div className='login-logo' />
                    <span className='login-title'>{t("Login title")}</span>
                    <span className='login-des'>{t("Thank you for your visit")}.</span>

                    <div className='field'>
                        <Label htmlFor='userId' label={t("Username")} />
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
                                type: showPassword ? "text" : "password",
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
                        // type='submit'
                        onClick={handleLogin}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {t("Login")}
                    </Button>

                    <ContactInfoButton margin={"auto"}>{t("Contact Us")}</ContactInfoButton>
                </div>
            </div>

            <div className='right-part' />

            <ChangePasswordDialog
                onClose={() => {
                    setTimeout(() => {
                        fetUserInfo();
                    }, 500);
                }}
            />
        </StyledLoginPage>
    );
};
