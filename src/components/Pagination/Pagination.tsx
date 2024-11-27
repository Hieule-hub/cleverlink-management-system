import { ArrowBack } from "@mui/icons-material";
import {
    PaginationItem,
    Pagination as PaginationMui,
    PaginationProps as PaginationPropsMui,
    Paper,
    styled
} from "@mui/material";
import { useTranslations } from "next-intl";

const StyledPagination = styled(PaginationMui)`
    li {
        :first-of-type {
            border-left: none;
        }
        border-left: 1px solid #e0e0e0;
    }
`;
const StyledPaginationItem = styled(PaginationItem)`
    border-radius: 0;
    height: 40px;
    min-width: 40px;
    font-size: 0.875rem;
    margin: 0;
    line-height: 40px;

    .arrow-button {
        font-size: 0.875rem;
        width: 100%;
        height: 100%;
        border-radius: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
    }

    svg {
        font-size: 18px;
    }
`;

// interface PaginationProps extends PaginationPropsMui {}

export const Pagination = (props: PaginationPropsMui) => {
    const tCommon = useTranslations("Common");

    return (
        <Paper
            variant='outlined'
            style={{
                borderRadius: "8px"
            }}
        >
            <StyledPagination
                {...props}
                renderItem={(item) => (
                    <StyledPaginationItem
                        slots={{
                            previous: () => (
                                <div className='arrow-button'>
                                    <ArrowBack />
                                    &nbsp;
                                    {tCommon("Previous")}
                                </div>
                            ),
                            next: () => (
                                <div className='arrow-button'>
                                    {tCommon("Next")}
                                    &nbsp;
                                    <ArrowBack
                                        style={{
                                            transform: "rotate(180deg)"
                                        }}
                                    />
                                </div>
                            )
                        }}
                        {...item}
                    />
                )}
            />
        </Paper>
    );
};
