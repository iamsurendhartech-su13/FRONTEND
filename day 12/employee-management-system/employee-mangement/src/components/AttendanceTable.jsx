import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";
import "../styles/employee.css";

export default function AttendanceTable() {
  const { attendance, deleteAttendance } =
    useContext(AttendanceContext);

  return (
    <div className="table-container">
      <h2>Attendance List</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No Attendance Found
              </td>
            </tr>
          ) : (
            attendance.map((item) => (
              <tr key={item.id}>
                <td>{item.employeeId}</td>
                <td>{item.employeeName}</td>
                <td>{item.department}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteAttendance(item.id)}
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