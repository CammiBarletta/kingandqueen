import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Productos() {
  const { agregarAlCarrito } = useAppContext();
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
    .catch((err) => {
      setError("No se pudieron cargar los productos 😢");
      setCargando(false);
    });
}, []);

  

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        {productos.map((producto) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={producto.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={producto.avatar}
                alt={producto.nombre}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text text-muted">{producto.descripcion}</p>
                <p className="fw-bold">${producto.precio}</p>
                <Link
                  to={`/productos/${producto.id}`}
                  state={{ producto }}
                  className="btn btn-primary mt-auto"
                >
                  Más info
                </Link>
                <button
                  className="btn btn-success mt-2 w-100"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;