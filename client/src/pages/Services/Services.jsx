import React from "react";
import ServiceTop from "../../components/ServiceTop/ServiceTop";
import ServiceBottom from "../../components/ServiceBottom/ServiceBottom";
import Layout from "../Layout/Layout";
import Since from "../../components/Since/Since";
import Appointment from "../../components/Appointment/Appointment";
import WhyUs from "../../components/WhyUs/WhyUs";

function Services() {
  return (
    <Layout>
      <ServiceTop />
      <ServiceBottom />
      <WhyUs />
      <Since />
      <Appointment />
    </Layout>
  );
}

export default Services;
