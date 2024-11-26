import { ReactNode } from "react";

import ProtectedLayout from "@components/Layout/ProtectedLayout";

type ProtectedLayoutProps = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: ProtectedLayoutProps) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
