import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Services from "../components/Services/Services";
function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Services />
      <Footer />
    </div>
  );
}

export default Home;
