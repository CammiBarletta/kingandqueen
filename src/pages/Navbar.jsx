import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import "../Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  const { carrito, vaciarCarrito }                          = useCartContext();
  const { isAuthenticated, cerrarSesion: cerrarSesionAuth } = useAuthContext();

  const totalItems  = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrecio = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * (item.cantidad || 1), 0
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    vaciarCarrito();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className={`navbar-header fixed-top ${scrolled ? "navbar-header--scrolled" : ""}`}>

      <div className="navbar-top">
        {/*
          navbar-top__inner tiene 3 hijos directos:
          1. navbar-top__left  → columna izquierda (logo)
          2. navbar-search     → columna central  (buscador)
          3. navbar-top__right → columna derecha  (acceder + carrito)
          El grid 1fr/auto/1fr hace que izq y der sean iguales,
          y el buscador queda matemáticamente centrado.
        */}
        <div className="navbar-top__inner">

          {/* ── COLUMNA IZQUIERDA: Logo ── */}
          <div className="navbar-top__left">
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <svg className="navbar-logo__icon" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
                <ellipse cx="20" cy="30" rx="10" ry="13"/>
                <ellipse cx="80" cy="30" rx="10" ry="13"/>
                <ellipse cx="38" cy="18" rx="9" ry="12"/>
                <ellipse cx="62" cy="18" rx="9" ry="12"/>
                <path d="M50 40 C25 40 15 55 18 70 C21 85 35 90 50 90 C65 90 79 85 82 70 C85 55 75 40 50 40Z"/>
              </svg>
              <div className="navbar-logo__text">
                <span className="navbar-logo__name">King & Queen</span>
                <span className="navbar-logo__sub">PET SHOP</span>
              </div>
            </Link>
          </div>

          {/* ── COLUMNA CENTRAL: Buscador ── */}
          <div className="navbar-search">
            <input
              type="text"
              className="navbar-search__input"
              placeholder="Buscar productos, marcas..."
            />
            <button className="navbar-search__btn" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* ── COLUMNA DERECHA: Acceder + Carrito + Hamburguesa ── */}
          <div className="navbar-top__right">

            {/* Lupa mobile — oculta en desktop, visible en mobile */}
            <button
              className="navbar-icon-btn navbar-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Acceder / Salir */}
            {isAuthenticated ? (
              <button className="navbar-actions__auth-btn" onClick={handleCerrarSesion}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                <span className="navbar-actions__label">Salir</span>
              </button>
            ) : (
              <Link to="/iniciarsesion" className="navbar-actions__auth-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="navbar-actions__label">Acceder</span>
              </Link>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="navbar-actions__cart">
              <div className="navbar-actions__cart-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <span className="navbar-actions__cart-badge">{totalItems}</span>
                )}
              </div>
              <span className="navbar-actions__cart-price">${totalPrecio.toFixed(2)}</span>
            </Link>

            {/* Hamburguesa mobile */}
            <button
              className={`navbar-hamburger ${menuOpen ? "navbar-hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>

          </div>
        </div>

        {/* Buscador expandible mobile */}
        {searchOpen && (
          <div className="navbar-search-mobile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="navbar-search-mobile__input"
              placeholder="Buscar productos..."
              autoFocus
            />
          </div>
        )}
      </div>

      {/* ── NIVEL 2: Navegación ── */}
      <nav
        className={`navbar-nav ${menuOpen ? "navbar-nav--open" : ""}`}
        aria-label="Navegación principal"
      >
        <ul className="navbar-nav__list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to} className="navbar-nav__item">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `navbar-nav__link ${isActive ? "navbar-nav__link--active" : ""}`
                }
                onClick={closeMenu}
              >
                {label}
                <span className="navbar-nav__underline" aria-hidden="true" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </header>
  );
}