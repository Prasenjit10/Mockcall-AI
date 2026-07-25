import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/sales-roleplay", label: "Sales Roleplay" },
  { to: "/pricing", label: "Pricing" },
  { to: "/case-studies", label: "Case Studies" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="pulse-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          Mockcall AI
        </NavLink>

        <nav className="navbar-links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " active" : "")
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="btn btn-primary navbar-cta">
            Request Demo
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
