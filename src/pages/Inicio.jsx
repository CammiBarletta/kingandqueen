import InicioBanner from "../components/InicioBanner";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";
import ProductCarousel from "../components/ProductCarousel";
import { Link } from "react-router-dom";
import "./Inicio.css";

// ── Franja de confianza con SVGs ─────────────────────────────────────────────
const BENEFICIOS = [
  {
    titulo: "Envío a todo el país",
    detalle: "Despachamos a cualquier provincia",
    icono: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    titulo: "Pago seguro",
    detalle: "Tus datos siempre protegidos",
    icono: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    titulo: "Atención personalizada",
    detalle: "Respondemos por WhatsApp",
    icono: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    titulo: "Productos seleccionados",
    detalle: "Solo marcas de calidad",
    icono: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

// ── URLs de imágenes de las cards de mascota ──────────────────────────────────

const IMG_PERROS = "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778884342/PERROS_1_qieor8.png"
const IMG_GATOS  = "https://res.cloudinary.com/ddutzhkpe/image/upload/v1778884343/GATOS_1_gaxtmr.png"
// ── Card de mascota reutilizable ──────────────────────────────────────────────
function MascotaCard({ to, imagen, gradiente, sombra, titulo, position = "center center" }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          height: "220px",
          background: imagen ? `url(${imagen}) ${position}/cover no-repeat` : gradiente,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "28px",
          cursor: "pointer",
          transition: "transform 0.25s, box-shadow 0.25s",
          boxShadow: sombra.normal,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = sombra.hover; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = sombra.normal; }}
      >
        {/* Overlay oscuro para legibilidad del texto sobre la imagen */}
        <div style={{
          position: "absolute", inset: 0,
          background: imagen
            ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)"
            : "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Productos para
          </p>
          <h3 style={{ color: "#fff", fontSize: "2rem", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: "700", margin: "0 0 16px" }}>
            {titulo}
          </h3>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "7px 16px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.3)" }}>
            Ver productos →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Inicio() {
  const { productosDestacados, productosActivos, cargando } = useProducts();

  if (cargando) return null;

  const masProductos = productosActivos.slice(0, 8);

  return (
    <>
      <InicioBanner />

      <div className="inicio-container">

        {/* ── Sección: Destacados ── */}
        <section className="inicio-section">
          <div className="inicio-section__header">
            <div className="inicio-section__label">Selección especial</div>
            <h2 className="inicio-section__title">Productos destacados</h2>
            <div className="inicio-section__divider" />
          </div>
          <ProductCarousel
            productos={
              productosDestacados.length > 0
                ? productosDestacados.slice(0, 6)
                : productosActivos.slice(0, 6)
            }
          />
        </section>

        {/* ── Separador decorativo ── */}
        <div className="inicio-separator">
          <span className="inicio-separator__line" />
          <span className="inicio-separator__icon">✦</span>
          <span className="inicio-separator__line" />
        </div>

        {/* ── Sección: Por mascota ── */}
        <section className="inicio-section">
          <div className="inicio-section__header">
            <div className="inicio-section__label">Explorá por mascota</div>
            <h2 className="inicio-section__title">¿Para quién comprás hoy?</h2>
            <div className="inicio-section__divider" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "8px" }}>
            <MascotaCard
              to="/productos?mascota=perro"
              imagen={IMG_PERROS}
              position="center 100%"
              gradiente="linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)"
              sombra={{ normal: "0 4px 20px rgba(26,58,42,0.18)", hover: "0 12px 32px rgba(26,58,42,0.28)" }}
              titulo="Perros"
            />
            <MascotaCard
              to="/productos?mascota=gato"
              imagen={IMG_GATOS}
              position="center center"
              gradiente="linear-gradient(135deg, #4DB8C8 0%, #2a8fa0 100%)"
              sombra={{ normal: "0 4px 20px rgba(77,184,200,0.22)", hover: "0 12px 32px rgba(77,184,200,0.35)" }}
              titulo="Gatos"
            />
          </div>
        </section>

        {/* ── Separador decorativo ── */}
        <div className="inicio-separator">
          <span className="inicio-separator__line" />
          <span className="inicio-separator__icon">✦</span>
          <span className="inicio-separator__line" />
        </div>

        {/* ── Sección: Más productos ── */}
        <section className="inicio-section">
          <div className="inicio-section__header">
            <div className="inicio-section__label">Catálogo</div>
            <h2 className="inicio-section__title">Más productos</h2>
            <div className="inicio-section__divider" />
          </div>
          <div className="inicio-grid">
            {masProductos.map((producto) => (
              <ProductoCard key={producto.nombre} producto={producto} />
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <div className="inicio-cta">
          <p className="inicio-cta__sub">¿No encontraste lo que buscabas?</p>
          <Link to="/productos" className="inicio-cta__btn">
            Ver catálogo completo
            <svg className="inicio-cta__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* ── Franja de confianza ── */}
        <section style={{
          borderTop: "1px solid #eeede8",
          marginTop: "60px",
          paddingTop: "40px",
          paddingBottom: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "32px",
          textAlign: "center",
        }}>
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ color: "#1a3a2a" }}>{b.icono}</div>
              <p style={{ fontWeight: "600", fontSize: "13px", color: "#1c1c1a", margin: 0 }}>{b.titulo}</p>
              <p style={{ fontSize: "12px", color: "#8a8a82", margin: 0, lineHeight: 1.4 }}>{b.detalle}</p>
            </div>
          ))}
        </section>

      </div>
    </>
  );
}