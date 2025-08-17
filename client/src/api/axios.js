import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const employee = JSON.parse(localStorage.getItem("employee")) || {};
      const token = employee.employee_token;
      if (token) {
        console.log(
          "Attaching token to request:",
          token.substring(0, 20) + "..."
        );
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No employee_token found in localStorage");
      }
      return config;
    } catch (error) {
      console.error("Error parsing employee from localStorage:", error);
      return config;
    }
  },
  (error) => {
    console.error("Interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
