import { styled } from "@mui/material";

const StyledInput = styled("input")`
    font-size: inherit;
    border: none;
    border-radius: 0;
    outline: none;
    background: transparent;
    color: inherit;
    padding: 0;
    text-overflow: ellipsis;
    list-style: none;
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
`;

const StyleLayoutInput = styled("span")`
    padding: 7px 11px;
    border: 1px solid var(--input-border-color);
    color: #667085;
    border-radius: var(--shape-borderRadius);
    font-size: 1rem;
    transition: all 0.2s ease;
    display: inline-flex;
    width: 100%;
    min-width: 0;
    position: relative;
    background-color: #fff;
    box-sizing: border-box;

    span {
        display: flex;
        align-items: center;
        flex: none;
        margin-inline-end: 4px;
        box-sizing: border-box;
    }

    /* ::before {
		display: inline-block;
		width: 0;
		visibility: hidden;
		content: '\a0';
		box-sizing: border-box;
	} */

    &:focus-within {
        border-color: #667085;
        outline: none;
    }

    &:hover {
        border-color: #667085;
    }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = ({ icon, style, ...props }: InputProps) => {
    return (
        <StyleLayoutInput style={style}>
            {icon && <span>{icon}</span>}
            <StyledInput {...props} />
        </StyleLayoutInput>
    );
};
