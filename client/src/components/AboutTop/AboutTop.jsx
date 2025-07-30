import React from "react";
import bg from "../../assets/images/gallery/bg.png";
import image8 from "../../assets/images/gallery/tyre.png";
function AboutTop() {
  return (
    <>
      <section class="page-title" style={{ backgroundImage: `url(${bg})` }}>
        <div class="auto-container">
          <h2>About us</h2>
          <ul class="page-breadcrumb">
            <li>
              <a href="index.html">home</a>
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
                    Bring to the table win-win survival strategies to ensure
                    proactive domination. At the end of the day, going forward,
                    a new normal that has evolved from generation X is on the
                    runway heading towards a streamlined cloud solution. User
                    generated content in real-time will have multiple
                    touchpoints for offshoring.
                  </p>
                  <p>
                    Capitalize on low hanging fruit to identify a ballpark value
                    added activity to beta test. Override the digital divide
                    with additional clickthroughs from DevOps. Nanotechnology
                    immersion along the information heading towards a
                    streamlined cloud solution. User generated content in
                    real-time will have multiple.
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
