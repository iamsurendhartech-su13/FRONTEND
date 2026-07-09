import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LeaveProvider } from "./context/LeaveContext";
import App from "./App";
import { PayrollProvider } from "./context/PayrollContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { AttendanceProvider } from "./context/AttendanceContext";

import "./styles/sidebar.css";
import "./styles/navbar.css";
import "./styles/dashboard.css";
import "./styles/cards.css";
import "./styles/employee.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DepartmentProvider>
        <EmployeeProvider>
          <AttendanceProvider>
            <LeaveProvider>
              <PayrollProvider>
              <App />
              </PayrollProvider>
            </LeaveProvider>
          </AttendanceProvider>
        </EmployeeProvider>
      </DepartmentProvider>
    </BrowserRouter>
  </React.StrictMode>
);