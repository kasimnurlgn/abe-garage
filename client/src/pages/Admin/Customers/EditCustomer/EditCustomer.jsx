import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";

import EditCustomer from "../../../../components/Admin/Customer/EditCustomer/EditCustomer";

function Customers() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <EditCustomer />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Customers;
