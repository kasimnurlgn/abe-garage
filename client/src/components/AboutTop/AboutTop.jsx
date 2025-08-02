import React from "react";
import bg from "../../assets/images/gallery/bg.png";
import image8 from "../../assets/images/gallery/tyre.png";
import { Link } from "react-router-dom";
function AboutTop() {
  return (
    <>
      <section class="page-title" style={{ backgroundImage: `url(${bg})` }}>
        <div class="auto-container">
          <h2>About us</h2>
          <ul class="page-breadcrumb">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>About us</li>
          </ul>
        </div>
        {/* <h1 data-parallax='{"x": 200}'>Car Repairing</h1> */}
      </section>

      <section class="about-section-three">
        <div class="auto-container">
          <div class="row">
            <div class="col-lg-7">
              <div class="content">
                <h2>
                  We are highly skilled mechanics <br /> for your car repair
                </h2>
                <div class="text">
                  <p>
                    we provide expert car repair and maintenance services with
                    honesty and reliability. From engine diagnostics to tire
                    replacement, our skilled mechanics are here to get you back
                    on the road quickly and safely.
                  </p>
                  <p>
                    Our garage is built on a foundation of trust, experience,
                    and modern technology. We provide a wide range of car repair
                    services—from diagnostics and routine maintenance to complex
                    engine work. Our certified mechanics are passionate about
                    vehicles and committed to delivering high-quality service
                    every time. Whether you're here for a quick check-up or a
                    full repair, you can expect honest advice, timely updates,
                    and outstanding results that keep your car running smoothly.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="image">
                <img src={image8} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutTop;
