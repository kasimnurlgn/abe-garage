import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import EditService from "../../../../components/Admin/Services/EditService/EditService";
function Services() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <EditService />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Services;
