import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { BeatLoader } from "react-spinners";

function EditService() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    service_name: "",
    service_description: "",
    service_price: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();

  const isAdminOrManager =
    employee?.employee_role === "Admin" ||
    employee?.employee_role === "Manager";

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const authData = await getAuth();
        console.log("Auth data:", authData); // Debug
        if (!authData.employee_token) {
          setError("Please log in to edit a service");
          navigate("/login");
          return;
        }
        if (!["Admin", "Manager"].includes(authData.employee_role)) {
          setError("Only Admins or Managers can edit services");
          navigate("/services");
          return;
        }
        setEmployee(authData);
      } catch (err) {
        console.error("Error in getAuth:", err); // Debug
        setError("Authentication error. Please log in again.");
        navigate("/login");
      }
    };
    fetchEmployee();
  }, [navigate]);

  // Fetch service data
  useEffect(() => {
    if (!employee.employee_token) return;
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/services/${id}`);
        console.log("Service data:", response.data); // Debug
        setFormData({
          service_name: response.data.service_name,
          service_description: response.data.service_description || "",
          service_price: response.data.service_price.toString(),
        });
        setError("");
      } catch (err) {
        console.error("Fetch service error:", err.response || err); // Debug
        setError(err.response?.data?.error || "Failed to fetch service");
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, employee.employee_token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can edit services");
      return;
    }
    if (!formData.service_name || !formData.service_price) {
      setError("Service name and price are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/services/${id}`, {
        service_name: formData.service_name,
        service_description: formData.service_description,
        service_price: parseFloat(formData.service_price),
      });
      console.log("Update service response:", response.data); // Debug
      setError("");
      navigate("/admin/services");
    } catch (err) {
      console.error("Update service error:", err.response || err); // Debug
      setError(err.response?.data?.error || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>Edit Service</h2>
            <p className="description">
              Update the details below to edit the service.
            </p>
            {error && <p className="error">{error}</p>}
            {loading ? (
              <BeatLoader color="#123abc" size={10} />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="service_name" className="form-label">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleChange}
                    placeholder="Enter service name"
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="service_description" className="form-label">
                    Description
                  </label>
                  <textarea
                    name="service_description"
                    value={formData.service_description}
                    onChange={handleChange}
                    placeholder="Enter service description"
                    className="form-control"
                    rows="5"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="service_price" className="form-label">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="service_price"
                    value={formData.service_price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    step="0.01"
                    required
                    className="form-control"
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary fw-semibold">
                    Update Service
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditService;
