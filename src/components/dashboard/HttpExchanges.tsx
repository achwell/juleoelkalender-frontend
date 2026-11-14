import H2 from "@/components/layout/H2";
import type Exchange from "@/types/dashboard/Exchange";
import { useMemo } from "react";
import { getBackgroundColor, processExchanges } from "@/utils/graphUtils";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EMPTY_EXCHANGES: Exchange[] = [];

const HttpExchanges = ({ exchanges = EMPTY_EXCHANGES }: { exchanges?: Exchange[] }) => {
  const { t } = useTranslation();

  const { uris, statusCodes, counts } = useMemo(() => processExchanges(exchanges), [exchanges]);

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
