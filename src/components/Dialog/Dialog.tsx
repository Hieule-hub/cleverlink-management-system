import React from "react";

import { Button } from "@components/Button";
import { Close } from "@mui/icons-material";
import { Dialog as DialogMui, IconButton, styled } from "@mui/material";
import { DialogProps as DialogPropsMui } from "@mui/material/Dialog";
import { useTranslations } from "next-intl";

const DialogStyled = styled(DialogMui)`
    .header {
        display: flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background-color: #f1f1f1;
        border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

        .title {
            font-size: 16px;
            font-weight: 600;
        }
    }

    .body {
        width: 100%;
        overflow-y: auto;
        max-height: calc(100vh - 200px);
    }

    .footer {
        height: 60px;
        display: flex;
        justify-content: flex-end;
        padding: 16px;
        align-items: center;
        border-top: 1px solid ${({ theme }) => theme.palette.divider};
        background-color: white;
    }
`;

interface DialogProps extends Omit<DialogPropsMui, "title"> {
    title?: React.ReactNode;
    footer?: React.ReactNode;
    showFooter?: boolean;
    cancelText?: string;
    okText?: string;
    loading?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    hiddenOk?: boolean;
}

export const Dialog = ({
    title,
    footer,
    showFooter = true,
    onCancel = () => "",
    onOk = () => "",
    hiddenOk,
    loading,
    children,
    ...props
}: DialogProps) => {
    const t = useTranslations("Common");

    return (
        <DialogStyled closeAfterTransition={false} {...props}>
            <div className='header'>
                <div className='title'>{title}</div>
                <IconButton
                    size='small'
                    aria-label='close'
                    onClick={() => !loading && props.onClose?.({}, "escapeKeyDown")}
                >
                    <Close />
                </IconButton>
            </div>
            <div className='body'>{children}</div>
            {showFooter && (
                <div className='footer'>
                    {footer ? (
                        footer
                    ) : (
                        <React.Fragment>
                            <Button
                                height='36px'
                                onClick={onCancel}
                                style={{
                                    marginRight: "8px"
                                }}
                            >
                                {props.cancelText || t("Cancel")}
                            </Button>
                            {!hiddenOk && (
                                <Button height='36px' loading={loading} onClick={onOk} color='primary'>
                                    {props.okText || t("Save")}
                                </Button>
                            )}
                        </React.Fragment>
                    )}
                </div>
            )}
        </DialogStyled>
    );
};
