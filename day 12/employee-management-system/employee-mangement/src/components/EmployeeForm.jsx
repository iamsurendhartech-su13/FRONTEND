import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import "../styles/employee.css";
import { DepartmentContext } from "../context/DepartmentContext";
import { useEffect } from "react";
export default function EmployeeForm() {
 const {
  addEmployee,
  updateEmployee,
  editEmployee,
} = useContext(EmployeeContext);
  const { departments } = useContext(DepartmentContext);
  const [employee, setEmployee] = useState({
    id: "",
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
    id: "",
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
      <h2>Add Employee</h2>

      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="Employee ID"
          value={employee.id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={employee.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={employee.phone}
          onChange={handleChange}
        />

       <select
  name="department"
  value={employee.department}
  onChange={handleChange}
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
        />

        <select
          name="gender"
          value={employee.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employee.salary}
          onChange={handleChange}
        />

       <button type="submit">
  {editEmployee ? "Update Employee" : "Save Employee"}
</button>
      </form>
    </div>
  );
}