import Alert from "@/components/Alert";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const DiskUsage: FC<{ diskUsage: number; freeDiskSpace: number }> = ({ diskUsage, freeDiskSpace }) => {
    const { t } = useTranslation();
    return (
        <Alert
            severity={diskUsage > 25 ? "success" : diskUsage > 10 ? "warning" : "error"}
            text={`${t("pages.dashboard.freedisk")}: ${freeDiskSpace.toFixed(2)}GB (${diskUsage.toFixed(2)}%`}
        />
    );
};
export default DiskUsage;
