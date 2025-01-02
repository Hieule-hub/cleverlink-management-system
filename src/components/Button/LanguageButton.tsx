"use client";

import React, { useTransition } from "react";

import { useParams } from "next/navigation";

import { Dropdown } from "@components/Dropdown";
import { Locale, routing, usePathname, useRouter } from "@libs/i18n/routing";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { styled } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "./Button";

const LgButton = styled(Button)`
    font-size: 0.8rem;
    height: 38px;
    border-color: var(--palette-primary-main) !important;
    color: var(--palette-primary-main) !important;
`;

export const LanguageButton = () => {
    const router = useRouter();
    const t = useTranslations("LocaleSwitcher");
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const pathname = usePathname();
    const params = useParams();

    const handleSelectItem = (item: any) => {
        if (item.key) {
            const nextLocale = item.key as Locale;
            startTransition(() => {
                router.replace(
                    // @ts-expect-error -- TypeScript will validate that only known `params`
                    // are used in combination with a given `pathname`. Since the two will
                    // always match for the current route, we can skip runtime checks.
                    { pathname, params },
                    { locale: nextLocale }
                );
            });
        }
    };

    const getLanguageLabel = (key: string) => {
        switch (key) {
            case "en":
                return "English";
            case "ko":
                return "한국어";
            default:
                return "";
        }
    };

    return (
        <React.Fragment>
            <Dropdown
                menu={routing.locales.map((cur) => ({
                    label: t("locale", { locale: cur }),
                    key: cur
                }))}
                selectedItem={locale}
                onSelectItem={handleSelectItem}
                menuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    }
                }}
            >
                <LgButton disabled={isPending} endIcon={ExpandMoreOutlined}>
                    {getLanguageLabel(locale)}
                </LgButton>
            </Dropdown>
        </React.Fragment>
    );
};
