import InicioBanner from "../components/InicioBanner";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";
import { Link } from "react-router-dom";

export default function Inicio() {
  const { productosDestacados, productosFiltrados, cargando } = useProducts();

  if (cargando) return null;

  // mostramos pocos productos en home (estilo ecommerce real)
  const masProductos = productosFiltrados.slice(0, 8);

  return (
    <>
      <InicioBanner />

      <div className="container mt-5">

        {/* DESTACADOS */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ marginBottom: "20px" }}>⭐ Productos destacados</h2>

          {productosDestacados.length === 0 ? (
            <p style={{ opacity: 0.6 }}>
              Próximamente productos destacados…
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {productosDestacados.slice(0, 4).map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>

        {/* MAS PRODUCTOS */}
        <section style={{ marginBottom: "50px" }}>
          <h2 style={{ marginBottom: "20px" }}>Más productos</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {masProductos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>

        {/* CTA VER TODOS */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Link
            to="/productos"
            style={{
              padding: "14px 28px",
              backgroundColor: "#00bcd4",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Ver todos los productos →
          </Link>
        </div>

      </div>
    </>
  );
}