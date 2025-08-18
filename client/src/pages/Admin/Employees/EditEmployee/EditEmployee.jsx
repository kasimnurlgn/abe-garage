import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import EditEmployee from "../../../../components/Admin/Employee/EditEmployee/EditEmployee";
function Employee() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <EditEmployee />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Employee;
