import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import CreateOrder from "../../../../components/Admin/Orders/CreateOrder/CreateOrder";
function Orders() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <CreateOrder />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
