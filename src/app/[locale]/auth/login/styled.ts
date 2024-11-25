import { styled } from "@mui/material";

export const StyledLoginPage = styled("div")`
    display: flex;
    height: 100vh;
    width: 100vw;

    .left-part {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 0 24px;
    }

    .right-part {
        background: url("/assets/images/login_bg.png") no-repeat center center;
        background-size: cover;
        width: 100%;
        flex: 1;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
        width: 500px;
        padding: 0 24px;

        .login-title {
            font-size: 36px;
            font-weight: 600;
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

            label {
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
            }
        }
    }

    .login-logo {
        background: url("/assets/images/clever_link_logo.png") no-repeat center center;
        height: 36px;
        width: 175px;
    }

    .btn-contact-link {
        outline: none;
        position: relative;
        display: inline-flex;
        gap: var(--ant-margin-xs);
        align-items: center;
        justify-content: center;
        font-weight: var(--ant-button-font-weight);
        white-space: nowrap;
        text-align: center;
        background-image: none;
        background: transparent;
        border: var(--ant-line-width) var(--ant-line-type) transparent;
        cursor: pointer;
        transition: all var(--ant-motion-duration-mid) var(--ant-motion-ease-in-out);
        user-select: none;
        touch-action: manipulation;
        color: var(--ant-color-text);
    }
`;
