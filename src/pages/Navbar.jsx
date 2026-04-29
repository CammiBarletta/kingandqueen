import { NavLink, Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { carrito, vaciarCarrito } = useCartContext();
  const { isAuthenticated, cerrarSesion: cerrarSesionAuth } = useAuthContext();

  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const totalPrecio = carrito.reduce((sum, item) =>
    sum + (Number(item.precio) * (item.cantidad || 1)), 0
  );

  // Cierra sesión y además limpia el carrito
  const handleCerrarSesion = () => {
    cerrarSesionAuth();
    vaciarCarrito();
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#4DB8C8" : "white",
    fontSize: "0.9rem",
    transition: "color 0.2s ease",
    textDecoration: "none",
  });

  return (
    <header className="fixed-top shadow-sm">

      {/* NIVEL 1 — Logo, buscador, acceder, carrito */}
      <div style={{ backgroundColor: "#4DB8C8" }} className="py-2">
        <div className="container-fluid px-4 d-flex align-items-center gap-3">

          {/* Logo */}
          <Link to="/" className="text-decoration-none" style={{ flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: "700", fontSize: "1.3rem", letterSpacing: "1px" }}>
              King & Queen
            </span>
            <span style={{ color: "white", fontSize: "0.7rem", display: "block", letterSpacing: "2px", marginTop: "-4px" }}>
              PET SHOP
            </span>
          </Link>

          {/* Buscador */}
          <div className="flex-grow-1 mx-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                style={{ borderRadius: "20px 0 0 20px", border: "none", fontSize: "0.9rem" }}
              />
              <button
                className="btn"
                style={{ backgroundColor: "white", borderRadius: "0 20px 20px 0", border: "none" }}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Acceder / Cerrar sesión */}
          {isAuthenticated ? (
            <button
              onClick={handleCerrarSesion}
              style={{
                color: "white",
                background: "none",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              👤 Cerrar sesión
            </button>
          ) : (
            <Link
              to="/iniciarsesion"
              style={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              👤 Acceder
            </Link>
          )}

          {/* Carrito */}
          <Link
            to="/carrito"
            className="text-decoration-none d-flex align-items-center gap-2 px-3 py-1"
            style={{
              backgroundColor: "#2C2C2C",
              color: "white",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              fontSize: "0.9rem",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3e3e3e"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2C2C2C"}
          >
            🛒
            <span style={{ fontWeight: "600" }}>${totalPrecio.toFixed(2)}</span>
            {totalItems > 0 && (
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: "#4DB8C8", fontSize: "0.75rem" }}
              >
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* NIVEL 2 — Navegación */}
      <div style={{ backgroundColor: "#2C2C2C" }} className="py-1">
        <div className="container-fluid px-4">
          <ul className="navbar-nav flex-row gap-4 justify-content-center">
            {[
              { to: "/", label: "INICIO" },
              { to: "/productos", label: "PRODUCTOS" },
              { to: "/nosotros", label: "NOSOTROS" },
              { to: "/contacto", label: "CONTACTO" },
            ].map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => isActive ? "nav-link fw-bold" : "nav-link"}
                  style={navLinkStyle}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </header>
  );
}