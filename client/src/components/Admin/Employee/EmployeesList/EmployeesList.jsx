import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { BeatLoader } from "react-spinners";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { format } from "date-fns";

function EmployeesList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authEmployee, setAuthEmployee] = useState({});

  const isAdminOrManager =
    authEmployee?.employee_role === "Admin" ||
    authEmployee?.employee_role === "Manager";

  // Fetch authenticated employee
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const authData = await getAuth();
        if (!authData.employee_token) {
          setError("Please log in to access this page");
          navigate("/login");
          return;
        }
        setAuthEmployee(authData);
      } catch (err) {
        setError("Authentication error. Please log in again.", err);
        navigate("/login");
      }
    };
    fetchEmployee();
  }, [navigate]);

  // Fetch employees
  useEffect(() => {
    if (!authEmployee.employee_token) return;
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/employees");
        setEmployees(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch employees");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [authEmployee.employee_token, navigate]);

  const handleDelete = (employeeId) => {
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can delete employees");
      return;
    }
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this employee?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            setLoading(true);
            try {
              await axiosInstance.delete(`/employees/${employeeId}`);
              setEmployees((prev) =>
                prev.filter((emp) => emp.employee_id !== employeeId)
              );
              setError("");
            } catch (err) {
              setError(
                err.response?.data?.error || "Failed to delete employee"
              );
            } finally {
              setLoading(false);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  if (loading) return <BeatLoader color="#123abc" size={10} />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4 ">
      <div className="contact-title">
        <h2 className="my-2"> Employees</h2>
      </div>

      {isAdminOrManager && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/admin/add-employee")}
        >
          Create New Employee
        </button>
      )}

      {employees.length === 0 ? (
        <p>No employees available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Active</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Added Date</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_active_status ? "Yes" : "No"}</td>
                <td>
                  <a
                    href={`/employees/${employee.employee_id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/employees/${employee.employee_id}`);
                    }}
                  >
                    {employee.employee_first_name}
                  </a>
                </td>
                <td>{employee.employee_last_name}</td>
                <td>{employee.employee_email}</td>
                <td>{employee.employee_phone || "N/A"}</td>
                <td>
                  {employee.employee_added_date
                    ? format(
                        new Date(employee.employee_added_date),
                        "MM-dd-yyyy | HH:mm"
                      )
                    : "N/A"}
                </td>
                <td>{employee.role}</td>
                <td>
                  {isAdminOrManager && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/employees/edit/${employee.employee_id}`)
                        }
                        className="btn btn-sm btn-warning me-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.employee_id)}
                        className="btn btn-sm btn-danger"
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeesList;
