import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";

import AddEmployee from "../../../../components/Admin/Employee/AddEmployee/AddEmployee";

function Employee() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <AddEmployee />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Employee;
