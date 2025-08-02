import React from "react";
import mybg from "../../assets/images/gallery/mybg.avif";
function Since() {
  return (
    <section className="video-section">
      <div
        data-parallax='{"y": 50}'
        className="sec-bg"
        style={{ backgroundImage: `url(${mybg})` }}
      ></div>
      <div className="auto-container">
        <h5>Working since 1999</h5>
        <h2>
          We are leader <br /> in Car Mechanical Work
        </h2>
        <div className="video-box">
          <div className="video-btn">
            <a
              href="https://www.youtube.com/watch?v=PUkAIAIzA0I"
              className="overlay-link lightbox-image video-fancybox ripple"
            >
              <i className="flaticon-play"></i>
            </a>
          </div>
          <div className="text">
            Watch intro video <br /> about us
          </div>
        </div>
      </div>
    </section>
  );
}

export default Since;
