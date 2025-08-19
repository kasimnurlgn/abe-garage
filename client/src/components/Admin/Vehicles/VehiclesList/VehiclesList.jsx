import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaEdit, FaTrash, FaWindowClose } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

function VehiclesList() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const employee = JSON.parse(localStorage.getItem("employee")) || {};
  const token = employee.employee_token;
  const employeeRole = employee.employee_role;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch vehicles");
        if (err.response?.status === 401) {
          localStorage.removeItem("employee_token");
          localStorage.removeItem("employee_role");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [token, navigate]);

  const handleDelete = async (vehicle_id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/vehicles/${vehicle_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(
        vehicles.filter((vehicle) => vehicle.vehicle_id !== vehicle_id)
      );
      setError("");
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
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "300px" }}
      >
        <BeatLoader color="#E90D09" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container bg-white shadow rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Vehicles List</h3>
          <FaWindowClose
            size={24}
            color="#E90D09"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Serial Number</th>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Customer Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id}>
                  <td>{vehicle.vehicle_serial_number}</td>
                  <td>{vehicle.vehicle_make}</td>
                  <td>{vehicle.vehicle_model}</td>
                  <td>{vehicle.vehicle_year}</td>
                  <td>{vehicle.customer_email}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() =>
                        navigate(`/admin/vehicles/edit/${vehicle.vehicle_id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    {(employeeRole === "Admin" ||
                      employeeRole === "Manager") && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(vehicle.vehicle_id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VehiclesList;
