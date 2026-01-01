import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useTranslation } from "react-i18next";

const UnauthorizePage = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex flex-row justify-end items-end">
                <LanguageSelector />
            </div>
            <H1>{t("pages.403.header")}</H1>
        </>
    );
};

export default UnauthorizePage;
