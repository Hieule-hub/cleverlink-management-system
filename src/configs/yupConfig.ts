import { useTranslations } from "next-intl";
import * as yup from "yup";

interface YupLocaleProps {
    page?: string;
}

export const useYupLocale = (props?: YupLocaleProps) => {
    const t = useTranslations("Validation");

    const page = props?.page ? props.page : "";
    const tPage = useTranslations(page);

    const translateRequiredMessage = (path: string) => t("required", { path: tPage(path) });

    const translateInvalidMessage = (path: string) => t("invalid", { path: tPage(path) });

    return { yup, translateRequiredMessage, translateInvalidMessage };
};
