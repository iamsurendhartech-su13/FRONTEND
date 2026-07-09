import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { LeaveContext } from "../context/LeaveContext";

export default function LeaveForm() {
  const { employees } = useContext(EmployeeContext);
  const { addLeave } = useContext(LeaveContext);

  const [leave, setLeave] = useState({
    id: "",
    employeeId: "",
    employeeName: "",
    type: "Casual",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "Pending",
  });

  const handleEmployee = (e) => {
    const emp = employees.find((item) => item.id === e.target.value);

    if (emp) {
      setLeave({
        ...leave,
        id: Date.now(),
        employeeId: emp.id,
        employeeName: emp.name,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addLeave(leave);

    setLeave({
      id: "",
      employeeId: "",
      employeeName: "",
      type: "Casual",
      fromDate: "",
      toDate: "",
      reason: "",
      status: "Pending",
    });
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <select
        value={leave.employeeId}
        onChange={handleEmployee}
      >
        <option value="">Select Employee</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.id} - {emp.name}
          </option>
        ))}
      </select>

      <select
        value={leave.type}
        onChange={(e) =>
          setLeave({ ...leave, type: e.target.value })
        }
      >
        <option>Casual</option>
        <option>Sick</option>
        <option>Earned</option>
      </select>

      <input
        type="date"
        value={leave.fromDate}
        onChange={(e) =>
          setLeave({ ...leave, fromDate: e.target.value })
        }
      />

      <input
        type="date"
        value={leave.toDate}
        onChange={(e) =>
          setLeave({ ...leave, toDate: e.target.value })
        }
      />

      <textarea
        placeholder="Reason"
        value={leave.reason}
        onChange={(e) =>
          setLeave({ ...leave, reason: e.target.value })
        }
      />

      <button type="submit">Apply Leave</button>
    </form>
  );
}