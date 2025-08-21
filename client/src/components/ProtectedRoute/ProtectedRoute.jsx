// AdminProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../../context/auth"; 

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const employee = await getAuth();
      if (
        employee &&
        employee.employee_token &&
        employee.employee_role === "admin"
      ) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
