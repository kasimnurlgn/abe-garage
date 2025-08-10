import axios from "axios";
import { getAuth } from "../context/auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  console.log("Axios request config:", config); // Debug log
  if (config.url.includes("/orders/hash/")) {
    return config; // Skip Authorization for public endpoint
  }

  const employee = await getAuth();
  if (employee?.employee_token) {
    config.headers.Authorization = `Bearer ${employee.employee_token}`;
  }
  return config;
});

export default axiosInstance;
