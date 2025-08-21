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
import AdminProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

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
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <GetOrders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:order_hash"
          element={
            <AdminProtectedRoute>
              <OrderDetail />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/create/:customer_hash"
          element={
            <AdminProtectedRoute>
              <CreateOrder />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/edit/:order_hash"
          element={
            <AdminProtectedRoute>
              <EditOrder />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminProtectedRoute>
              <GetCustomers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/customers/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditCustomer />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <AdminProtectedRoute>
              <AddCustomer />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminProtectedRoute>
              <ServicesList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/services/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditService />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <AdminProtectedRoute>
              <EmployeesList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-employee"
          element={
            <AdminProtectedRoute>
              <AddEmployee />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditEmployee />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/edit/:vehicle_id"
          element={
            <AdminProtectedRoute>
              <EditVehicle />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <AdminProtectedRoute>
              <VehiclesList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/create"
          element={
            <AdminProtectedRoute>
              <CreateVehicle />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/:vehicle_id"
          element={
            <AdminProtectedRoute>
              <VehicleDetails />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles/customer/:customer_hash"
          element={
            <AdminProtectedRoute>
              <VehiclesByCustomer />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
export default RouterApp;
