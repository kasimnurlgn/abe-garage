import React from "react";
import Hero from "../../components/Hero/Hero";
import AboutBottom from "../../components/AboutBottom/AboutBottom";
import Services from "../../components/Services/Services";
import Features from "../../components/Features/Features";
import WhyUs from "../../components/WhyUs/WhyUs";
import Since from "../../components/Since/Since";
import Layout from "../Layout/Layout";
import Appointment from "../../components/Appointment/Appointment";
function Home() {
  return (
    <Layout>
      <Hero />
      <AboutBottom />
      <Services />
      <Features />
      <WhyUs />
      <Since />
      <Appointment />
    </Layout>
  );
}

export default Home;
