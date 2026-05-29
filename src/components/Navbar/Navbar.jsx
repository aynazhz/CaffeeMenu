import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { path: "/", label: "خانه" },
    { path: "/menu", label: "منو" },
    { path: "/about", label: "درباره ما" },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg cafe-navbar ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="container">

        {/* Logo */}
        <NavLink className="navbar-brand brand-logo" to="/">
          ☕ Coffee House
        </NavLink>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse justify-content-center" id="mainNavbar">
          <ul className="navbar-nav gap-lg-4 text-center">

            {links.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active-link"
                      : "nav-link nav-link-custom"
                  }
                  onClick={() => {
                    // بستن منوی موبایل بعد کلیک
                    const navbar = document.getElementById("mainNavbar");
                    if (navbar?.classList.contains("show")) {
                      navbar.classList.remove("show");
                    }
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

          </ul>
        </div>

        {/* Button */}
        <Button className="order-btn rounded-pill px-4">
          سفارش
        </Button>

      </div>
    </nav>
  );
}