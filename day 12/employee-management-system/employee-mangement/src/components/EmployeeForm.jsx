import { useContext, useState, useEffect } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { DepartmentContext } from "../context/DepartmentContext";
import "../styles/employee.css";

export default function EmployeeForm() {
  const {
    addEmployee,
    updateEmployee,
    editEmployee,
  } = useContext(EmployeeContext);

  const { departments } = useContext(DepartmentContext);

  const [employee, setEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    gender: "",
    salary: "",
  });

  useEffect(() => {
    if (editEmployee) {
      setEmployee(editEmployee);
    }
  }, [editEmployee]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editEmployee) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }

    setEmployee({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      gender: "",
      salary: "",
    });
  };

  return (
    <div className="employee-form-container">
      <h2>{editEmployee ? "Update Employee" : "Add Employee"}</h2>

      <form className="employee-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID (EMP001)"
          value={employee.employeeId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={employee.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={employee.phone}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={employee.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>

          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>

          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={employee.designation}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={employee.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employee.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editEmployee ? "Update Employee" : "Save Employee"}
        </button>

      </form>
    </div>
  );
}