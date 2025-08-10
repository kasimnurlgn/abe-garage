import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";
import { FaEdit } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

function GetCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const emp = await getAuth();
        if (!emp.employee_token) {
          navigate("/login");
        } else {
          setEmployee(emp);
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
        navigate("/login");
      }
      setLoading(false);
    };
    fetchEmployee();
  }, [navigate]);

  useEffect(() => {
    if (employee?.employee_token) {
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get("/customers", {
            headers: { Authorization: `Bearer ${employee.employee_token}` },
          });
          setCustomers(response.data);
          setError("");
        } catch (err) {
          console.error("Fetch customers error:", err);
          const message =
            err.response?.data?.error || "Failed to fetch customers";
          setError(message);
          if (err.response?.status === 401) {
            localStorage.removeItem("employee"); // Clear invalid token
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [employee?.employee_token, navigate]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = customers.filter(
        (customer) =>
          customer.customer_first_name
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          customer.customer_last_name
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          customer.customer_email.toLowerCase().includes(query.toLowerCase()) ||
          customer.customer_phone_number
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!employee?.employee_token) return null; // Redirect handled in useEffect

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Customers</h2>
        </div>
        <div className="contact-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="form-group col-md-12">
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added Date</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filteredCustomers.length > 0
                ? filteredCustomers
                : customers
              ).map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.customer_first_name}</td>
                  <td>{customer.customer_last_name}</td>
                  <td>{customer.customer_email}</td>
                  <td>{customer.customer_phone_number}</td>
                  <td>
                    {format(
                      new Date(customer.customer_added_date),
                      "MM-dd-yyyy | HH:mm"
                    )}
                  </td>
                  <td>{customer.customer_active_status ? "Yes" : "No"}</td>
                  <td>
                    <div className="edit-delete-icons">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/customers/edit/${customer.customer_id}`
                          )
                        }
                        disabled={
                          employee.employee_role !== "Admin" &&
                          employee.employee_role !== "Manager"
                        }
                      >
                        <FaEdit />
                      </button>{" "}
                      <button
                        onClick={() =>
                          navigate(`/admin/customers/${customer.customer_id}`)
                        }
                      >
                        <FaArrowUpRightFromSquare />
                      </button>{" "}
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/orders/create/${customer.customer_hash}`
                          )
                        }
                      >
                        Create Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
}

export default GetCustomers;
