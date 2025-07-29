import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/custom/logo.png";
import iconBar from "../../assets/images/icons/icon-bar.png";
import logoTwo from "../../assets/images/logo-two.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header header-style-one">
      {/* Header Top */}
      <div className="header-top">
        <div className="auto-container">
          <div className="inner-container">
            <div className="left-column">
              <div className="text">Enjoy the Beso while we fix your car</div>
              <div className="office-hour">
                Monday - Saturday 7:00AM - 6:00PM
              </div>
            </div>
            <div className="right-column">
              <div className="phone-number">
                Schedule Your Appontment Today : <strong>1800 456 7890</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Upper */}
      <div className="header-upper">
        <div className="auto-container">
          <div className="inner-container">
            {/* Logo */}
            <div className="logo-box">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>
            <div className="right-column">
              {/* Nav Box */}
              <div className="nav-outer">
                {/* Mobile Navigation Toggler */}
                <div className="mobile-nav-toggler" onClick={toggleMobileMenu}>
                  <img src={iconBar} alt="" />
                </div>

                {/* Main Menu */}
                <nav className="main-menu navbar-expand-md navbar-light">
                  <div
                    className="collapse navbar-collapse show clearfix"
                    id="navbarSupportedContent"
                  >
                    <ul className="navigation">
                      <li className="dropdown">
                        <Link to="/">Home</Link>
                      </li>
                      <li className="dropdown">
                        <Link to="/about">About Us</Link>
                      </li>
                      <li className="dropdown">
                        <Link to="/services">Services</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="search-btn"></div>
              <div className="link-btn">
                <Link to="/login" className="theme-btn btn-style-one">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Upper */}

      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container">
              {/* Logo */}
              <div className="logo-box">
                <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="" />
                  </Link>
                </div>
              </div>
              <div className="right-column">
                {/* Nav Box */}
                <div className="nav-outer">
                  {/* Mobile Navigation Toggler */}
                  <div
                    className="mobile-nav-toggler"
                    onClick={toggleMobileMenu}
                  >
                    <img src={iconBar} alt="" />
                  </div>
                  {/* Main Menu */}
                  <nav className="main-menu navbar-expand-md navbar-light">
                    <div
                      className="collapse navbar-collapse show clearfix"
                      id="navbarSupportedContent"
                    >
                      <ul className="navigation">
                        <li className="dropdown">
                          <Link to="/">Home</Link>
                        </li>
                        <li className="dropdown">
                          <Link to="/about">About Us</Link>
                        </li>
                        <li className="dropdown">
                          <Link to="/services">Services</Link>
                        </li>
                        <li>
                          <Link to="/contact">Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="search-btn"></div>
                <div className="link-btn">
                  <Link to="/login" className="theme-btn btn-style-one">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Sticky Header */}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="menu-backdrop" onClick={toggleMobileMenu}></div>
        <div className="close-btn" onClick={toggleMobileMenu}>
          <span className="icon flaticon-remove"></span>
        </div>
        <nav className="menu-box">
          <div className="nav-logo">
            <Link to="/" onClick={toggleMobileMenu}>
              <img src={logoTwo} alt="" title="" />
            </Link>
          </div>
          <div className="menu-outer">
            <ul className="navigation">
              <li className="dropdown">
                <Link to="/" onClick={toggleMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="dropdown">
                <Link to="/about" onClick={toggleMobileMenu}>
                  About Us
                </Link>
              </li>
              <li className="dropdown">
                <Link to="/services" onClick={toggleMobileMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={toggleMobileMenu}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {/* End Mobile Menu */}

      <div className="nav-overlay">
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
      </div>
    </header>
  );
};

export default Header;
