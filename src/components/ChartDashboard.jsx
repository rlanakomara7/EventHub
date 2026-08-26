import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

import { MdSignalCellularAlt } from "react-icons/md";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

function ChartDashboard() {
  const values = [21, 38, 34, 56, 29, 28];
  const maxValues = Math.max(...values);

  const data = {
    labels: ["Mar", "Apr", "Mei", "Jun", "Jul", "Aug"],

    datasets: [
      {
        label: "Registration(6 months)",
        data: values,
        backgroundColor: values.map((value) =>
          value === maxValues ? "#F97316" : "#FED7AA",
        ),
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
      },

      datalabels: {
        anchor: "end",
        align: "top",
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 h-[280px] mt-5 w-lg ">
      <h2 className="flex items-center gap-2 font-semibold text-xl">
        {" "}
        <MdSignalCellularAlt />
        Registration 6 (month)
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartDashboard;
