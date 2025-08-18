import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import EmployeesList from "../../../../components/Admin/Employee/EmployeesList/EmployeesList";
function Employees() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <EmployeesList />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Employees;
