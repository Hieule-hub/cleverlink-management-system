import { styled } from "@mui/material";

const StyledSpinner = styled("div")`
    width: 45px;
    aspect-ratio: 1;
    --_c: no-repeat radial-gradient(farthest-side, var(--palette-primary-main) 92%, #0000);
    background:
        var(--_c) top,
        var(--_c) left,
        var(--_c) right,
        var(--_c) bottom;
    background-size: 12px 12px;
    animation: l7 0.4s infinite linear;

    @keyframes l7 {
        to {
            transform: rotate(180deg);
        }
    }
`;

export const Spinner = () => {
    return <StyledSpinner />;
};
