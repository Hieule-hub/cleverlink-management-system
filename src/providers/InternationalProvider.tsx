"use client";

import { NextIntlClientProvider, AbstractIntlMessages, IntlError } from "next-intl";
import { ReactNode } from "react";

interface InternationalProviderProps {
    children: ReactNode;
    message: AbstractIntlMessages;
    locale: string;
}

const timeZone = "UTC";

export const InternationalProvider = ({ children, message, locale }: InternationalProviderProps) => {
    const onError = (error: IntlError) => {
        if (error.code === "MISSING_MESSAGE") return;
        console.error(error);
    };

    return (
        <NextIntlClientProvider timeZone={timeZone} locale={locale} messages={message} onError={onError}>
            {children}
        </NextIntlClientProvider>
    );
};
