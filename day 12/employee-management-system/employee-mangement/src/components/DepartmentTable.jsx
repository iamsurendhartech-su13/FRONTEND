import { useContext } from "react";
import { DepartmentContext } from "../context/DepartmentContext";

export default function DepartmentTable() {
  const { departments, deleteDepartment } =
    useContext(DepartmentContext);

  return (
    <div className="department-table-container">
      <h2>Department List</h2>

      <table className="department-table">
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-data">
                No Departments Found
              </td>
            </tr>
          ) : (
            departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteDepartment(dept.id)}
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