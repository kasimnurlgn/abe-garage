import React from "react";
import ContactUs from "../../components/ContactUs/ContactUs";
import Layout from "../../pages/Layout/Layout";
import Appointment from "../../components/Appointment/Appointment";
function Contact() {
  return (
    <Layout>
      <ContactUs />
      <Appointment />
    </Layout>
  );
}

export default Contact;
