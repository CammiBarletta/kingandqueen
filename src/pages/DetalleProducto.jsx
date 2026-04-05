import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"; // ✅ agregar

export default function DetalleProducto() { // ✅ sacar { carrito, setCarrito } de los parámetros
  const { agregarAlCarrito } = useAppContext(); // ✅ traer del contexto
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos/${id}`)
      .then(r => r.json())
      .then(datos => {
        setProducto(datos);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  // ✅ BORRAR la función agregarAlCarrito local, ya viene del contexto

  if (cargando) return <p>Cargando...</p>;

  if (!producto) {
    return (
      <div className="container mt-4">
        <p>No se encontró el producto.</p>
        <button className="btn btn-primary" onClick={() => navigate("/productos")}>
          Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <img
              src={producto.avatar}
              alt={producto.nombre}
              className="card-img-top"
              style={{ height: "350px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h2 className="card-title">{producto.nombre}</h2>
              <p className="card-text text-muted">{producto.descripcion}</p>
              <p className="fw-bold fs-4">${producto.precio}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/productos")}
                >
                  Volver
                </button>
                <button
                  className="btn btn-success w-100"
                  onClick={() => agregarAlCarrito(producto)} // ✅ misma línea, pero ahora usa la del contexto
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}