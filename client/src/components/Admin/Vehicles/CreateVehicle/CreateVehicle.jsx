import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaWindowClose } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

function CreateVehicle() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    customer_id: "",
    vehicle_serial_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_color: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const employee = JSON.parse(localStorage.getItem("employee")) || {};
  const token = employee.employee_token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!vehicle.customer_id || isNaN(parseInt(vehicle.customer_id))) {
      setError("Valid customer ID is required");
      return;
    }
    if (!vehicle.vehicle_serial_number) {
      setError("Serial number is required");
      return;
    }
    if (!vehicle.vehicle_make) {
      setError("Make is required");
      return;
    }
    if (!vehicle.vehicle_model) {
      setError("Model is required");
      return;
    }
    if (!vehicle.vehicle_year || isNaN(parseInt(vehicle.vehicle_year))) {
      setError("Valid year is required");
      return;
    }
    if (!vehicle.vehicle_type) {
      setError("Type is required");
      return;
    }
    if (!vehicle.vehicle_mileage || isNaN(parseInt(vehicle.vehicle_mileage))) {
      setError("Valid mileage is required");
      return;
    }
    if (!vehicle.vehicle_tag) {
      setError("Tag is required");
      return;
    }
    if (!vehicle.vehicle_color) {
      setError("Color is required");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/vehicles", vehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/vehicles");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create vehicle");
      if (err.response?.status === 401) {
        localStorage.removeItem("employee_token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container bg-white shadow rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Create Vehicle</h3>
          <FaWindowClose
            size={24}
            color="#E90D09"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/vehicles")}
          />
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Customer ID</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.customer_id}
              onChange={(e) =>
                setVehicle({ ...vehicle, customer_id: e.target.value })
              }
              placeholder="Customer ID"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Serial Number</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_serial_number}
              onChange={(e) =>
                setVehicle({
                  ...vehicle,
                  vehicle_serial_number: e.target.value,
                })
              }
              placeholder="Serial Number"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Make</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_make}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_make: e.target.value })
              }
              placeholder="Make"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Model</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_model}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_model: e.target.value })
              }
              placeholder="Model"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.vehicle_year}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_year: e.target.value })
              }
              placeholder="Year"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_type}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_type: e.target.value })
              }
              placeholder="Type"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Mileage</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.vehicle_mileage}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_mileage: e.target.value })
              }
              placeholder="Mileage (number)"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Tag</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_tag}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_tag: e.target.value })
              }
              placeholder="Tag (text) "
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Color</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.vehicle_color}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_color: e.target.value })
              }
              placeholder="Color"
              required
            />
          </div>

          {error && (
            <div className="col-12">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}

          <div className="col-12">
            <button
              className="btn  w-100 my-3 py-2 bg-success text-white "
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <BeatLoader color="white" size={8} />
              ) : (
                "Create Vehicle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateVehicle;
