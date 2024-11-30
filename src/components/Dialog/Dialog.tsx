import React from "react";

import { Close } from "@mui/icons-material";
import { Dialog as DialogMui, IconButton, styled } from "@mui/material";
import { DialogProps as DialogPropsMui } from "@mui/material/Dialog";

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
    }

    .footer {
        height: 60px;
        display: flex;
        justify-content: flex-end;
        padding: 0 16px;
        align-items: center;
        border-top: 1px solid ${({ theme }) => theme.palette.divider};
    }
`;

interface DialogProps extends Omit<DialogPropsMui, "title"> {
    title?: React.ReactNode;
    footer?: React.ReactNode;
}

export const Dialog = ({ title, footer, children, ...props }: DialogProps) => {
    return (
        <DialogStyled closeAfterTransition={false} {...props}>
            <div className='header'>
                <div className='title'>{title}</div>
                <IconButton size='small' aria-label='close' onClick={() => props.onClose?.({}, "escapeKeyDown")}>
                    <Close />
                </IconButton>
            </div>
            <div className='body'>{children}</div>
            {footer && <div className='footer'>{footer}</div>}
        </DialogStyled>
    );
};
