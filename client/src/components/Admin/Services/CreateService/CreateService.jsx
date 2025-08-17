import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import styles from "../ServiceList/ServicesList.module.css";
import { BeatLoader } from "react-spinners";

function CreateService() {
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
          setError("Please log in to create a service");
          navigate("/login");
          return;
        }
        if (!["Admin", "Manager"].includes(authData.employee_role)) {
          setError("Only Admins or Managers can create services");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminOrManager) {
      setError("Only Admins or Managers can create services");
      return;
    }
    if (!formData.service_name || !formData.service_price) {
      setError("Service name and price are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/services", {
        service_name: formData.service_name,
        service_description: formData.service_description,
        service_price: parseFloat(formData.service_price),
      });
      console.log("Create service response:", response.data); // Debug
      setError("");
      navigate("/services");
    } catch (err) {
      console.error("Create service error:", err.response || err); // Debug
      setError(err.response?.data?.error || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <div className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>Create New Service</h2>
            <p className={styles.description}>
              Fill in the details below to create a new service.
            </p>
            {error && <p className={styles.error}>{error}</p>}
            {loading ? (
              <BeatLoader color="#123abc" size={10} />
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="service_name">Service Name</label>
                  <input
                    type="text"
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleChange}
                    placeholder="Enter service name"
                    required
                    className={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor="service_description">Description</label>
                  <textarea
                    name="service_description"
                    value={formData.service_description}
                    onChange={handleChange}
                    placeholder="Enter service description"
                    className={styles.textarea}
                  />
                </div>
                <div>
                  <label htmlFor="service_price">Price ($)</label>
                  <input
                    type="number"
                    name="service_price"
                    value={formData.service_price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    step="0.01"
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.button_container}>
                  <button type="submit" className={styles.createButton}>
                    Create Service
                  </button>
                  <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => navigate("/services")}
                  >
                    Cancel
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

export default CreateService;
