// src/components/CreateOrder.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import styles from "./CreateOrder.module.css"; // Reuse your friend's CSS

function CreateOrder() {
  const { customer_hash } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Assume token is stored in localStorage (adjust based on your auth setup)
  const token = localStorage.getItem("employee_token");
  const employeeId = localStorage.getItem("employee_id"); // Adjust based on your auth setup

  // Fetch customer by hash
  const fetchCustomer = async () => {
    try {
      const response = await axiosInstance.get(
        `/customers/hash/${customer_hash}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomer(response.data);
    } catch (err) {
      setError("Failed to fetch customer");
      console.error(err);
    }
  };

  // Fetch vehicle by customer hash
  const fetchVehicle = async () => {
    try {
      const response = await axiosInstance.get(
        `/vehicles/customer/${customer_hash}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVehicle(response.data[0]); // Assume first vehicle
    } catch (err) {
      setError("Failed to fetch vehicle");
      console.error(err);
    }
  };

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    }
  };

  // Handle service selection
  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s.service_id === serviceId)) {
        return prev.filter((s) => s.service_id !== serviceId);
      }
      return [...prev, { service_id: serviceId, service_completed: 0 }];
    });
  };

  // Handle form submission
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const orderData = {
      customer_id: customer?.customer_id,
      employee_id: employeeId,
      order_total_price: parseFloat(orderTotalPrice) || 0,
      order_estimated_completion_date: estimatedCompletionDate,
      order_additional_requests: additionalRequests,
      services: selectedServices,
    };

    try {
      await axiosInstance.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchVehicle();
    fetchServices();
  }, [customer_hash, token]);

  return (
    <div style={{ backgroundColor: "#f5f5f5", margin: "-10px" }}>
      <div className={styles.serviceForm}>
        {/* Customer Info */}
        <div className="contact-section pt-0 pb-4">
          <div className="mr-5">
            <div className={styles.customerInfo}>
              <h3 className={styles.customerHeader}>
                {customer?.customer_first_name} {customer?.customer_last_name}
              </h3>
              <p className={styles.customerText}>
                <span>Email: </span>
                {customer?.customer_email}
              </p>
              <p className={styles.customerText}>
                <span>Phone: </span>
                {customer?.customer_phone_number}
              </p>
              <p className={styles.customerText}>
                <span>Active: </span>
                {customer?.customer_active_status === 1 ? "Yes" : "No"}
              </p>
              <p className={styles.customerText}>
                <button style={{ backgroundColor: "white" }}>
                  <span>Edit customer info</span> <FaEdit color="#E90D09" />
                </button>
              </p>
              <FaWindowClose
                color="#E90D09"
                style={{
                  float: "right",
                  cursor: "pointer",
                  marginTop: "-100px",
                }}
                onClick={() => navigate("/admin/orders")}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="contact-section pt-0 pb-4">
          <div className="mr-5">
            <div className={styles.customerInfo}>
              <h3 className={styles.customerHeader}>
                {vehicle?.vehicle_model}
              </h3>
              <p className={styles.customerText}>
                <span>Color: </span>
                {vehicle?.vehicle_color}
              </p>
              <p className={styles.customerText}>
                <span>Serial: </span>
                {vehicle?.vehicle_serial_number}
              </p>
              <p className={styles.customerText}>
                <span>Make: </span>
                {vehicle?.vehicle_make}
              </p>
              <p className={styles.customerText}>
                <button style={{ backgroundColor: "white" }}>
                  <span>Edit vehicle info</span> <FaEdit color="#E90D09" />
                </button>
              </p>
              <FaWindowClose
                color="#E90D09"
                style={{
                  float: "right",
                  cursor: "pointer",
                  marginTop: "-100px",
                }}
                onClick={() => navigate("/admin/orders")}
              />
            </div>
          </div>
        </div>

        {/* Service Selection and Order Form */}
        <form
          onSubmit={handleCreateOrder}
          className="contact-section pt-0 pb-4"
        >
          <div className="mr-5">
            <div className="pb-0 d-flex order-danger">
              <div className="contact-title">
                <h2>Choose Service</h2>
                {services.map((service) => (
                  <div
                    key={service.service_id}
                    className="bg-white my-2 d-flex shadow-sm"
                  >
                    <div className="py-4 px-4 flex-grow-1">
                      <h5 className="mb-1 font-weight-bold">
                        {service.service_name}
                      </h5>
                      <h6 className="mb-1 text-secondary">
                        {service.service_description}
                      </h6>
                    </div>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        value={service.service_id}
                        checked={selectedServices.some(
                          (s) => s.service_id === service.service_id
                        )}
                        onChange={() =>
                          handleServiceSelection(service.service_id)
                        }
                        className={styles.serviceCheckbox}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mr-5 mt-4 contact-title">
            <div className="p-3 px-5 flex-grow-1 bg-white">
              <h2>Order Details</h2>
              <div className="contact-form">
                <div className="row clearfix">
                  <h3 className="ml-3">Additional Requests</h3>
                  <div className="form-group col-md-12">
                    <textarea
                      placeholder="Additional Requests"
                      onChange={(e) => setAdditionalRequests(e.target.value)}
                      value={additionalRequests}
                    ></textarea>
                  </div>

                  <h3 className="ml-3">Estimated Completion Date</h3>
                  <div className="form-group col-md-12">
                    <input
                      type="date"
                      onChange={(e) =>
                        setEstimatedCompletionDate(e.target.value)
                      }
                      value={estimatedCompletionDate}
                      required
                    />
                  </div>

                  <h3 className="ml-3">Total Price</h3>
                  <div className="form-group col-md-12">
                    <input
                      type="number"
                      placeholder="Total Price"
                      onChange={(e) => setOrderTotalPrice(e.target.value)}
                      value={orderTotalPrice}
                      required
                    />
                  </div>

                  {error && (
                    <div
                      className="validation-error"
                      style={{
                        color: "red",
                        fontSize: "100%",
                        fontWeight: "600",
                        padding: "25px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="form-group col-md-12 pl-3">
                    <button
                      className="theme-btn btn-style-one"
                      type="submit"
                      disabled={loading}
                    >
                      <span>
                        {loading ? (
                          <BeatLoader color="white" size={8} />
                        ) : (
                          "CREATE ORDER"
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
