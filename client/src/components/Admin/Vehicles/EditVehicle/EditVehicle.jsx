import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import { FaWindowClose } from "react-icons/fa";

function EditVehicle() {
  const { vehicle_id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("employee_token");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axiosInstance.get(`/vehicles/${vehicle_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicle({
          vehicle_serial_number: response.data.vehicle_serial_number,
          vehicle_make: response.data.vehicle_make,
          vehicle_model: response.data.vehicle_model,
          vehicle_year: response.data.vehicle_year,
          vehicle_type: response.data.vehicle_type,
          vehicle_mileage: response.data.vehicle_mileage,
          vehicle_tag: response.data.vehicle_tag,
          vehicle_color: response.data.vehicle_color,
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch vehicle");
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicle_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.put(`/vehicles/${vehicle_id}`, vehicle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/admin/orders`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update vehicle");
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container bg-white shadow rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Edit Vehicle</h3>
          <FaWindowClose
            size={24}
            color="#E90D09"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/orders")}
          />
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
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
              placeholder="Mileage"
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
              placeholder="Tag"
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
            <button className="btn btn-primary w-100" type="submit">
              Update Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVehicle;
