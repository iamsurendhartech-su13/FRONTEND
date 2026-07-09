import { useContext } from "react";
import { DepartmentContext } from "../context/DepartmentContext";

export default function DepartmentTable() {

  const { departments, deleteDepartment } =
    useContext(DepartmentContext);

  return (
    <table>

      <thead>
        <tr>
          <th>ID</th>
          <th>Department</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>

        {departments.map((dept) => (

          <tr key={dept.id}>

            <td>{dept.id}</td>

            <td>{dept.name}</td>

            <td>

              <button
                onClick={() =>
                  deleteDepartment(dept.id)
                }
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}