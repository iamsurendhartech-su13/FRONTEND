import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Leave from "./pages/Leave";
import Salary from "./pages/Salary";
import Settings from "./pages/Settings";

export default function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/leave" element={<Leave />} />
      <Route path="/salary" element={<Salary />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}