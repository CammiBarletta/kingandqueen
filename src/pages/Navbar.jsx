import { NavLink, Link } from "react-router-dom";

export default function Navbar({ carrito = [] }) {
  const totalItems = carrito.reduce((sum, item) =>
    sum + (item.cantidad || 1), 0
  );

  const totalPrecio = carrito.reduce((sum, item) =>
    sum + (Number(item.precio) * (item.cantidad || 1)), 0
  );

  return (
    <header className="fixed-top shadow-sm">

      {/* NIVEL 1 — Logo, buscador, acceder, carrito */}
      <div style={{ backgroundColor: "#4DB8C8" }} className="py-2">
        <div className="container-fluid px-4 d-flex align-items-center gap-3">

          {/* Logo */}
          <Link to="/" className="text-decoration-none">
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
                style={{ borderRadius: "20px 0 0 20px", border: "none" }}
              />
              <button
                className="btn"
                style={{ backgroundColor: "white", borderRadius: "0 20px 20px 0", border: "none" }}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Acceder */}
          <Link
            to="/login"
            className="text-decoration-none"
            style={{ color: "white", fontSize: "0.9rem", whiteSpace: "nowrap" }}
          >
            👤 Acceder
          </Link>

          {/* Carrito */}
          <Link
            to="/carrito"
            className="text-decoration-none d-flex align-items-center gap-1 px-3 py-1"
            style={{ backgroundColor: "#2C2C2C", color: "white", borderRadius: "6px", whiteSpace: "nowrap", fontSize: "0.9rem" }}
          >
            🛒 ${totalPrecio.toFixed(2)}
            {totalItems > 0 && (
              <span className="badge rounded-pill ms-1" style={{ backgroundColor: "#4DB8C8" }}>
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

            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) =>
                isActive ? "nav-link fw-bold" : "nav-link"
              } style={({ isActive }) => ({
                color: isActive ? "#4DB8C8" : "white",
                fontSize: "0.9rem"
              })}>
                INICIO
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/productos" className={({ isActive }) =>
                isActive ? "nav-link fw-bold" : "nav-link"
              } style={({ isActive }) => ({
                color: isActive ? "#4DB8C8" : "white",
                fontSize: "0.9rem"
              })}>
                PRODUCTOS
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/nosotros" className={({ isActive }) =>
                isActive ? "nav-link fw-bold" : "nav-link"
              } style={({ isActive }) => ({
                color: isActive ? "#4DB8C8" : "white",
                fontSize: "0.9rem"
              })}>
                NOSOTROS
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/contacto" className={({ isActive }) =>
                isActive ? "nav-link fw-bold" : "nav-link"
              } style={({ isActive }) => ({
                color: isActive ? "#4DB8C8" : "white",
                fontSize: "0.9rem"
              })}>
                CONTACTO
              </NavLink>
            </li>

          </ul>
        </div>
      </div>

    </header>
  );
}