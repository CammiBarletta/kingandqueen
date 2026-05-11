import InicioBanner from "../components/InicioBanner";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";
import ProductCarousel from "../components/ProductCarousel";
import { Link } from "react-router-dom";
import "./Inicio.css";

export default function Inicio() {
  const { productosDestacados, productosFiltrados, cargando } = useProducts();

  if (cargando) return null;

  const masProductos = productosFiltrados.slice(0, 8);

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
                : productosFiltrados.slice(0, 6)
            }
          />
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

      </div>
    </>
  );
}