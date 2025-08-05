import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");
    setServerError("");

    let valid = true;
    if (!email) {
      setEmailError("Please enter your email address first");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axiosInstance.post("/login", { email, password });
      const result = response.data;

      // Save token and employee info to localStorage in the format getAuth expects
      localStorage.setItem(
        "employee",
        JSON.stringify({
          employee_token: result.token,
          employee_id: result.employee.employee_id,
          first_name: result.employee.first_name,
          last_name: result.employee.last_name,
          email: result.employee.email,
          role: result.employee.role,
        })
      );

      // Navigate after login
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
      } else {
        setServerError("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Login to your account</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div
                          className="validation-error"
                          role="alert"
                          style={{ color: "red" }}
                        >
                          {serverError}
                        </div>
                      )}
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                      />
                      {emailError && (
                        <div
                          className="validation-error"
                          role="alert"
                          style={{ color: "red" }}
                        >
                          {emailError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div
                          className="validation-error"
                          role="alert"
                          style={{ color: "red" }}
                        >
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Login</span>
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

export default Login;
