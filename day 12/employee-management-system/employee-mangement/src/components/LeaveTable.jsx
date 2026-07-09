import { useContext } from "react";
import { LeaveContext } from "../context/LeaveContext";
import "../styles/employee.css";

export default function LeaveTable() {
  const {
    leaves,
    deleteLeave,
    updateLeaveStatus,
  } = useContext(LeaveContext);

  return (
    <div className="table-container">
      <h2>Leave Requests</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                No Leave Requests
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employeeId}</td>
                <td>{leave.employeeName}</td>
                <td>{leave.type}</td>
                <td>{leave.fromDate}</td>
                <td>{leave.toDate}</td>
                <td>{leave.reason}</td>

                <td>
                  <span
                    className={
                      leave.status === "Approved"
                        ? "approved"
                        : leave.status === "Rejected"
                        ? "rejected"
                        : "pending"
                    }
                  >
                    {leave.status}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      updateLeaveStatus(
                        leave.id,
                        "Approved"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      updateLeaveStatus(
                        leave.id,
                        "Rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteLeave(leave.id)
                    }
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