import React, { useEffect, useState } from "react";
import styles from "./GetOrders.module.css";
import { Table } from "react-bootstrap";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";

function GetOrders() {
  const [orders, setOrders] = useState([]);
  const [employeeRole, setEmployeeRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee role and token
        const employee = await getAuth();
        if (!employee.employee_token) {
          throw new Error("Not authenticated");
        }
        setEmployeeRole(employee.employee_role);

        // Fetch orders using axiosInstance
        const response = await axiosInstance.get("/orders", {
          headers: {
            Authorization: `Bearer ${employee.employee_token}`,
          },
        });
        setOrders(response.data); // Backend returns array directly
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch orders");
      }
    };
    fetchData();
  }, []);

  const orderDetail = (order_hash) => {
    navigate(`/admin/order/${order_hash}`);
  };

  const editOrder = (order_hash) => {
    navigate(`/admin/update-order/${order_hash}`);
  };

  // Map backend order_status to user-friendly labels
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className={styles.received}>Received</span>;
      case "in_progress":
        return <span className={styles.in_progress}>In progress</span>;
      case "completed":
        return <span className={styles.completed}>Completed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <section className="contact-section my-0 pt-1">
      <div className="auto-container my-0">
        <div className="contact-title my-0">
          <h2>Orders</h2>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0">
            <thead>
              <tr>
                <th className="col-1">Order ID</th>
                <th className="col-2">Customer</th>
                <th className="col-2">Vehicle</th>
                <th className="col-2">Order Date</th>
                <th className="col-2">Received By</th>
                <th className="col-2">Order Status</th>
                <th className="col-1">Edit/View</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    {error ? "Error loading orders" : "No orders found"}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.customer_email}</td>
                    <td>
                      {order.vehicle ? (
                        <>
                          {order.vehicle.vehicle_make}{" "}
                          {order.vehicle.vehicle_model}
                          <br />
                          {order.vehicle.vehicle_serial_number}
                        </>
                      ) : (
                        "No vehicle"
                      )}
                    </td>
                    <td>
                      {order.order_date
                        ? format(
                            new Date(order.order_date),
                            "MM-dd-yyyy | HH:mm"
                          )
                        : "N/A"}
                    </td>
                    <td>{order.employee_email}</td>
                    <td>{getStatusLabel(order.order_status)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {(employeeRole === "Admin" ||
                          employeeRole === "Manager") && (
                          <button
                            onClick={() => editOrder(order.order_hash)}
                            title="Edit Order"
                            className={`btn btn-sm btn-outline-primary ${styles.iconButton}`}
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={() => orderDetail(order.order_hash)}
                          title="View Order"
                          className={`btn btn-sm btn-outline-secondary ${styles.iconButton}`}
                        >
                          <FaArrowUpRightFromSquare />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
}

export default GetOrders;
