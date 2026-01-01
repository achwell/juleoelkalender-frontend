import H2 from "@/components/layout/H2";
import { useAppSelector } from "@/redux/hooks";
import { getBackgroundColor, processExchanges } from "@/utils/graphUtils";
import {
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HttpExchanges = () => {
    const { t } = useTranslation();
    const { httpexchanges } = useAppSelector((state) => state.dashboardState);

    const { uris, statusCodes, counts } = processExchanges(httpexchanges);

    const data: ChartData<"bar"> = {
        labels: uris,
        datasets: statusCodes.map((statusCode) => ({
            label: `Status ${statusCode}`,
            data: counts[statusCode], // give each status a distinct backgroundColor (you can improve this)
            backgroundColor: getBackgroundColor(statusCode),
            borderColor: "white",
            borderWidth: 1,
            stack: "response", // same stack for all so they’ll stack together
        })),
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Response Codes per URI",
            },
            legend: {
                position: "top",
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <H2>{t("pages.dashboard.charts.calls")}</H2>
            <Bar options={options} data={data} />
        </div>
    );
};
export default HttpExchanges;
