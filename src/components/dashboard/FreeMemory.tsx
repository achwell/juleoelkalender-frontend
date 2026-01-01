import Alert from "@/components/Alert";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const FreeMemory: FC<{ freeMemory: number }> = ({ freeMemory }) => {
    const { t } = useTranslation();
    return (
        <Alert
            severity={freeMemory > 1 ? "success" : freeMemory > 0.75 ? "warning" : "error"}
            text={`${t("pages.dashboard.freememory")}: ${freeMemory.toFixed(2)}GB`}
        />
    );
};
export default FreeMemory;
