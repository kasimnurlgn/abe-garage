import React from "react";
import DashboardSidebar from "../../../../components/Admin/Dashboard/DashboardSidebar";
import GetOrders from "../../../../components/Admin/Orders/GetOrders/GetOrders";
import Layout from "../../../Layout/Layout";
import OrderDetail from "../../../../components/Admin/Orders/OrderDetail/OrderDetail";
function Orders() {
  return (
    <Layout>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <DashboardSidebar />
          </div>
          <div className="col-md-9 ">
            <OrderDetail />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
