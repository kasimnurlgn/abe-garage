import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Service from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import GetOrders from "./pages/Admin/Orders/GetOrders/GetOrders";
import EditOrder from "./pages/Admin/Orders/EditOrder/EditOrder";
import CreateOrder from "./pages/Admin/Orders/CreateOrder/CreateOrder";
import GetCustomers from "./pages/Admin/Customers/GetCustomers/GetCustomers";
import EditCustomer from "./pages/Admin/Customers/EditCustomer/EditCustomer";
import AddCustomer from "./pages/Admin/Customers/AddCustomer/AddCustomer";
import EditService from "./pages/Admin/Services/EditService/EditService";
import ServicesList from "./pages/Admin/Services/ServiceList/ServicesList";
import EmployeesList from "./pages/Admin/Employees/EmployeesList/EmployeesList";
import AddEmployee from "./pages/Admin/Employees/AddEmployee/AddEmployee";
import EditEmployee from "./pages/Admin/Employees/EditEmployee/EditEmployee";
import EditVehicle from "./pages/Admin/Vehicles/EditVehicle/EditVehicle";
import VehiclesList from "./pages/Admin/Vehicles/VehiclesList/VehiclesList";
import CreateVehicle from "./pages/Admin/Vehicles/CreateVehicle/CreateVehicle";
import VehiclesByCustomer from "./pages/Admin/Vehicles/VehiclesByCustomer/VehiclesByCustomer";
import VehicleDetails from "./pages/Admin/Vehicles/VehicleDetails/VehicleDetails";
import OrderDetail from "./pages/Admin/Orders/OrderDetail/OrderDetail";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function RouterApp() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <GetOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:order_hash"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/create/:customer_hash"
          element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/edit/:order_hash"
          element={
            <ProtectedRoute>
              <EditOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <GetCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers/edit/:id"
          element={
            <ProtectedRoute>
              <EditCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <ServicesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/edit/:id"
          element={
            <ProtectedRoute>
              <EditService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <EmployeesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-employee"
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/edit/:vehicle_id"
          element={
            <ProtectedRoute>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute>
              <VehiclesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/create"
          element={
            <ProtectedRoute>
              <CreateVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/:vehicle_id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/customer/:customer_hash"
          element={
            <ProtectedRoute>
              <VehiclesByCustomer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
export default RouterApp;
