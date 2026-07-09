import { createContext, useEffect, useState } from "react";
import API from "../api/employeeApi";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

  // Load employees from JSON Server
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await API.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Add Employee
  const addEmployee = async (employee) => {
    try {
      const response = await API.post("/employees", employee);
      setEmployees((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Update Employee
  const updateEmployee = async (updatedEmployee) => {
    try {
      await API.put(`/employees/${updatedEmployee.id}`, updatedEmployee);

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );

      setEditEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        deleteEmployee,
        updateEmployee,
        editEmployee,
        setEditEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};