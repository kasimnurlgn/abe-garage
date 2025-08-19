import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import CreateVehicle from "../../../../components/Admin/Vehicles/CreateVehicle/CreateVehicle"
function Vehicle() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <CreateVehicle />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Vehicle;
