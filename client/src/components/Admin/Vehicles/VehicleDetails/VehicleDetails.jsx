import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaEdit, FaTrash, FaWindowClose } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
// import styles from "./CreateOrder.module.css";

function VehicleDetails() {
  const { vehicle_id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("employee_token");
  const employeeRole = localStorage.getItem("employee_role");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/vehicles/${vehicle_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicle(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch vehicle");
        if (err.response?.status === 401) {
          localStorage.removeItem("employee_token");
          localStorage.removeItem("employee_role");
          navigate("/login");
        } else if (err.response?.status === 404) {
          navigate("/admin/vehicles");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicle_id, token, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/vehicles/${vehicle_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/vehicles");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete vehicle");
      if (err.response?.status === 401) {
        localStorage.removeItem("employee_token");
        localStorage.removeItem("employee_role");
        navigate("/login");
      } else if (err.response?.status === 403) {
        navigate("/access-denied");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <BeatLoader color="#E90D09" size={15} />
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            Vehicle: {vehicle.vehicle_make} {vehicle.vehicle_model}
          </h4>
          <FaWindowClose
            color="#E90D09"
            style={{ cursor: "pointer" }}
            size={22}
            onClick={() => navigate("/admin/vehicles")}
          />
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger fw-bold">{error}</div>}

          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">
              <strong>Serial Number:</strong> {vehicle.vehicle_serial_number}
            </li>
            <li className="list-group-item">
              <strong>Make:</strong> {vehicle.vehicle_make}
            </li>
            <li className="list-group-item">
              <strong>Model:</strong> {vehicle.vehicle_model}
            </li>
            <li className="list-group-item">
              <strong>Year:</strong> {vehicle.vehicle_year}
            </li>
            <li className="list-group-item">
              <strong>Type:</strong> {vehicle.vehicle_type}
            </li>
            <li className="list-group-item">
              <strong>Mileage:</strong> {vehicle.vehicle_mileage}
            </li>
            <li className="list-group-item">
              <strong>Tag:</strong> {vehicle.vehicle_tag}
            </li>
            <li className="list-group-item">
              <strong>Color:</strong> {vehicle.vehicle_color}
            </li>
            <li className="list-group-item">
              <strong>Customer Email:</strong> {vehicle.customer_email}
            </li>
          </ul>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() =>
                navigate(`/admin/vehicles/edit/${vehicle.vehicle_id}`)
              }
            >
              <FaEdit /> Edit Vehicle
            </button>
            {(employeeRole === "Admin" || employeeRole === "Manager") && (
              <button
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={handleDelete}
              >
                <FaTrash /> Delete Vehicle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
