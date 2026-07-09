import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EmployeeChart() {
  const { employees } = useContext(EmployeeContext);

  const departmentData = {};

  employees.forEach((emp) => {
    departmentData[emp.department] =
      (departmentData[emp.department] || 0) + 1;
  });

  const data = {
    labels: Object.keys(departmentData),
    datasets: [
      {
        label: "Employees",
        data: Object.values(departmentData),
        backgroundColor: "#009688",
      },
    ],
  };

  return (
    <div className="chart-box">
      <h3>Employees by Department</h3>
      <Bar data={data} />
    </div>
  );
}