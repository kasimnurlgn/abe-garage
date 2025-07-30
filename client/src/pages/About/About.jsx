import React from "react";
import AboutTop from "../../components/AboutTop/AboutTop";
import AboutBottom from "../../components/AboutBottom/AboutBottom";
import WhyUs from "../../components/WhyUs/WhyUs";
import Since from "../../components/Since/Since";
import Appointment from "../../components/Appointment/Appointment";
import Layout from "../Layout/Layout";
function About() {
  return (
    <Layout>
      <AboutTop />
      <AboutBottom />
      <WhyUs />
      <Since />
      <Appointment />
    </Layout>
  );
}

export default About;
