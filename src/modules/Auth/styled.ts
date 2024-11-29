import { TextField as TextFieldMui, styled } from "@mui/material";

export const TextField = styled(TextFieldMui)`
    .MuiInputBase-root {
        height: 56px;
    }
`;

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
        background-image: url("/assets/images/login_bg.png");
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
        }
    }

    .login-logo {
        background-image: url("/assets/images/clever_link_logo.png");
        background-size: contain;
        height: 36px;
        width: 175px;
    }

    .btn-link {
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
    }
`;
