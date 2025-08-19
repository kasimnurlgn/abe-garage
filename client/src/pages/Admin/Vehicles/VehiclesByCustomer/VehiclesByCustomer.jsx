import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import VehiclesByCustomer from "../../../../components/Admin/Vehicles/VehiclesByCustomer/VehiclesByCustomer"
function Vehicle() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <VehiclesByCustomer />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Vehicle;
