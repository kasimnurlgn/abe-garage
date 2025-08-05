import React from "react";
import Layout from "../../../pages/Layout/Layout";
import DashboardSidebar from "./DashboardSidebar";
import DashboardCard from "./DashboardCard";

function DashboardContainer() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9">
            <DashboardCard />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardContainer;
