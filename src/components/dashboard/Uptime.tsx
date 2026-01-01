import Alert from "@/components/Alert";
import { secondsToDhms } from "@/utils";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Uptime: FC<{ processUptime: number }> = ({ processUptime }) => {
    const { t } = useTranslation();
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        if (processUptime) {
            setUptime(processUptime);
        }
    }, [processUptime]);
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime((prevState) => prevState + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return <Alert severity="success" text={`${t("pages.dashboard.uptime")}: ${secondsToDhms(t, uptime)}`} />;
};
export default Uptime;
