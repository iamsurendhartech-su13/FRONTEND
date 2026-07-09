import { useContext } from "react";

import EmployeeChart from "../components/EmployeeChart";
import LeaveChart from "../components/LeaveChart";
import { EmployeeContext } from "../context/EmployeeContext";
import { AttendanceContext } from "../context/AttendanceContext";
import { LeaveContext } from "../context/LeaveContext";
import { PayrollContext } from "../context/PayrollContext";

import DashboardCard from "../components/DashboardCard";

import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaMale,
  FaFemale,
  FaClipboardCheck,
  FaFileAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const { employees } = useContext(EmployeeContext);
  const { attendance } = useContext(AttendanceContext);
  const { leaves } = useContext(LeaveContext);
  const { payrolls } = useContext(PayrollContext);

  // Employee Statistics
  const totalEmployees = employees.length;

  const totalDepartments = [
    ...new Set(employees.map((emp) => emp.department)),
  ].length;

  const maleEmployees = employees.filter(
    (emp) => emp.gender === "Male"
  ).length;

  const femaleEmployees = employees.filter(
    (emp) => emp.gender === "Female"
  ).length;

  const totalSalary = employees.reduce(
    (total, emp) => total + Number(emp.salary || 0),
    0
  );

  // Attendance
  const totalAttendance = attendance.length;

  // Leave
  const totalLeaves = leaves.length;

  // Payroll
  const totalPayroll = payrolls.reduce(
    (total, item) => total + Number(item.netSalary || 0),
    0
  );

  // Recent Employees
  const recentEmployees = [...employees].slice(-5).reverse();

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="cards">

        <DashboardCard
          title="Employees"
          value={totalEmployees}
          color="#009688"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Departments"
          value={totalDepartments}
          color="#F39C12"
          icon={<FaBuilding />}
        />

        <DashboardCard
          title="Total Salary"
          value={`₹${totalSalary}`}
          color="#E74C3C"
          icon={<FaMoneyBillWave />}
        />

        <DashboardCard
          title="Male"
          value={maleEmployees}
          color="#3498DB"
          icon={<FaMale />}
        />

        <DashboardCard
          title="Female"
          value={femaleEmployees}
          color="#9B59B6"
          icon={<FaFemale />}
        />

        <DashboardCard
          title="Attendance"
          value={totalAttendance}
          color="#2ECC71"
          icon={<FaClipboardCheck />}
        />

        <DashboardCard
          title="Leave Requests"
          value={totalLeaves}
          color="#8E44AD"
          icon={<FaFileAlt />}
        />

        <DashboardCard
          title="Payroll"
          value={`₹${totalPayroll}`}
          color="#16A085"
          icon={<FaMoneyBillWave />}
        />

      </div>
      <div className="charts">

  <EmployeeChart />

  <LeaveChart />

</div>
      <div className="table-container">
        <h2>Recent Employees</h2>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
            </tr>
          </thead>

          <tbody>
            {recentEmployees.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No Employees Found
                </td>
              </tr>
            ) : (
              recentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}