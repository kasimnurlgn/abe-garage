import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { BeatLoader } from "react-spinners";

function AddEmployee() {
  const navigate = useNavigate();
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
        if (!["Admin", "Manager"].includes(authData.employee_role)) {
          setError("Only Admins or Managers can create employees");
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
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can create employees");
      return;
    }
    if (
      !formData.first_name ||
      !formData.email ||
      !formData.password ||
      !formData.role_id
    ) {
      setError("First name, email, password, and role are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/employees", formData);
      setError("");
      navigate("/admin/employees");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create employee");
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <BeatLoader color="#123abc" size={10} />;

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-4">
        <h2 className="mb-3">Create New Employee</h2>
        <p className="text-muted">
          Fill in the details below to create a new employee.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
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

          <div className="col-md-6">
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

          <div className="col-md-6">
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

          <div className="col-md-6">
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

          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
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

          <div className="col-12 d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Create Employee
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/employees")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
