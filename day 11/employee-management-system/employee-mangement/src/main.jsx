import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { EmployeeProvider } from "./context/EmployeeContext";
import { DepartmentProvider } from "./context/DepartmentContext";

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
          <App />
        </EmployeeProvider>
      </DepartmentProvider>
    </BrowserRouter>
  </React.StrictMode>
);