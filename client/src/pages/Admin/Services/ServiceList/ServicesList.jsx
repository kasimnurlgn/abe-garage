import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import ServicesList from "../../../../components/Admin/Services/ServiceList/ServicesList";
import CreateService from "../../../../components/Admin/Services/CreateService/CreateService";
function Services() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <ServicesList />
            <CreateService />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Services;
