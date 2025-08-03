import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const Dashboard = [
    {
      link: "/admin/orders",
      h5: "Open For All",
      h2: "All Orders",
      div: "LIST OF ORDER +",
      icon: "flaticon-power",
    },
    {
      link: "/admin/order",
      h5: "Admin Role",
      h2: "Create Order",
      div: "NEW ORDER +",
      icon: "flaticon-power",
    },
    {
      link: "/admin/add-employee",
      h5: "Admin Role",
      h2: "Add Employee",
      div: "EMPLOYEE +",
      icon: "flaticon-power",
    },
    {
      link: "/admin/employees",
      h5: "Open For All",
      h2: "Employees List",
      div: "EMPLOYEEs List",
      icon: "flaticon-power",
    },
    {
      link: "/admin/add-customer",
      h5: "Admin Role",
      h2: "Add Customer",
      div: "CUSTOMER List",
      icon: "flaticon-power",
    },
    {
      link: "/admin/customers",
      h5: "Open For All",
      h2: "Customers List",
      div: "Customers List",
      icon: "flaticon-power",
    },
    {
      link: "/admin/services",
      h5: "Open For All",
      h2: "Services List",
      div: "Service +",
      icon: "flaticon-power",
    },
    {
      link: "/admin/services",
      h5: "Open For All",
      h2: "Service & Repair",
      div: "Service and Repairs +",
      icon: "flaticon-car-engine",
    },

    {
      link: "/admin/services",
      h5: "Service and Repairs",
      h2: "Tyre & Wheels",
      div: "read more +",
      icon: "flaticon-tire",
    },
  ];
  return (
    <section className="services-section">
      <div className="auto-container">
        <div className="sec-title style-two">
          <h2>Admin Dashboard</h2>
          <div className="text">
            Bring to the table win-win survival strategies to ensure proactive
            domination. At the end of the day, going forward, a new normal that
            has evolved from generation X is on the runway heading towards a
            streamlined cloud solution.{" "}
          </div>
        </div>
        <div className="row">
          {Dashboard.map((item, index) => (
            <div className="col-lg-4 service-block-one" key={index}>
              <div className="inner-box hvr-float-shadow">
                <h5>{item.h5} </h5>
                <h2>{item.h2}</h2>
                <Link to={item.link} className="read-more">
                  {item.div}
                </Link>
                <div className="icon">
                  <span className={item.icon}></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
