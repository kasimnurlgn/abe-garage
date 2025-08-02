import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Service from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login"
function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Service />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      {/* Redirect to Home for unmatched routes */}
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default RouterApp;
