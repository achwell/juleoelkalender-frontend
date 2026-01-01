import Alert, { AlertColor } from "@/components/Alert";
import { HealthStatus } from "@/redux/features/dashboardSlice";
import { translateStatus } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    header: string;
    status: HealthStatus;
}

const StatusBox: FC<Props> = ({ status, header }) => {
    const { t } = useTranslation();
    let severity: AlertColor = "success";
    switch (status) {
        case "UP":
            severity = "success";
            break;
        case "OUT_OF_SERVICE":
            severity = "warning";
            break;
        case "DOWN":
            severity = "error";
            break;
        case "UNKNOWN":
            break;
    }
    return <Alert severity={severity} text={`${header}: ${translateStatus(t, status)}`} />;
};

export default StatusBox;
