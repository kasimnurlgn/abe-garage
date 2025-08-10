import React, { useEffect, useState } from "react";
import styles from "./EditOrder.module.css";
import { useParams, useNavigate } from "react-router-dom";
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
        const employee = await getAuth();
        if (
          !employee?.employee_token ||
          !["Admin", "Manager"].includes(employee.employee_role)
        ) {
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get(`/orders/hash/${order_hash}`);
        const order = response.data;
        setOrderDetails(order);

        setUpdatedServices(
          order.services.map((service) => ({
            service_id: service.service_id,
            service_completed: service.service_completed,
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to fetch order details");
        setTimeout(() => navigate("/admin/orders"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [order_hash, navigate]);

  useEffect(() => {
    setStatusBadge(
      updatedServices.every((s) => s.service_completed === 1)
        ? "Completed"
        : "In Progress"
    );
  }, [updatedServices]);

  const handleCheckboxChange = (service_id, value) => {
    setUpdatedServices((prev) =>
      prev.map((s) =>
        s.service_id === service_id ? { ...s, service_completed: value } : s
      )
    );
  };

  const handleSave = async () => {
    try {
      const employee = await getAuth();
      if (
        !employee?.employee_token ||
        !["Admin", "Manager"].includes(employee.employee_role)
      ) {
        navigate("/login");
        return;
      }

      const order_status = updatedServices.every(
        (s) => s.service_completed === 1
      )
        ? "completed"
        : "in_progress";

      await axiosInstance.put(
        `/orders/${orderDetails.order_id}`,
        { order_status, services: updatedServices },
        { headers: { Authorization: `Bearer ${employee.employee_token}` } }
      );

      alert("Order updated successfully!");
      navigate("/admin/orders");
    } catch (error) {
      console.error("Save error:", error);
      setError(error.response?.data?.error || "Failed to update order");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.orderDetailsPage}>
      <div className={styles.orderDetailsContainer}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.customerName}>
              {orderDetails.customer_email}
            </h1>
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
            <h2>CUSTOMER</h2>
            <p>{orderDetails.customer_email}</p>
          </div>
          <div className={`${styles.detailsCard} ${styles.vehicleDetails}`}>
            <h2>CAR IN SERVICE</h2>
            <p>
              {orderDetails.vehicle
                ? `${orderDetails.vehicle.vehicle_make} ${orderDetails.vehicle.vehicle_model}`
                : "No vehicle"}
            </p>
          </div>
        </div>

        <div className={styles.orderServices}>
          <h2>Requested Services</h2>
          {orderDetails.services.length > 0 ? (
            <ul>
              {orderDetails.services.map((service) => (
                <li key={service.service_id}>
                  {service.service_name}
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
                </li>
              ))}
            </ul>
          ) : (
            <p>No services found.</p>
          )}
        </div>

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditOrder;
