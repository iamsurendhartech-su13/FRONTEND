import { createContext, useEffect, useState } from "react";

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState(() => {
    const data = localStorage.getItem("departments");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("departments", JSON.stringify(departments));
  }, [departments]);

  const addDepartment = (department) => {
    setDepartments([...departments, department]);
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        addDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};