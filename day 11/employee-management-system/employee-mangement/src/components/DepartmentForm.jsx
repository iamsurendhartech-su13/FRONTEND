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
    <form onSubmit={handleSubmit}>

      <input
        placeholder="Department ID"
        value={department.id}
        onChange={(e) =>
          setDepartment({
            ...department,
            id: e.target.value,
          })
        }
      />

      <input
        placeholder="Department Name"
        value={department.name}
        onChange={(e) =>
          setDepartment({
            ...department,
            name: e.target.value,
          })
        }
      />

      <button>Add Department</button>

    </form>
  );
}