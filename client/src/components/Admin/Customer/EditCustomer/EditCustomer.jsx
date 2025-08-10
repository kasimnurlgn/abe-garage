import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";

function EditCustomer() {
  const [customer_email, setEmail] = useState("");
  const [customer_first_name, setFirstName] = useState("");
  const [customer_last_name, setLastName] = useState("");
  const [customer_phone_number, setPhoneNumber] = useState("");
  const [customer_active_status, setActiveCustomer] = useState(true);
  const [serverError, setServerError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameRequired, setFirstNameRequired] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const emp = await getAuth();
        if (!emp.employee_token) {
          navigate("/login");
        } else if (
          emp.employee_role !== "Admin" &&
          emp.employee_role !== "Manager"
        ) {
          navigate("/access-denied");
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
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/customers/${id}`, {
            headers: { Authorization: `Bearer ${employee.employee_token}` },
          });
          const {
            customer_email,
            customer_first_name,
            customer_last_name,
            customer_phone_number,
            customer_active_status,
          } = response.data;
          setEmail(customer_email);
          setFirstName(customer_first_name);
          setLastName(customer_last_name);
          setPhoneNumber(customer_phone_number);
          setActiveCustomer(customer_active_status);
          setServerError("");
        } catch (err) {
          console.error("Error fetching customer:", err);
          const message =
            err.response?.data?.error || "Failed to fetch customer";
          setServerError(message);
          if (err.response?.status === 401) {
            localStorage.removeItem("employee");
            navigate("/login");
          } else if (err.response?.status === 404) {
            navigate("/admin/customers");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [employee?.employee_token, id, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setEmailError("");
    setFirstNameRequired("");
    setPhoneError("");

    // Basic client-side validation
    if (!customer_first_name) {
      setFirstNameRequired("First name is required");
      return;
    }
    if (!customer_email || !/\S+@\S+\.\S+/.test(customer_email)) {
      setEmailError("Valid email is required");
      return;
    }
    if (!customer_phone_number) {
      setPhoneError("Phone number is required");
      return;
    }

    const formData = {
      email: customer_email,
      phone_number: customer_phone_number,
      first_name: customer_first_name,
      last_name: customer_last_name,
      active_status: customer_active_status ? 1 : 0,
    };

    try {
      setLoading(true);
      await axiosInstance.put(`/customers/${id}`, formData, {
        headers: { Authorization: `Bearer ${employee.employee_token}` },
      });
      navigate("/admin/customers");
    } catch (err) {
      console.error("Error updating customer:", err);
      const message = err.response?.data?.error || "Failed to update customer";
      setServerError(message);
      if (err.response?.status === 401) {
        localStorage.removeItem("employee");
        navigate("/login");
      } else if (err.response?.status === 403) {
        navigate("/access-denied");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!employee?.employee_token) return null;

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>
            Edit: {customer_first_name} {customer_last_name}
          </h2>
          <h4>Customer Email: {customer_email}</h4>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                {serverError && (
                  <div className="validation-error" role="alert">
                    {serverError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="formSize">
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Customer first name"
                        required
                      />
                      {firstNameRequired && (
                        <div className="validation-error" role="alert">
                          {firstNameRequired}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Customer last name"
                        required
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Customer email"
                        required
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone_number"
                        value={customer_phone_number}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                        required
                      />
                      {phoneError && (
                        <div className="validation-error" role="alert">
                          {phoneError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <label>
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={customer_active_status}
                          onChange={(event) =>
                            setActiveCustomer(event.target.checked)
                          }
                        />{" "}
                        Is active customer
                      </label>
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        disabled={loading}
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? "Updating..." : "Update"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditCustomer;
