import React, { useEffect, useState } from "react";
import styles from "./EditOrder.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Use plain axios for public endpoint
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";

const EditOrder = () => {
  const { order_hash } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [updatedServices, setUpdatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusBadge, setStatusBadge] = useState("In Progress");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching order with hash: ${order_hash}`);
        const response = await axios.get(
          `http://localhost:5000/api/orders/hash/${order_hash}`
        );
        console.log("Response:", response);
        const order = response.data;
        console.log("Order fetched:", order);
        setOrderDetails(order);

        const initialServices = order.services.map((service) => ({
          service_id: service.service_id,
          service_completed: service.service_completed,
        }));
        setUpdatedServices(initialServices);
      } catch (err) {
        console.error("Fetch error details:", err.response);
        if (err.response?.status === 401) {
          setError(
            "Authentication error: Unable to fetch order. Please log in again."
          );
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 404) {
          setError(
            `Order with hash ${order_hash} not found. Redirecting to orders list...`
          );
          setTimeout(() => navigate("/admin/orders"), 2000);
        } else {
          setError(
            err.response?.data?.error || "Failed to fetch order details"
          );
          setTimeout(() => navigate("/admin/orders"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [order_hash, navigate]);

  useEffect(() => {
    const allServicesCompleted = updatedServices.every(
      (service) => service.service_completed === 1
    );
    setStatusBadge(allServicesCompleted ? "Completed" : "In Progress");
  }, [updatedServices]);

  const handleCheckboxChange = (service_id, value) => {
    setUpdatedServices((prev) =>
      prev.map((service) =>
        service.service_id === service_id
          ? { ...service, service_completed: value }
          : service
      )
    );
  };

  const handleSave = async () => {
    try {
      if (!orderDetails?.order_id) {
        setError("Order ID is missing. Cannot update order.");
        setTimeout(() => navigate("/admin/orders"), 2000);
        return;
      }

      let employee;
      try {
        employee = await getAuth();
      } catch (authError) {
        console.error("getAuth error:", authError);
        setError("Authentication error: Please log in.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (
        !employee.employee_token ||
        !["Admin", "Manager"].includes(employee.employee_role)
      ) {
        setError("Access denied. Requires Admin or Manager role.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const order_status = updatedServices.every(
        (service) => service.service_completed === 1
      )
        ? "completed"
        : "in_progress";

      const data = {
        order_status,
        services: updatedServices,
      };

      await axiosInstance.put(`/orders/${orderDetails.order_id}`, data, {
        headers: {
          Authorization: `Bearer ${employee.employee_token}`,
        },
      });

      alert("Order status updated successfully!");
      navigate("/admin/orders");
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update order status";
      setError(
        errorMessage.includes("Invalid service_id")
          ? `Error: ${errorMessage}. Please ensure all services are valid.`
          : errorMessage.includes("Access denied")
          ? "Error: You do not have permission to update this order."
          : `Error: ${errorMessage}`
      );
      setTimeout(() => navigate("/admin/orders"), 2000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.orderDetailsPage}>
      <div className={styles.orderDetailsContainer}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.customerHeader}>
              <h1 className={styles.customerName}>
                {orderDetails.customer_email}
              </h1>
              <span className={styles.shortRedLine}></span>
            </div>
            <span
              className={`${styles.statusBadge} ${
                statusBadge === "Completed"
                  ? styles.completed
                  : styles.inProgress
              }`}
            >
              {statusBadge}
            </span>
          </div>
        </header>
        <div className={styles.row}>
          <div className={`${styles.detailsCard} ${styles.customerDetails}`}>
            <h2 className={styles.cardHeading}>CUSTOMER</h2>
            <p className={styles.customerName}>{orderDetails.customer_email}</p>
            <p className={styles.detailItem}>
              <strong>Email:</strong> {orderDetails.customer_email}
            </p>
          </div>
          <div className={`${styles.detailsCard} ${styles.vehicleDetails}`}>
            <h2 className={styles.cardHeading}>CAR IN SERVICE</h2>
            <p className={styles.vehicleTitle}>
              {orderDetails.vehicle
                ? `${orderDetails.vehicle.vehicle_make} ${orderDetails.vehicle.vehicle_model}`
                : "No vehicle"}
            </p>
            <p className={styles.detailItem}>
              <strong>Serial Number:</strong>{" "}
              {orderDetails.vehicle?.vehicle_serial_number || "N/A"}
            </p>
          </div>
        </div>
        <div className={styles.orderServices}>
          <h2>Requested Services</h2>
          {orderDetails.services.length > 0 ? (
            <ul>
              {orderDetails.services.map((service) => (
                <li key={service.service_id} className={styles.serviceItem}>
                  <div className={styles.serviceHeader}>
                    <p className={styles.serviceTitle}>
                      {service.service_name}
                    </p>
                    <label className={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        checked={
                          !!updatedServices.find(
                            (s) =>
                              s.service_id === service.service_id &&
                              s.service_completed === 1
                          )
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            service.service_id,
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                      <span className={styles.checkboxDisplay}></span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No services associated with this order.</p>
          )}
        </div>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditOrder;
