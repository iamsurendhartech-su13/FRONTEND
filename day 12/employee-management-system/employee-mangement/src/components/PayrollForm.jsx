import { useContext, useState } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { PayrollContext } from "../context/PayrollContext";

export default function PayrollForm() {
  const { employees } = useContext(EmployeeContext);
  const { addPayroll } = useContext(PayrollContext);

  const [payroll, setPayroll] = useState({
    id: "",
    employeeId: "",
    employeeName: "",
    basicSalary: "",
    bonus: "",
    deduction: "",
    netSalary: "",
  });

  const handleEmployee = (e) => {
    const emp = employees.find((item) => item.id === e.target.value);

    if (emp) {
      setPayroll({
        ...payroll,
        id: Date.now(),
        employeeId: emp.id,
        employeeName: emp.name,
        basicSalary: emp.salary,
      });
    }
  };

  const calculateSalary = (basic, bonus, deduction) => {
    return (
      Number(basic || 0) +
      Number(bonus || 0) -
      Number(deduction || 0)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addPayroll({
      ...payroll,
      netSalary: calculateSalary(
        payroll.basicSalary,
        payroll.bonus,
        payroll.deduction
      ),
    });

    setPayroll({
      id: "",
      employeeId: "",
      employeeName: "",
      basicSalary: "",
      bonus: "",
      deduction: "",
      netSalary: "",
    });
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <select
        value={payroll.employeeId}
        onChange={handleEmployee}
      >
        <option value="">Select Employee</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.id} - {emp.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={payroll.basicSalary}
        readOnly
        placeholder="Basic Salary"
      />

      <input
        type="number"
        placeholder="Bonus"
        value={payroll.bonus}
        onChange={(e) =>
          setPayroll({
            ...payroll,
            bonus: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Deduction"
        value={payroll.deduction}
        onChange={(e) =>
          setPayroll({
            ...payroll,
            deduction: e.target.value,
          })
        }
      />

      <button type="submit">Generate Payroll</button>
    </form>
  );
}