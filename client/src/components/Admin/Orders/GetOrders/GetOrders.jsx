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
        const employee = await getAuth();
        if (
          !employee?.employee_token ||
          !["Admin", "Manager"].includes(employee.employee_role)
        ) {
          navigate("/login");
          return;
        }
        setEmployeeRole(employee.employee_role);

        const response = await axiosInstance.get("/orders", {
          headers: {
            Authorization: `Bearer ${employee.employee_token}`,
          },
        });

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.response?.data?.error || "Failed to fetch orders");
      }
    };
    fetchData();
  }, [navigate]);

  const orderDetail = (order_hash) => navigate(`/admin/order/${order_hash}`);
  const editOrder = (order_hash) =>
    navigate(`/admin/orders/edit/${order_hash}`);

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
                <th>Order ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Order Date</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Edit/View</th>
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
