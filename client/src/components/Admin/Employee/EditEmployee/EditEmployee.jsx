import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { BeatLoader } from "react-spinners";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    active_status: 1,
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
    const fetchData = async () => {
      try {
        const authData = await getAuth();
        if (!authData.employee_token) {
          setError("Please log in to access this page");
          navigate("/login");
          return;
        }
        if (!["Admin", "Manager"].includes(authData.employee_role)) {
          setError("Only Admins or Managers can edit employees");
          navigate("/employees");
          return;
        }
        setAuthEmployee(authData);

        setLoading(true);
        const response = await axiosInstance.get(`/employees/${id}`);
        setFormData({
          first_name: response.data.employee_first_name || "",
          last_name: response.data.employee_last_name || "",
          email: response.data.employee_email || "",
          phone: response.data.employee_phone || "",
          password: "",
          role_id:
            roleOptions.find((role) => role.name === response.data.role)?.id ||
            "",
          active_status: response.data.employee_active_status ? 1 : 0,
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch employee");
        if (err.response?.status === 401) navigate("/login");
        else if (err.response?.status === 404) navigate("/employees");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can edit employees");
      return;
    }
    if (!formData.first_name || !formData.email || !formData.role_id) {
      setError("First name, email, and role are required");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      await axiosInstance.put(`/employees/${id}`, payload);
      setError("");
      navigate("/admin/employees");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update employee");
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 404) navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "active_status" ? parseInt(value, 10) : value,
    });
  };

  if (loading) return <BeatLoader color="#123abc" size={10} />;

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-4">
        <h2 className="mb-3">Edit Employee</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <p>Update the details below to edit the employee.</p>
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
              Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password (optional)"
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

          <div className="col-md-6">
            <label htmlFor="active_status" className="form-label">
              Status
            </label>
            <select
              name="active_status"
              value={formData.active_status}
              onChange={handleChange}
              className="form-select"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="col-12 d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Update Employee
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
