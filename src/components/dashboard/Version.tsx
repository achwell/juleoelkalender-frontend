import Paragraph from "@/components/layout/Paragraph";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const Version: FC<{ backendVersion: string; backendBuildTime: Date | string | null }> = ({
    backendVersion,
    backendBuildTime,
}) => {
    const { t } = useTranslation();
    const bbt = typeof backendBuildTime === "string" ? parseISO(backendBuildTime) : backendBuildTime;
    return (
        <>
            {APP_VERSION && (
                <Paragraph>
                    {t("pages.dashboard.versions.frontend")}: {APP_VERSION}
                </Paragraph>
            )}
            {backendVersion && (
                <Paragraph>
                    {t("pages.dashboard.versions.backend")}: {backendVersion}
                </Paragraph>
            )}
            {bbt && (
                <Paragraph>
                    {t("pages.dashboard.versions.backendbuilt")}: {format(bbt, t("common.dateformat"))}
                </Paragraph>
            )}
        </>
    );
};
export default Version;
