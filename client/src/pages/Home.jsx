import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Services from "../components/Services/Services";
import Features from "../components/Features/Features";
import WhyUs from "../components/WhyUs/WhyUs";
import Since from "../components/Since/Since";
import Layout from "./Layout";
import Appointment from "../components/Appointment/Appointment";
function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Features />
      <WhyUs />
      <Since />
      <Appointment />
    </Layout>
  );
}

export default Home;
