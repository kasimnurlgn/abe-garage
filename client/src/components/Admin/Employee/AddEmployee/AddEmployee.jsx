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
      await axiosInstance.post("/employees", formData, {
        headers: { Authorization: `Bearer ${authEmployee.employee_token}` },
      });
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

  if (!authEmployee?.employee_token) return null;

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a New Employee</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                {error && (
                  <div className="validation-error" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="formSize">
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        {roleOptions.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        disabled={loading}
                        data-loading-text="Please wait..."
                      >
                        <span>
                          {loading ? "Creating..." : "Create Employee"}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddEmployee;
