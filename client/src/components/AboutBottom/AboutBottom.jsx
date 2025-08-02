import React from "react";
import vban1 from "../../assets/images/custom/misc/vban1.jpg";
import vban2 from "../../assets/images/custom/misc/vban2.jpg";
import { Link } from "react-router-dom";
function AboutBottom() {
  return (
    <>
      <section className="about-section">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-5">
              <div className="image-box">
                <img src={vban1} alt="" />
                <img src={vban2} alt="" />
                <div className="year-experience" data-parallax='{"y": 30}'>
                  <strong>17</strong> years <br />
                  Experience{" "}
                </div>
              </div>
            </div>
            <div className="col-lg-7 pl-lg-5">
              <div className="sec-title">
                <h5>Welcome to Our workshop</h5>
                <h2>We have 24 years experience</h2>
                <div className="text">
                  <p>
                    At AbeGarage, we're dedicated to transforming the way
                    garages operate by combining reliable service with smart
                    technology. Our goal is to make garage management simple,
                    efficient, and customer-friendly.
                  </p>
                  <p>
                    From real-time job tracking to easy customer communication,
                    we offer the tools garages need to grow and deliver better
                    results. Whether you're managing inventory, scheduling
                    repairs, or keeping clients informed, AbeGarage brings
                    everything together in one streamlined solution.
                  </p>
                </div>
                <div className="link-btn mt-40">
                  <Link
                    to="/about"
                    className="theme-btn btn-style-one style-two"
                  >
                    <span>
                      About Us <i className="flaticon-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutBottom;
