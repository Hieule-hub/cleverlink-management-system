"use client";

import { useState } from "react";

import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    CssBaseline,
    Grid2 as Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import { useTranslations } from "next-intl";

import { ContactInformationDialog } from "@components/ContactInformationDialog";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@components/Button";
import { StyledLoginPage } from "./styled";
import { InputMui } from "@/components/Input";

interface FormValues {
    username: string;
    password: string;
}

const Login = () => {
    const isFlexWindows = useMediaQuery("(max-width:1024px)");
    const t = useTranslations("LoginPage");
    const [isLoading, setIsLoading] = useState(false);
    // visible password
    const [showPassword, setShowPassword] = useState(false);

    //show dialog
    const [openDialog, setOpenDialog] = useState(false);

    const { handleSubmit, control } = useForm<FormValues>({
        defaultValues: {
            username: "CIP0000001",
            password: "cip0000000"
        }
    });

    interface LoginFormValues {
        username: string;
        password: string;
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            handleSubmit(async (data: LoginFormValues) => {
                console.log("🚀 ~ handleSubmit ~ data:", data);
                const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                    method: "POST",
                    body: JSON.stringify(data)
                });
                console.log("🚀 ~ handleSubmit ~ response:", response);

                setIsLoading(false);
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
                        <label htmlFor='username'>{t("Email address")}</label>

                        <Controller
                            control={control}
                            name='username'
                            render={({ field }) => (
                                <InputMui
                                    {...field}
                                    placeholder={t("Enter username")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <EmailOutlined sx={{ color: "", mr: 1 }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor='password'> {t("Password")}</label>

                        <Controller
                            control={control}
                            name='password'
                            render={({ field }) => (
                                <InputMui
                                    {...field}
                                    placeholder={t("Enter password")}
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <LockOutlined sx={{ color: "", mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={handleShowPassword}>
                                                    {showPassword ? (
                                                        <Visibility></Visibility>
                                                    ) : (
                                                        <VisibilityOff></VisibilityOff>
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>

                    <Button
                        style={{
                            marginTop: "20px",
                            height: "56px"
                        }}
                        fullWidth
                        color='primary'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : t("Login")}
                    </Button>

                    <button className='btn-contact-link' onClick={handleClickOpenDialog}>
                        {t("Contact us")}
                    </button>
                </div>
            </form>

            <div
                style={
                    {
                        // display: !isFlexWindows ? "none" : "block"
                    }
                }
                className='right-part'
            />
            <ContactInformationDialog openDialog={openDialog} closeDialog={handleCloseDialog} />
        </StyledLoginPage>
    );
};

export default Login;
