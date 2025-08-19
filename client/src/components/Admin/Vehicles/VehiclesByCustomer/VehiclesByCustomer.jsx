import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaEdit, FaTrash, FaWindowClose } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

function VehiclesByCustomer() {
  const { customer_hash } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("employee_token");
  const employeeRole = localStorage.getItem("employee_role");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/vehicles/customer/${customer_hash}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
  }, [customer_hash, token, navigate]);

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
      <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <BeatLoader color="#E90D09" size={15} />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container bg-white shadow-sm p-4 rounded">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Vehicles for Customer</h3>
          <FaWindowClose
            color="#E90D09"
            style={{ cursor: "pointer" }}
            size={22}
            onClick={() => navigate("/admin/customers")}
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
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
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No vehicles found for this customer.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicle_id}>
                    <td>
                      <Link to={`/admin/vehicles/${vehicle.vehicle_id}`}>
                        {vehicle.vehicle_serial_number}
                      </Link>
                    </td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VehiclesByCustomer;
