import React from "react";
import logo from "../../assets/images/custom/logo.png";
import iconBar from "../../assets/images/icons/icon-bar.png";
import logoTwo from "../../assets/images/logo-two.png";

function Header() {
  return (
    <>
      <header className="main-header header-style-one">
        {/* <!-- Header Top --> */}
        <div className="header-top">
          <div className="auto-container">
            <div className="inner-container">
              <div className="left-column">
                <div className="text">Enjoy the Beso while we fix your car</div>
                <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
              </div>
              <div className="right-column">
                <div className="phone-number">
                  Schedule Your Appontment Today :{" "}
                  <strong>1800 456 7890</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Header Upper --> */}
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container">
              {/* <!--Logo--> */}
              <div className="logo-box">
                <div className="logo">
                  <a href="/">
                    <img src={logo} alt="logo" />
                  </a>
                </div>
              </div>
              <div className="right-column">
                {/* <!--Nav Box--> */}
                <div className="nav-outer">
                  {/* <!--Mobile Navigation Toggler--> */}
                  <div className="mobile-nav-toggler">
                    <img src={iconBar} alt="Icon Bar" />
                  </div>

                  {/* <!-- Main Menu --> */}
                  <nav className="main-menu navbar-expand-md navbar-light">
                    <div
                      className="collapse navbar-collapse show clearfix"
                      id="navbarSupportedContent"
                    >
                      <ul className="navigation">
                        <li className="dropdown">
                          <a href="/">Home</a>
                        </li>
                        <li className="dropdown">
                          <a href="/about">About Us</a>
                        </li>
                        <li className="dropdown">
                          <a href="/services">Services</a>
                        </li>
                        <li>
                          <a href="/contact">Contact Us</a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="search-btn"></div>
                <div className="link-btn">
                  <a href="/login" className="theme-btn btn-style-one">
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--End Header Upper--> */}

        {/* <!-- Sticky Header  --> */}
        <div className="sticky-header">
          {/* <!-- Header Upper --> */}
          <div className="header-upper">
            <div className="auto-container">
              <div className="inner-container">
                {/* <!--Logo--> */}
                <div className="logo-box">
                  <div className="logo">
                    <a href="/">
                      <img src={logo} alt="Logo" />
                    </a>
                  </div>
                </div>
                <div className="right-column">
                  {/* <!--Nav Box--> */}
                  <div className="nav-outer">
                    {/* <!--Mobile Navigation Toggler--> */}
                    <div className="mobile-nav-toggler">
                      <img src={iconBar} alt="Icon Bar" />
                    </div>

                    {/* <!-- Main Menu --> */}
                    <nav className="main-menu navbar-expand-md navbar-light"></nav>
                  </div>
                  <div className="search-btn"></div>
                  <div className="link-btn">
                    <a href="/login" className="theme-btn btn-style-one">
                      Login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--End Header Upper--> */}
        </div>
        {/* <!-- End Sticky Menu --> */}

        {/* <!-- Mobile Menu  --> */}
        <div className="mobile-menu">
          <div className="menu-backdrop"></div>
          <div className="close-btn">
            <span className="icon flaticon-remove"></span>
          </div>

          <nav className="menu-box">
            <div className="nav-logo">
              <a href="index.html">
                <img src={logoTwo} alt="" />
              </a>
            </div>
            <div className="menu-outer">
              {/* <!--Here Menu Will Come Automatically Via Javascript / Same Menu as in Header--> */}
            </div>
          </nav>
        </div>
        {/* <!-- End Mobile Menu --> */}

        <div className="nav-overlay">
          <div className="cursor"></div>
          <div className="cursor-follower"></div>
        </div>
      </header>
    </>
  );
}

export default Header;
