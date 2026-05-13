import { useParams, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCartContext();
  const { productos, cargando } = useProducts();

  // Busca el producto en el contexto en vez de hacer fetch
  const producto = productos.find(p => p.id === id);

  if (cargando) return <p className="container mt-4">Cargando...</p>;

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
              src={producto.imagen || producto.avatar}
              alt={producto.nombre}
              className="card-img-top"
              style={{ height: "350px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h2 className="card-title">{producto.nombre}</h2>
              <p className="card-text text-muted">{producto.descripcion}</p>
              <p className="fw-bold fs-4">${Number(producto.precio).toLocaleString('es-AR')}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/productos")}
                >
                  Volver
                </button>
                <button
                  className="btn btn-success w-100"
                  onClick={() => agregarAlCarrito(producto)}
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