import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { AttendanceContext } from "../context/AttendanceContext";

export default function AttendanceForm() {
  const { employees } = useContext(EmployeeContext);
  const { markAttendance } = useContext(AttendanceContext);

  const [attendance, setAttendance] = useState({
    id: "",
    employeeId: "",
    employeeName: "",
    department: "",
    date: "",
    status: "Present",
  });

  const handleEmployeeChange = (e) => {
    const employee = employees.find((emp) => emp.id === e.target.value);

    if (employee) {
      setAttendance({
        ...attendance,
        id: Date.now(),
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    markAttendance(attendance);

    setAttendance({
      id: "",
      employeeId: "",
      employeeName: "",
      department: "",
      date: "",
      status: "Present",
    });
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>

      <select onChange={handleEmployeeChange} value={attendance.employeeId}>
        <option value="">Select Employee</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.id} - {emp.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={attendance.department}
        placeholder="Department"
        readOnly
      />

      <input
        type="date"
        value={attendance.date}
        onChange={(e) =>
          setAttendance({
            ...attendance,
            date: e.target.value,
          })
        }
      />

      <select
        value={attendance.status}
        onChange={(e) =>
          setAttendance({
            ...attendance,
            status: e.target.value,
          })
        }
      >
        <option>Present</option>
        <option>Absent</option>
        <option>Leave</option>
      </select>

      <button type="submit">Save Attendance</button>

    </form>
  );
}