"use client";

import { redirect } from "next/navigation";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Button } from "./Button";

export default function NotFoundPage() {
    const t = useTranslations("NotFoundPage");

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                minHeight: "100vh"
            }}
        >
            <Typography variant='h1' color='primary'>
                404
            </Typography>

            <Typography variant='h6' color='primary'>
                {t("title")}
            </Typography>
            {/* <Typography variant='h6' color='primary'>
                <p>{t("description")}</p>
            </Typography> */}
            <Button
                color='primary'
                onClick={() => {
                    redirect("/");
                }}
                style={{
                    marginTop: 20
                }}
            >
                Back Home
            </Button>
        </Box>
    );
}
