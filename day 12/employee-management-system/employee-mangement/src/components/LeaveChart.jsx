import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";
import { useContext } from "react";
import { LeaveContext } from "../context/LeaveContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function LeaveChart() {
  const { leaves } = useContext(LeaveContext);

  const pending = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approved = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  const data = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [pending, approved, rejected],
        backgroundColor: [
          "#F39C12",
          "#2ECC71",
          "#E74C3C",
        ],
      },
    ],
  };

  return (
    <div className="chart-box">
      <h3>Leave Status</h3>
      <Pie data={data} />
    </div>
  );
}