import { useContext, useState } from "react";
import { DepartmentContext } from "../context/DepartmentContext";

export default function DepartmentForm() {
  const { addDepartment } = useContext(DepartmentContext);

  const [department, setDepartment] = useState({
    id: "",
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addDepartment(department);

    setDepartment({
      id: "",
      name: "",
    });
  };

  return (
    <div className="department-form-container">
      <h2>Add Department</h2>

      <form className="department-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Department ID"
          value={department.id}
          onChange={(e) =>
            setDepartment({
              ...department,
              id: e.target.value,
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Department Name"
          value={department.name}
          onChange={(e) =>
            setDepartment({
              ...department,
              name: e.target.value,
            })
          }
          required
        />

        <button type="submit">
          Add Department
        </button>
      </form>
    </div>
  );
}