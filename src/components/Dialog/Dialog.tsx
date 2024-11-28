"use client";

import RcDialog from "rc-dialog";

export const Dialog = ({ children, ...props }) => {
    return <RcDialog {...props}>{children}</RcDialog>;
};
