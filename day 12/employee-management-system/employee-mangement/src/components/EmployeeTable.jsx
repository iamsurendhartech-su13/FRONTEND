import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import "../styles/employee.css";

export default function EmployeeTable() {
  const {
    employees,
    deleteEmployee,
    setEditEmployee,
  } = useContext(EmployeeContext);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.employeeId &&
        emp.employeeId.toLowerCase().includes(search.toLowerCase()));

    const matchesDepartment =
      departmentFilter === "" ||
      emp.department === departmentFilter;

    const matchesGender =
      genderFilter === "" ||
      emp.gender === genderFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesGender
    );
  });

  return (
    <div className="table-container">
      <h2>Employee List</h2>

      {/* Search & Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by Employee ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>

          {[...new Set(employees.map((emp) => emp.department))].map(
            (dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            )
          )}
        </select>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-data">
                No Employees Found
              </td>
            </tr>
          ) : (
            filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                {/* Display Employee ID entered by user */}
                <td>{emp.employeeId}</td>

                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.gender}</td>
                <td>₹{emp.salary}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setEditEmployee(emp)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}