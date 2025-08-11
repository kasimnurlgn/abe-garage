import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { getAuth } from "../../../../context/auth";

function AddCustomer() {
  const [customer_email, setEmail] = useState("");
  const [customer_first_name, setFirstName] = useState("");
  const [customer_last_name, setLastName] = useState("");
  const [customer_phone_number, setPhoneNumber] = useState("");
  const [customer_active_status, setActiveCustomer] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

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
    };
    fetchEmployee();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setServerError("");

    // Client-side validation
    let valid = true;
    if (!customer_first_name) {
      setFirstNameError("First name is required");
      valid = false;
    }
    if (!customer_last_name) {
      setLastNameError("Last name is required");
      valid = false;
    }
    if (!customer_email || !/^\S+@\S+\.\S+$/.test(customer_email)) {
      setEmailError("Valid email is required");
      valid = false;
    }
    if (!customer_phone_number) {
      setPhoneError("Phone number is required");
      valid = false;
    }

    if (!valid) return;

    const formData = {
      email: customer_email,
      phone_number: customer_phone_number,
      first_name: customer_first_name,
      last_name: customer_last_name,
      active_status: customer_active_status ? 1 : 0,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/customers", formData, {
        headers: { Authorization: `Bearer ${employee.employee_token}` },
      });
      navigate("/admin/customers");
    } catch (err) {
      console.error("Error creating customer:", err);
      const message = err.response?.data?.error || "Failed to create customer";
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

  if (!employee?.employee_token) return null; // Redirect handled in useEffect

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new customer</h2>
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
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Customer first name"
                        required
                      />
                      {firstNameError && (
                        <div className="validation-error" role="alert">
                          {firstNameError}
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
                      {lastNameError && (
                        <div className="validation-error" role="alert">
                          {lastNameError}
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
                          checked={customer_active_status}
                          onChange={(event) =>
                            setActiveCustomer(event.target.checked)
                          }
                        />{" "}
                        Active customer
                      </label>
                    </div>
                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        disabled={loading}
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? "Adding..." : "Add customer"}</span>
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

export default AddCustomer;
