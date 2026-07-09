import DepartmentForm from "../components/DepartmentForm";
import DepartmentTable from "../components/DepartmentTable";
import "../styles/department.css";
export default function Departments() {
  return (
    <>
      <DepartmentForm />

      <br />

      <DepartmentTable />
    </>
  );
}