import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../../context/auth";
import { BeatLoader } from "react-spinners";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await getAuth();
        console.log("Auth data in ProtectedRoute:", authData);
        setIsAuthenticated(!!authData.employee_token);
      } catch (err) {
        console.error("Error checking auth:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <BeatLoader color="#123abc" size={10} />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;
