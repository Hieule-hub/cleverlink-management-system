import React, { useState } from "react";

import { Button } from "@components/Button";
import { Dialog } from "@components/Dialog";
import { Box, BoxProps, Link, Zoom, styled } from "@mui/material";
import { useTranslations } from "next-intl";

import { contacts } from "@/configs/contacts";

const ButtonLink = styled("button")`
    outline: none;
    text-align: center;
    background-image: none;
    background: transparent;
    cursor: pointer;
    border: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.5px;
    text-decoration-line: underline;
    text-decoration-style: solid;
    margin: auto;
    transition: color 0.3s ease;

    &:hover {
        color: var(--palette-info-main);
    }
`;

interface ContactInfoButtonProps extends BoxProps {
    children?: React.ReactNode;
}

export const ContactInfoButton = ({ children, ...props }: ContactInfoButtonProps) => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const t = useTranslations();

    const handleClickOpenDialog = () => {
        setIsOpenDialog(true);
    };

    const onCloseDialog = () => {
        setIsOpenDialog(false);
    };

    return (
        <Box {...props}>
            <ButtonLink type='button' onClick={handleClickOpenDialog}>
                {children}
            </ButtonLink>
            <Dialog
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        maxWidth: "100%",
                        width: "640px",
                        height: "auto"
                    }
                }}
                open={isOpenDialog}
                onClose={onCloseDialog}
                title={t("LoginPage.Contact Us")}
                footer={
                    <Button height='36px' onClick={onCloseDialog}>
                        {t("Common.Close")}
                    </Button>
                }
            >
                <Box padding={2} display='flex' flexDirection='column' gap={2}>
                    {contacts.map((contact, index) => {
                        const content = t(contact.text);
                        const type = contact.type || "text";

                        return (
                            <Box key={index} display='flex' alignItems='center' gap={2}>
                                <contact.icon />
                                {type === "text" && <div>{content}</div>}
                                {type === "link" && (
                                    <Link target='_blank' href={content}>
                                        {content}
                                    </Link>
                                )}
                                {type === "phone" && <Link href={`tel:${content}`}>{content}</Link>}
                                {type === "email" && <Link href={`mailto:${content}`}>{content}</Link>}
                            </Box>
                        );
                    })}
                </Box>
            </Dialog>
        </Box>
    );
};
