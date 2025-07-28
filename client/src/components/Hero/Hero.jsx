import React from "react";
import banner1 from "../../assets/images/custom/banner/banner1.jpg";
function Hero() {
  return (
    <>
      <section className="video-section">
        <div
          data-parallax='{"y": 50}'
          className="sec-bg"
          style={{ backgroundImage: `url(${banner1})` }}
        ></div>
        <div className="auto-container">
          <h5>Working since 1999</h5>
          <h2>
            Tune up Your Car <br /> to Next Level
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
    </>
  );
}

export default Hero;
