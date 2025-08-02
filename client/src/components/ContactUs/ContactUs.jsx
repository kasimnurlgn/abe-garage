import React from "react";
import bg from "../../assets/images/gallery/bg.png";
import { Link } from "react-router-dom";
function ContactUs() {
  return (
    <>
      <section className="page-title" style={{ backgroundImage: `url(${bg}` }}>
        <div className="auto-container">
          <h2>Contact</h2>
          <ul className="page-breadcrumb">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>Contact</li>
          </ul>
        </div>
        {/* <h1 data-parallax='{"x": 200}'>Car Repairing</h1> */}
      </section>
      <section className="contact-section">
        <div className="auto-container">
          <div className="row clearfix">
            {/* <!--Form Column--> */}
            <div className="form-column col-lg-6">
              <section className="map-section">
                <div className="contact-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3071.2910802067827!2d90.45905169331171!3d23.691532202989123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1577214205224!5m2!1sen!2sbd"
                    width="600"
                    height="470"
                    style={{ border: 0, width: "100%" }}
                    allowfullscreen=""
                  ></iframe>
                </div>
              </section>
            </div>

            {/* <!--Info Column--> */}
            <div className="info-column col-lg-5">
              <div className="inner-column sec-title">
                <h2>Our Address</h2>
                <div className="text">
                  Visit us at our convenient location where our expert team is
                  ready to provide you with top-quality car care and
                  personalized service you can trust.
                </div>
                <ul>
                  <li>
                    <i className="flaticon-pin"></i>
                    <span>Address:</span> 54B, Tailstoi Town 5238 MT, La city,
                    IA 5224
                  </li>
                  <li>
                    <i className="flaticon-email"></i>
                    <span>email:</span> contact@abegarage.com
                  </li>
                  <li>
                    <i className="flaticon-phone"></i>
                    <span>phone:</span> 1800 456 7890 / 1254 897 3654
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--End Contact Section--> */}
    </>
  );
}

export default ContactUs;
