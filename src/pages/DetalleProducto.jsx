import { useParams, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import "./DetalleProducto.css";
import ProductCarousel from "../components/ProductCarousel";


export default function DetalleProducto() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCartContext();
  const { productos, cargando } = useProducts();

  // Busca el producto en el contexto en vez de hacer fetch
  const producto = productos.find(p => String(p.id) === id);
  const relacionados = productos
  .filter(p => 
    p.categoria?.toLowerCase() === producto?.categoria?.toLowerCase() 
    && p.id !== producto?.id
  )
  .slice(0, 4);

  if (cargando) return <p className="container mt-4">Cargando...</p>; 
  if (!producto)  {
  return (
    <div className="detalle-page">
      <div className="detalle-card" style={{ display: "block", textAlign: "center", padding: "48px" }}>
        <p style={{ color: "#666", marginBottom: "16px" }}>No se encontró el producto.</p>
        <button className="detalle-btn-volver" onClick={() => navigate("/productos")}>
          ← Volver a productos
        </button>
      </div>
    </div>
  ); 
}

  return (
  <div className="detalle-page">

    {/* ── Card principal ── */}
    <div className="detalle-card">

      {/* ── Columna imagen ── */}
      <div className="detalle-imagen">
        <img
          src={producto.imagen || producto.avatar}
          alt={producto.nombre}
          className="detalle-imagen__img"
          onError={e => { e.target.src = "https://placehold.co/600x600?text=Sin+imagen"; }}
        />
      </div>

      {/* ── Columna info ── */}
      <div className="detalle-info">
        {producto.categoria && (
          <span className="detalle-badge">{producto.categoria}</span>
        )}
        <h1 className="detalle-nombre">{producto.nombre}</h1>
        <p className="detalle-precio">
          ${Number(producto.precio).toLocaleString("es-AR")}
        </p>
        <div className="detalle-divider" />
        <p className="detalle-descripcion">{producto.descripcion}</p>
        <div className="detalle-beneficios">
          <div className="detalle-beneficio"><span></span><span>Envío a todo el país</span></div>
          <div className="detalle-beneficio"><span></span><span>Pagá con tarjeta o transferencia</span></div>
          <div className="detalle-beneficio"><span></span><span>Stock disponible</span></div>
        </div>
        <div className="detalle-divider" />
        <div className="detalle-acciones">
          <button className="detalle-btn-carrito" onClick={() => agregarAlCarrito(producto)}>
            + Agregar al carrito
          </button>
          <button className="detalle-btn-volver" onClick={() => navigate("/productos")}>
            ← Volver a Productos
          </button>
        </div>
      </div>

    </div>

    {/* ── Productos relacionados ── */}

    {relacionados.length > 0 && (
      <div className="detalle-relacionados">
        <h2 className="detalle-relacionados__titulo">
          También te puede interesar
        </h2>
        <ProductCarousel productos={relacionados} />
      
      </div>
    )}

  </div>
);
}