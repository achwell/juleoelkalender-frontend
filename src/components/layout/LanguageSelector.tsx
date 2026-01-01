import { ReactNode } from "react";
import { No, Us } from "react-flags-select";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const LANGUAGES: ReactNode[] = [
        <button
            key="lng.no"
            aria-label="open drawer"
            onClick={() => i18n.changeLanguage("no")}
            className="mr-2 pl-2 text-inherit bg-transparent border-none cursor-pointer"
        >
            <No key="no" className="flag" />
        </button>,
        <button
            key="lng.en"
            aria-label="open drawer"
            onClick={() => i18n.changeLanguage("en")}
            className="mr-2 pl-2 text-inherit bg-transparent border-none cursor-pointer"
        >
            <Us key="en" className="flag" />
        </button>,
    ];
    return <div className="flex justify-between">{LANGUAGES.map((icon) => icon)}</div>;
};
export default LanguageSelector;
