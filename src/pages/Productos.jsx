import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Productos({ carrito = [], setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const agregarAlCarrito = (producto) => {
    if (!carrito) return;
    const yaEsta = carrito.find(item => item.id === producto.id);
    if (yaEsta) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: (item.cantidad || 1) + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  useEffect(() => {
    fetch("https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error!:", error);
        setError("Hubo un problema al cargar los productos.");
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