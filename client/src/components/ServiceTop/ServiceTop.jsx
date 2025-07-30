import React from "react";
import bg from "../../assets/images/gallery/bg.png";
function ServiceTop() {
  return (
    <>
      <section className="page-title" style={{ backgroundImage: `url(${bg})` }}>
        <div className="auto-container">
          <h2>Our Services</h2>
          <ul className="page-breadcrumb">
            <li>
              <a href="index.html">home</a>
            </li>
            <li>Services</li>
          </ul>
        </div>
        {/* <h1 data-parallax='{"x": 200}'>Car Repairing</h1> */}
      </section>
    </>
  );
}

export default ServiceTop;
