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
function RouterApp() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<GetOrders />} />
        <Route path="/admin/orders/edit/:order_hash" element={<EditOrder />} />
        <Route
          path="/admin/orders/create/:customer_hash"
          element={<CreateOrder />}
        />
        <Route path="/admin/customers" element={<GetCustomers />} />
      </Routes>
    </>
  );
}

export default RouterApp;
