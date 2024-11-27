"use client";

import { ReactNode } from "react";

import { AbstractIntlMessages, IntlError, NextIntlClientProvider } from "next-intl";

export const IntErrorProvider = ({
    children,
    locale,
    messages
}: {
    children: ReactNode;
    locale: string;
    messages: AbstractIntlMessages;
}) => {
    const onError = (error: IntlError) => {
        if (error.code === "MISSING_MESSAGE") return;
        console.error(error);
    };
    return (
        <NextIntlClientProvider locale={locale} messages={messages} onError={onError}>
            {children}
        </NextIntlClientProvider>
    );
};
