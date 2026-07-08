import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import "../styles/employee.css";

export default function EmployeeTable() {
  const {
  employees,
  deleteEmployee,
  setEditEmployee,
} = useContext(EmployeeContext);

  return (
    <div className="table-container">
      <h2>Employee List</h2>

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
          {employees.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-data">
                No Employees Found
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
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