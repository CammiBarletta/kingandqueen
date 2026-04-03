import { useNavigate, Link } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{ backgroundColor: "#2C2C2C", color: "white", padding: "40px 0 20px", width: "100%" }}>
     <div className="container-fluid px-0">
        <div className="row">

          {/* COLUMNA 1 — Info del negocio */}
          <div className="col-12 col-md-4 mb-4">
            <h6 style={{ color: "#4DB8C8", fontWeight: "700", letterSpacing: "1px" }}>
              KING & QUEEN PET SHOP
            </h6>
            <hr style={{ borderColor: "#4DB8C8", width: "40px", margin: "10px 0" }} />
            <p style= {{ fontSize: "0.9rem", color: "#ccc" }}>Pet shop y Peluquería canina</p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.85rem", color: "#ccc" }}>
              <li>- Alimentos balanceados</li>
              <li>- Accesorios</li>
              <li>- Peluquería canina</li>
              <li>- Envíos disponibles</li>
            </ul>
            <p style={{ fontSize: "0.85rem", color: "#ccc" }} className="mt-3">
              Dale a tu mascota todo lo que se merece 🐾
            </p>
          </div>

          {/* COLUMNA 2 — Accesos directos */}
          <div className="col-12 col-md-4 mb-4">
            <h6 style={{ color: "#4DB8C8", fontWeight: "700", letterSpacing: "1px" }}>
              ACCESOS DIRECTOS
            </h6>
            <hr style={{ borderColor: "#4DB8C8", width: "40px", margin: "10px 0" }} />
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ borderBottom: "1px solid #444", padding: "8px 0" }}>
                <Link to="/" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.9rem" }}>
                  Inicio
                </Link>
              </li>
              <li style={{ borderBottom: "1px solid #444", padding: "8px 0" }}>
                <span
                  onClick={() => navigate("/productos")}
                  style={{ color: "#ccc", fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Productos
                </span>
              </li>
              <li style={{ borderBottom: "1px solid #444", padding: "8px 0" }}>
                <Link to="/nosotros" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.9rem" }}>
                  Nosotros
                </Link>
              </li>
              <li style={{ padding: "8px 0" }}>
                <Link to="/contacto" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.9rem" }}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3 — Contacto */}
          <div className="col-12 col-md-4 mb-4">
            <h6 style={{ color: "#4DB8C8", fontWeight: "700", letterSpacing: "1px" }}>
              CONTACTO
            </h6>
            <hr style={{ borderColor: "#4DB8C8", width: "40px", margin: "10px 0" }} />
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.85rem", color: "#ccc" }}>
              <li className="mb-2">📍 Buenos Aires, AR</li>
              <li className="mb-2">🕐 Lun-Sab: 08:00 a 20:00</li>
              <a href="https://wa.me/5491128714704" target="_blank" rel="noreferrer" style={{ color: "#4DB8C8", textDecoration: "none" }}>💬 WhatsApp </a>
              <a href="https://www.instagram.com/kingandqueen.petshop" target="_blank" rel="noreferrer" style={{ color: "#4DB8C8", textDecoration: "none" }}>📸 Instagram</a>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <hr style={{ borderColor: "#444" }} />
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#888", margin: 0 }}>
          PetShop © 2026 — Programado por @CammiBarletta
        </p>
      </div>
    </footer>
  );
}
