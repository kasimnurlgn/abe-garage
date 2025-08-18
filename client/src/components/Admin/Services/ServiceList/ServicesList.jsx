import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import styles from "./ServicesList.module.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BeatLoader } from "react-spinners";

function ServicesList() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();

  // Check if user is Admin or Manager
  const isAdminOrManager =
    employee?.employee_role === "Admin" ||
    employee?.employee_role === "Manager";

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const authData = await getAuth();
        if (!authData.employee_token) {
          setError("Please log in to view services");
          navigate("/login");
          return;
        }
        setEmployee(authData);
      } catch (err) {
        setError("Authentication error. Please log in again.");
        navigate("/login");
      }
    };
    fetchEmployee();
  }, [navigate]);

  // Fetch services
  useEffect(() => {
    if (!employee.employee_token) return;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/services");
        setServices(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [employee.employee_token]);

  return (
    <div className={styles.container}>
      <div className="contact-section">
        <div className="auto-container">
          <div className="contact-title">
            <h2>Services We Provide</h2>
            <p className={styles.description}>
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation X is on the runway heading
              towards a streamlined cloud solution.
            </p>
            {error && <p className={styles.error}>{error}</p>}
            {/* {isAdminOrManager && (
              <button
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-pill"
                onClick={() => navigate("/services/create")}
              >
                <i className="bi bi-plus-circle"></i>
                Create New Service
              </button>
            )} */}
            {loading ? (
              <BeatLoader color="#123abc" size={10} />
            ) : services.length === 0 ? (
              <p>No services available.</p>
            ) : (
              services.map((service) => (
                <div
                  key={service.service_id}
                  className="bg-white Regular my-2 d-flex shadow-sm"
                >
                  <div className="py-4 pb-1 px-4 flex-grow-1">
                    <h5 className="mb-1 font-weight-bold">
                      <a
                        href={`/services/${service.service_id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/services/${service.service_id}`);
                        }}
                        style={{ color: "#0b132b", textDecoration: "none" }} // dark blue-black
                      >
                        {service.service_name}
                      </a>
                    </h5>
                    <h6 className="mb-1 text-secondary">
                      {service.service_description ||
                        "No description available"}
                    </h6>
                    <p>Price: ${service.service_price}</p>
                  </div>
                  {isAdminOrManager && (
                    <div className={styles.button_container}>
                      <button
                        onClick={() =>
                          navigate(`/services/edit/${service.service_id}`)
                        }
                        className={styles.iconButton}
                      >
                        <FaEdit color="red" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/services/delete/${service.service_id}`)
                        }
                        className={styles.iconButton}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesList;
