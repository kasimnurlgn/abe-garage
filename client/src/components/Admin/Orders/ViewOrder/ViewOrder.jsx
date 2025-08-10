import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ViewOrder.module.css";
import { format } from "date-fns";

const ViewOrder = () => {
  const { order_hash } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching order with hash: ${order_hash}`);
        const response = await axios.get(
          `http://localhost:5000/api/orders/hash/${order_hash}`
        );
        console.log("Response:", response);
        const order = response.data;
        setOrderDetails(order);
      } catch (err) {
        console.error("Fetch error details:", err.response);
        if (err.response?.status === 404) {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className={styles.received}>Received</span>;
      case "in_progress":
        return <span className={styles.in_progress}>In Progress</span>;
      case "completed":
        return <span className={styles.completed}>Completed</span>;
      default:
        return <span>{status}</span>;
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
            <span className={styles.statusBadge}>
              {getStatusLabel(orderDetails.order_status)}
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
          <div className={`${styles.detailsCard} ${styles.orderDetails}`}>
            <h2 className={styles.cardHeading}>ORDER DETAILS</h2>
            <p className={styles.detailItem}>
              <strong>Order ID:</strong> {orderDetails.order_id}
            </p>
            <p className={styles.detailItem}>
              <strong>Order Date:</strong>{" "}
              {orderDetails.order_date
                ? format(
                    new Date(orderDetails.order_date),
                    "MM-dd-yyyy | HH:mm"
                  )
                : "N/A"}
            </p>
            <p className={styles.detailItem}>
              <strong>Received By:</strong> {orderDetails.employee_email}
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
                    <span
                      className={`${styles.serviceStatus} ${
                        service.service_completed
                          ? styles.completed
                          : styles.pending
                      }`}
                    >
                      {service.service_completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No services associated with this order.</p>
          )}
        </div>
        <button
          className={styles.backButton}
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default ViewOrder;
