import React from "react";
import logo from "../../assets/images/custom/logo.png";
import iconBar from "../../assets/images/icons/icon-bar.png";
import logoTwo from "../../assets/images/logo-two.png";

function Header() {
  return (
    <>
      <header class="main-header header-style-one">
        {/* <!-- Header Top --> */}
        <div class="header-top">
          <div class="auto-container">
            <div class="inner-container">
              <div class="left-column">
                <div class="text">Enjoy the Beso while we fix your car</div>
                <div class="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
              </div>
              <div class="right-column">
                <div class="phone-number">
                  Schedule Your Appontment Today :{" "}
                  <strong>1800 456 7890</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Header Upper --> */}
        <div class="header-upper">
          <div class="auto-container">
            <div class="inner-container">
              {/* <!--Logo--> */}
              <div class="logo-box">
                <div class="logo">
                  <a href="/">
                    <img src={logo} alt="logo" />
                  </a>
                </div>
              </div>
              <div class="right-column">
                {/* <!--Nav Box--> */}
                <div class="nav-outer">
                  {/* <!--Mobile Navigation Toggler--> */}
                  <div class="mobile-nav-toggler">
                    <img src={iconBar} alt="Icon Bar" />
                  </div>

                  {/* <!-- Main Menu --> */}
                  <nav class="main-menu navbar-expand-md navbar-light">
                    <div
                      class="collapse navbar-collapse show clearfix"
                      id="navbarSupportedContent"
                    >
                      <ul class="navigation">
                        <li class="dropdown">
                          <a href="/">Home</a>
                        </li>
                        <li class="dropdown">
                          <a href="/about">About Us</a>
                        </li>
                        <li class="dropdown">
                          <a href="/services">Services</a>
                        </li>
                        <li>
                          <a href="/contact">Contact Us</a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div class="search-btn"></div>
                <div class="link-btn">
                  <a href="/login" class="theme-btn btn-style-one">
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!--End Header Upper--> */}

        {/* <!-- Sticky Header  --> */}
        <div class="sticky-header">
          {/* <!-- Header Upper --> */}
          <div class="header-upper">
            <div class="auto-container">
              <div class="inner-container">
                {/* <!--Logo--> */}
                <div class="logo-box">
                  <div class="logo">
                    <a href="/">
                      <img src={logo} alt="Logo" />
                    </a>
                  </div>
                </div>
                <div class="right-column">
                  {/* <!--Nav Box--> */}
                  <div class="nav-outer">
                    {/* <!--Mobile Navigation Toggler--> */}
                    <div class="mobile-nav-toggler">
                      <img src={iconBar} alt="Icon Bar" />
                    </div>

                    {/* <!-- Main Menu --> */}
                    <nav class="main-menu navbar-expand-md navbar-light"></nav>
                  </div>
                  <div class="search-btn"></div>
                  <div class="link-btn">
                    <a href="/login" class="theme-btn btn-style-one">
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
        <div class="mobile-menu">
          <div class="menu-backdrop"></div>
          <div class="close-btn">
            <span class="icon flaticon-remove"></span>
          </div>

          <nav class="menu-box">
            <div class="nav-logo">
              <a href="index.html">
                <img src={logoTwo} alt="" />
              </a>
            </div>
            <div class="menu-outer">
              {/* <!--Here Menu Will Come Automatically Via Javascript / Same Menu as in Header--> */}
            </div>
          </nav>
        </div>
        {/* <!-- End Mobile Menu --> */}

        <div class="nav-overlay">
          <div class="cursor"></div>
          <div class="cursor-follower"></div>
        </div>
      </header>
    </>
  );
}

export default Header;
