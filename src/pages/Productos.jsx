import React, { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos 😢");
        setCargando(false);
      });
  }, []);

  if (cargando) return <p className="container mt-4">Cargando productos...</p>;
  if (error) return <p className="container mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
        padding: "1.5rem 0",
      }}>
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}

export default Productos;