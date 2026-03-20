import { useLocation, useNavigate } from "react-router-dom";

export default function DetalleProducto() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const producto = state?.producto;

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}