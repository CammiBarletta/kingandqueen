import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import "../Navbar.css";
import { BsCart3 } from "react-icons/bs";

/* LINKS NUEVOS (con Ofertas destacado) */
const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },

];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const navigate = useNavigate();
  const { carrito, vaciarCarrito, toggleDrawer } = useCartContext();
  const { isAuthenticated, usuario, cerrarSesion: cerrarSesionAuth } = useAuthContext();

  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrecio = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * (item.cantidad || 1),
    0
  );

  /* SCROLL */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    vaciarCarrito();
  };

  /* BUSCADOR FUNCIONAL */
  const handleBuscar = (e) => {
    e.preventDefault();
    const texto = textoBusqueda.trim();
    if (!texto) return;
    navigate(`/productos?q=${encodeURIComponent(texto)}`);
    setTextoBusqueda("");
    closeMenu();
  };

  return (
    <header className={`navbar-header fixed-top ${scrolled ? "navbar-header--scrolled" : ""}`}>
      <div className="navbar-top">
        <div className="navbar-top__inner">

          {/* LOGO */}
          <div className="navbar-top__left">
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <svg className="navbar-logo__icon" viewBox="0 0 100 100" fill="currentColor">
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

          {/* BUSCADOR DESKTOP */}
          <form className="navbar-search" onSubmit={handleBuscar} role="search">
            <input
              type="text"
              className="navbar-search__input"
              placeholder="Buscar productos, marcas..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
            />
            <button type="submit" className="navbar-search__btn" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* DERECHA */}
          <div className="navbar-top__right">

            {/* LUPA MOBILE */}
            <button
              className="navbar-icon-btn navbar-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              🔍
            </button>

            {/* USUARIO */}
            {isAuthenticated ? (
              <div className="navbar-actions__user">
                <span className="navbar-actions__username">
                  Hola, {usuario?.nombre ?? "Admin"}
                </span>
                <button className="navbar-actions__auth-btn" onClick={handleCerrarSesion}>
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/iniciarsesion" className="navbar-actions__auth-btn">
                Acceder
              </Link>
            )}

            {/* CARRITO MEJORADO */}
            <button
              onClick={toggleDrawer}
              className="navbar-actions__cart border-0 bg-transparent p-0"
              aria-label="Abrir carrito"
              title="Ver carrito"
            >
              <div className="navbar-actions__cart-icon-wrap">
                <BsCart3 size={24} />
                {totalItems > 0 && (
                  <span
                    className="navbar-actions__cart-badge"
                    aria-live="polite"
                    key={totalItems}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="navbar-actions__cart-price">
                ${totalPrecio.toFixed(2)}
              </span>
            </button>

            {/* HAMBURGUESA */}
            <button
              className={`navbar-hamburger ${menuOpen ? "navbar-hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* BUSCADOR MOBILE */}
        {searchOpen && (
          <form className="navbar-search-mobile" onSubmit={handleBuscar}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              autoFocus
            />
          </form>
        )}

        {/* NAV LINKS */}
        <nav className={`navbar-nav ${menuOpen ? "navbar-nav--open" : ""}`}>
          <ul className="navbar-nav__list">
            {NAV_LINKS.map(({ to, label, destacado }) => (
              <li key={to} className="navbar-nav__item">
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `navbar-nav__link 
                     ${isActive ? "navbar-nav__link--active" : ""} 
                     ${destacado ? "navbar-nav__link--oferta" : ""}`
                  }
                  onClick={closeMenu}
                >
                  {label}
                  <span className="navbar-nav__underline" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}