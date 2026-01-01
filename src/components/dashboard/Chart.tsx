import ChartData from "@/types/dashboard/ChartData";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { FC } from "react";
import { Bar } from "react-chartjs-2";

interface Props {
    header: string;
    chartData: ChartData[];
}

const Chart: FC<Props> = ({ header, chartData }) => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const labels = chartData.map((c) => c.name);
    const data = {
        labels,
        datasets: [
            {
                label: header,
                data: chartData.map((c) => c.value),
                backgroundColor: "#0084E7",
            },
        ],
    };

    if (!chartData || chartData.length < 1) return null;
    return (
        <div>
            <Bar
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top" as const,
                        },
                        title: {
                            display: false,
                            text: header,
                        },
                    },
                }}
                data={data}
            />
            ;
        </div>
    );
};

export default Chart;
