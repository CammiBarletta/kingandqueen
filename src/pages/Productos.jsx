import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";

export default function Productos() {
  const { productosFiltrados, cargando, error } = useProducts();

  if (cargando) return <p className="container mt-4">Cargando productos...</p>;
  if (error) return <p className="container mt-4">{error}</p>;
  if (!productosFiltrados.length) return (
    <p className="container mt-4">No hay productos disponibles.</p>
  );

  return (
    <div className="container mt-4">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
        padding: "1.5rem 0",
      }}>
        {productosFiltrados.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}