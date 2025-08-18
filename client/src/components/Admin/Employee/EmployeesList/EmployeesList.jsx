import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { BeatLoader } from "react-spinners";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { format } from "date-fns";

function EmployeesList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = location.pathname === "/employees/create";
  const isEditMode = location.pathname.startsWith("/employees/edit/");
  const isViewMode = !isCreateMode && !isEditMode && id;
  const isListMode = location.pathname === "/employees";

  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authEmployee, setAuthEmployee] = useState({});

  const isAdminOrManager =
    authEmployee?.employee_role === "Admin" ||
    authEmployee?.employee_role === "Manager";

  const roleOptions = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const authData = await getAuth();
        if (!authData.employee_token) {
          setError("Please log in to access this page");
          navigate("/login");
          return;
        }
        if (
          (isCreateMode || isEditMode) &&
          !["Admin", "Manager"].includes(authData.employee_role)
        ) {
          setError("Only Admins or Managers can create or edit employees");
          navigate("/employees");
          return;
        }
        setAuthEmployee(authData);
      } catch (err) {
        setError("Authentication error. Please log in again.", err);
        navigate("/login");
      }
    };
    fetchEmployee();
  }, [navigate, isCreateMode, isEditMode]);

  useEffect(() => {
    if (!authEmployee.employee_token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isListMode) {
          const response = await axiosInstance.get("/employees");
          setEmployees(Array.isArray(response.data) ? response.data : []);
          setError("");
        } else if (isViewMode || isEditMode) {
          const response = await axiosInstance.get(`/employees/${id}`);
          setEmployeeData(response.data);
          if (isEditMode) {
            setFormData({
              first_name: response.data.employee_first_name || "",
              last_name: response.data.employee_last_name || "",
              email: response.data.employee_email || "",
              phone: response.data.employee_phone || "",
              password: "",
              role_id:
                roleOptions.find((role) => role.name === response.data.role)
                  ?.id || "",
            });
          }
          setError("");
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            `Failed to fetch ${isListMode ? "employees" : "employee"}`
        );
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    authEmployee.employee_token,
    isListMode,
    isViewMode,
    isEditMode,
    id,
    navigate,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can create or edit employees");
      return;
    }
    if (
      !formData.first_name ||
      !formData.email ||
      !formData.role_id ||
      (isCreateMode && !formData.password)
    ) {
      setError(
        `First name, email, role, and ${
          isCreateMode ? "password are" : "are"
        } required`
      );
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      if (isCreateMode) {
        await axiosInstance.post("/employees", payload);
      } else if (isEditMode) {
        await axiosInstance.put(`/employees/${id}`, payload);
      }
      setError("");
      navigate("/employees");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to ${isCreateMode ? "create" : "update"} employee`
      );
    } finally {
      setLoading(false);
    }
  };

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
        {
          label: "No",
        },
      ],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <BeatLoader color="#123abc" size={10} />;
  if (isViewMode && !employeeData)
    return (
      <div className="container mt-4">{error || "Employee not found"}</div>
    );

  return (
    <div className="container mt-4">
      <div>
        <h2 className="mb-3">
          {isCreateMode
            ? "Create New Employee"
            : isEditMode
            ? "Edit Employee"
            : isListMode
            ? "Our Employees"
            : `${employeeData?.employee_first_name} ${employeeData?.employee_last_name}`}
        </h2>
        <p className="mb-3">
          {isCreateMode
            ? "Fill in the details below to create a new employee."
            : isEditMode
            ? "Update the details below to edit the employee."
            : isListMode
            ? "Browse and manage our employees."
            : "View employee details below."}
        </p>
        {error && <div className="alert alert-danger">{error}</div>}

        {isListMode ? (
          <>
            {isAdminOrManager && (
              <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/employees/create")}
              >
                Create New Employee
              </button>
            )}
            {employees.length === 0 ? (
              <p>No employees available.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle">
                  <thead className="table-dark">
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
                        <td>
                          {employee.employee_active_status ? "Yes" : "No"}
                        </td>
                        <td>
                          <a
                            href={`/employees/${employee.employee_id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/employees/${employee.employee_id}`);
                            }}
                            className="text-decoration-none text-primary fw-semibold"
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
                          <div className="d-flex gap-2">
                            {isAdminOrManager && (
                              <>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/employees/edit/${employee.employee_id}`
                                    )
                                  }
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(employee.employee_id)
                                  }
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <MdDelete />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password {isEditMode && "(optional)"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditMode
                    ? "Enter new password (optional)"
                    : "Enter password"
                }
                required={isCreateMode}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role_id" className="form-label">
                Role
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {isCreateMode ? "Create Employee" : "Update Employee"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/employees")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmployeesList;
