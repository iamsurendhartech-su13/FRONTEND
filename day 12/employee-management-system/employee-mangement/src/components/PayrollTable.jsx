import { useContext } from "react";
import { PayrollContext } from "../context/PayrollContext";
import "../styles/employee.css";

export default function PayrollTable() {
  const { payrolls, deletePayroll } = useContext(PayrollContext);

  return (
    <div className="table-container">
      <h2>Payroll Records</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Basic Salary</th>
            <th>Bonus</th>
            <th>Deduction</th>
            <th>Net Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Payroll Records
              </td>
            </tr>
          ) : (
            payrolls.map((payroll) => (
              <tr key={payroll.id}>
                <td>{payroll.employeeId}</td>
                <td>{payroll.employeeName}</td>
                <td>₹{payroll.basicSalary}</td>
                <td>₹{payroll.bonus}</td>
                <td>₹{payroll.deduction}</td>
                <td>
                  <strong>₹{payroll.netSalary}</strong>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deletePayroll(payroll.id)}
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