import React from "react";
import logoTwo from "../../assets/images/logo-two.png";
function Footer() {
  return (
    <>
      <footer className="main-footer">
        {/* <!--Upper Box--> */}
        <div className="upper-box">
          <div className="auto-container">
            <div className="row no-gutters">
              {/* <!--Footer Info Box--> */}
              <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
                <div className="info-inner">
                  <div className="content">
                    <div className="icon">
                      <span className="flaticon-pin"></span>
                    </div>
                    <div className="text">
                      54B, Tailstoi Town 5238 MT, <br /> La city, IA 522364
                    </div>
                  </div>
                </div>
              </div>

              {/* <!--Footer Info Box--> */}
              <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
                <div className="info-inner">
                  <div className="content">
                    <div className="icon">
                      <span className="flaticon-email"></span>
                    </div>
                    <div className="text">
                      Email us : <br />{" "}
                      <a href="mailto:contact.contact@autorex.com">
                        contact@abegarge.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!--Footer Info Box--> */}
              <div className="footer-info-box col-md-4 col-sm-6 col-xs-12">
                <div className="info-inner">
                  <div className="content">
                    <div className="icon">
                      <span className="flaticon-phone"></span>
                    </div>
                    <div className="text">
                      Call us on : <br />
                      <strong>+ 1800 456 7890</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!--Widgets Section--> */}
        <div className="widgets-section">
          <div className="auto-container">
            <div className="widgets-inner-container">
              <div className="row clearfix">
                {/* <!--Footer Column--> */}
                <div className="footer-column col-lg-4">
                  <div className="widget widget_about">
                    <div className="logo">
                      <a href="index.html">
                        <img src={logoTwo} alt="Logo Two" />
                      </a>
                    </div>
                    <div className="text">
                      A modern garage management system that helps you run your
                      workshop efficiently. From booking services to tracking
                      repairs and managing inventory, everything is available in
                      one easy-to-use platform.
                    </div>
                  </div>
                </div>

                {/* <!--Footer Column--> */}
                <div className="footer-column col-lg-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="widget widget_links">
                        <h4 className="widget_title">Usefull Links</h4>
                        <div className="widget-content">
                          <ul className="list">
                            <li>
                              <a href="index.html">Home</a>
                            </li>
                            <li>
                              <a href="about.html">About Us</a>
                            </li>
                            <li>
                              <a href="#">Appointment</a>
                            </li>
                            <li>
                              <a href="testimonial.html">Testimonials</a>
                            </li>
                            <li>
                              <a href="contact.html">Contact Us</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="widget widget_links">
                        <h4 className="widget_title">Our Services</h4>
                        <div className="widget-content">
                          <ul className="list">
                            <li>
                              <a href="#">Performance Upgrade</a>
                            </li>
                            <li>
                              <a href="#">Transmission Service</a>
                            </li>
                            <li>
                              <a href="#">Break Repair & Service</a>
                            </li>
                            <li>
                              <a href="#">Engine Service & Repair</a>
                            </li>
                            <li>
                              <a href="#">Trye & Wheels</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!--Footer Column--> */}
                <div className="footer-column col-lg-4">
                  <div className="widget widget_newsletter">
                    <h4 className="widget_title">Newsletter</h4>
                    <div className="text">Get latest updates and offers.</div>
                    <div className="newsletter-form">
                      <form className="ajax-sub-form" method="post">
                        <div className="form-group">
                          <input
                            type="email"
                            placeholder="Enter your email"
                            id="subscription-email"
                          />
                          <button className="theme-btn" type="submit">
                            <span className="fas fa-paper-plane"></span>
                          </button>
                          <label
                            className="subscription-label"
                            for="subscription-email"
                          ></label>
                        </div>
                      </form>
                    </div>
                    <ul className="social-links">
                      <li>
                        <a href="#">
                          <span className="fab fa-facebook-f"></span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="fab fa-linkedin-in"></span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="fab fa-twitter"></span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="fab fa-google-plus-g"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!--Footer Bottom--> */}
        <div className="auto-container">
          <div className="footer-bottom">
            <div className="copyright-text">
              © 2025 <a href="#">Kasim Nurlgn</a> | All rights reserved.
            </div>
            <div className="text">
              Created by <a href="#">ThemeArc</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
