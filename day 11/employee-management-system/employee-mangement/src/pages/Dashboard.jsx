import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import DashboardCard from "../components/DashboardCard";

import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaMale,
  FaFemale,
  FaUserTie,
} from "react-icons/fa";

export default function Dashboard() {
  const { employees } = useContext(EmployeeContext);

  // Total Employees
  const totalEmployees = employees.length;

  // Total Salary
  const totalSalary = employees.reduce(
    (total, emp) => total + Number(emp.salary || 0),
    0
  );

  // Total Departments
  const totalDepartments = new Set(
    employees.map((emp) => emp.department)
  ).size;

  // Male Count
  const maleEmployees = employees.filter(
    (emp) => emp.gender === "Male"
  ).length;

  // Female Count
  const femaleEmployees = employees.filter(
    (emp) => emp.gender === "Female"
  ).length;

  // Highest Salary
  const highestSalary =
    employees.length > 0
      ? Math.max(...employees.map((emp) => Number(emp.salary)))
      : 0;

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="cards">

        <DashboardCard
          title="Employees"
          value={totalEmployees}
          icon={<FaUsers />}
          color="#009688"
        />

        <DashboardCard
          title="Departments"
          value={totalDepartments}
          icon={<FaBuilding />}
          color="#F39C12"
        />

        <DashboardCard
          title="Total Salary"
          value={`₹${totalSalary}`}
          icon={<FaMoneyBillWave />}
          color="#E74C3C"
        />

        <DashboardCard
          title="Male"
          value={maleEmployees}
          icon={<FaMale />}
          color="#3498DB"
        />

        <DashboardCard
          title="Female"
          value={femaleEmployees}
          icon={<FaFemale />}
          color="#9B59B6"
        />

        <DashboardCard
          title="Highest Salary"
          value={`₹${highestSalary}`}
          icon={<FaUserTie />}
          color="#2ECC71"
        />

      </div>

    </div>
  );
}