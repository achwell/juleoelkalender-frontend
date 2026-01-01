import Alert from "@/components/Alert";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const CpuLoad: FC<{ cpuLoad: number }> = ({ cpuLoad }) => {
    const { t } = useTranslation();
    return (
        <Alert
            severity={cpuLoad < 60 ? "success" : cpuLoad < 80 ? "warning" : "error"}
            text={`${t("pages.dashboard.cpuload")}: ${cpuLoad.toFixed(2)}%`}
        />
    );
};
export default CpuLoad;
