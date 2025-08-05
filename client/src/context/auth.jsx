const decodeTokenPayload = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const getAuth = async () => {
  const employee = JSON.parse(localStorage.getItem("employee")) || {};
  if (employee && employee.employee_token) {
    const decodedToken = await decodeTokenPayload(employee.employee_token);
    // Map backend fields to frontend expectations
    employee.employee_id = decodedToken.employee_id;
    employee.employee_role = decodedToken.role; // Use 'role' from JWT
    employee.employee_first_name = employee.first_name; // Use 'first_name' from localStorage
    return employee;
  }
  return {};
};

export { getAuth };
