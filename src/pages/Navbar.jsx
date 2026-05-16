import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import "../Navbar.css";
import { BsCart3 } from "react-icons/bs";

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
              <div className="navbar-logo__text">
    <span className="navbar-logo__name">King & Queen</span>
    <span className="navbar-logo__sub">PET SHOP</span>
  </div>
            </Link>
          </div>

          {/* BUSCADOR DESKTOP */}
          <form className="navbar-search" onSubmit={handleBuscar} role="search">
            <div className="navbar-search__wrap">
              <svg className="navbar-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="navbar-search__input"
                placeholder="Buscar productos, marcas..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              {textoBusqueda && (
                <button
                  type="button"
                  className="navbar-search__clear"
                  onClick={() => setTextoBusqueda("")}
                  aria-label="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
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
                  👋 {usuario?.nombre?.split(" ")[0] ?? "Usuario"}
                </span>
                {usuario?.isAdmin && (
                  <Link to="/admin" className="navbar-actions__admin-btn" onClick={closeMenu}>
                    ⚙️ Panel
                  </Link>
                )}
                <button className="navbar-actions__auth-btn" onClick={handleCerrarSesion}>
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/iniciarsesion" className="navbar-actions__auth-btn">
                Acceder
              </Link>
            )}

            {/* SEPARADOR */}
            <div className="navbar-top__divider" />

            {/* CARRITO */}
            <button
              onClick={toggleDrawer}
              className={`navbar-actions__cart border-0 bg-transparent p-0 ${totalItems > 0 ? "navbar-actions__cart--active" : ""}`}
              aria-label="Abrir carrito"
              title="Ver carrito"
            >
              <div className="navbar-actions__cart-icon-wrap">
                <BsCart3 size={22} />
                {totalItems > 0 && (
                  <span className="navbar-actions__cart-badge" aria-live="polite" key={totalItems}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="navbar-actions__cart-price">
                ${totalPrecio.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="navbar-search-mobile__input"
              placeholder="Buscar productos..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              autoFocus
            />
          </form>
        )}
      </div>

      {/* NAV LINKS — fuera de navbar-top para mejor separación */}
      <nav className={`navbar-nav ${menuOpen ? "navbar-nav--open" : ""}`}>
        <ul className="navbar-nav__list">
          {NAV_LINKS.map(({ to, label, destacado }) => (
            <li key={to} className="navbar-nav__item">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `navbar-nav__link ${isActive ? "navbar-nav__link--active" : ""} ${destacado ? "navbar-nav__link--oferta" : ""}`
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
    </header>
  );
}