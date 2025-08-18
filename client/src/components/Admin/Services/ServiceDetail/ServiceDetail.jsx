import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import styles from "./ServicesList.module.css"; // Reuse existing CSS
import { BeatLoader } from "react-spinners";
import { FaEdit, MdDelete } from "react-icons/fa";

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
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
          setError("Please log in to view service details");
          navigate("/login");
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
        console.log("Service details response:", response.data); // Debug
        setService(response.data);
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

  if (loading) return <BeatLoader color="#123abc" size={10} />;
  if (!service)
    return (
      <div className={styles.container}>{error || "Service not found"}</div>
    );

  return (
    <div className={styles.container}>
      <div className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>{service.service_name}</h2>
            <p className={styles.description}>
              {service.service_description || "No description available"}
            </p>
            <p>Price: ${service.service_price}</p>
            <p>
              Status: {service.service_active_status ? "Active" : "Inactive"}
            </p>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.button_container}>
              {isAdminOrManager && (
                <>
                  <button
                    onClick={() => navigate(`/services/edit/${id}`)}
                    className={styles.iconButton}
                  >
                    <FaEdit color="red" />
                  </button>
                  <button
                    onClick={() => navigate(`/services/delete/${id}`)}
                    className={styles.iconButton}
                  >
                    <MdDelete />
                  </button>
                </>
              )}
              <button
                className={styles.createButton}
                onClick={() => navigate("/services")}
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
