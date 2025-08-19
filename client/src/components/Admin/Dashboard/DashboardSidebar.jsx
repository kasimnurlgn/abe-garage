import React from "react";
import { Link } from "react-router-dom";
import css from "./DashboardSidebar.module.css";
function DashboardSidebar() {
  return (
    <>
      <div className={css.sidebarHeader}>
        <h1 className="ml-4">Admin Menu</h1>
      </div>
      <div className={css.listItems} style={{ backgroundColor: "#232B48" }}>
        <Link
          to="/admin/dashboard"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/orders"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Orders
        </Link>
        <Link
          to="/admin/orders/create/:customer_hash"
          className={`list-group-item ${css.listItemOverride}`}
        >
          New order
        </Link>
        <Link
          to="/admin/add-employee"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Add employee
        </Link>
        <Link
          to="/admin/employees"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Employees
        </Link>
        <Link
          to="/admin/add-customer"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Add customer
        </Link>
        <Link
          to="/admin/customers"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Customers
        </Link>
        <Link
          to="/admin/vehicles"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Vehicles
        </Link>

        <Link
          to="/admin/services"
          className={`list-group-item ${css.listItemOverride}`}
        >
          Services
        </Link>
      </div>
    </>
  );
}

export default DashboardSidebar;
