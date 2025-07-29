import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Services from "../components/Services/Services";
import Features from "../components/Features/Features";
function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Features />
      <Footer />
    </>
  );
}

export default Home;
