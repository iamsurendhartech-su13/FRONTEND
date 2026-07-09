import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaCog,
  FaClipboardCheck,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Employee MS</h2>

      <NavLink to="/">
        <FaTachometerAlt /> Dashboard
      </NavLink>

      <NavLink to="/employees">
        <FaUsers /> Employees
      </NavLink>

      <NavLink to="/departments">
        <FaBuilding /> Departments
      </NavLink>

      {/* New Attendance Menu */}
      <NavLink to="/attendance">
        <FaClipboardCheck /> Attendance
      </NavLink>

      <NavLink to="/leave">
        <FaFileAlt /> Leave
      </NavLink>

      <NavLink to="/salary">
        <FaMoneyBillWave /> Salary
      </NavLink>

      <NavLink to="/settings">
        <FaCog /> Settings
      </NavLink>
    </div>
  );
}