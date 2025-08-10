import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import Layout from "../../../Layout/Layout";
import EditOrder from "../../../../components/Admin/Orders/EditOrder/EditOrder";
function Orders() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <EditOrder />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
