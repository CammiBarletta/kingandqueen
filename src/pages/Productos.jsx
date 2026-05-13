import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";

export default function Productos() {
  const { productosFiltrados, cargando, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  // Lee el query del buscador del Navbar (?q=...)
  const queryURL = searchParams.get("q") || "";
const [textoBusqueda, setTextoBusqueda] = useState(queryURL);1
useEffect(() => {
  setTextoBusqueda(searchParams.get("q") || "");
}, [searchParams]);

  // Categorías únicas derivadas de los productos
  const categorias = useMemo(() => {
    const cats = productosFiltrados
      .map((p) => p.categoria)
      .filter(Boolean);
    return ["Todos", ...new Set(cats)];
  }, [productosFiltrados]);

  // Filtrado combinado: búsqueda + categoría
  const productosMostrados = useMemo(() => {
    const texto = textoBusqueda.trim().toLowerCase();
    return productosFiltrados.filter((p) => {
      const coincideTexto =
        !texto ||
        p.nombre?.toLowerCase().includes(texto) ||
        p.descripcion?.toLowerCase().includes(texto) ||
        p.categoria?.toLowerCase().includes(texto);

      const coincideCategoria =
        categoriaActiva === "Todos" || p.categoria === categoriaActiva;

      return coincideTexto && coincideCategoria;
    });
  }, [productosFiltrados, textoBusqueda, categoriaActiva]);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setTextoBusqueda(valor);
    // Sincroniza con la URL para que el buscador del Navbar también funcione
    if (valor.trim()) {
      setSearchParams({ q: valor.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoria = (cat) => {
    setCategoriaActiva(cat);
  };

  const limpiarFiltros = () => {
    setTextoBusqueda("");
    setCategoriaActiva("Todos");
    setSearchParams({});
  };

  const hayFiltros = textoBusqueda.trim() || categoriaActiva !== "Todos";

  if (cargando) return <p className="container mt-4">Cargando productos...</p>;
  if (error) return <p className="container mt-4">{error}</p>;
  console.log("primer producto:", productosFiltrados[0]);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* ── Encabezado ── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontSize: "11px", fontWeight: "500", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#1a3a2a", marginBottom: "8px",
        }}>
          Tienda
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: "600", margin: "0 0 4px", color: "#1c1c1a",
        }}>
          Todos los productos
        </h1>
        <p style={{ color: "#8a8a82", fontSize: "14px", margin: 0 }}>
          {productosMostrados.length} producto{productosMostrados.length !== 1 ? "s" : ""} encontrado{productosMostrados.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Buscador interno ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: "#fff", border: "1.5px solid #e4e2dc",
        borderRadius: "50px", padding: "10px 20px",
        marginBottom: "24px", maxWidth: "480px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={textoBusqueda}
          onChange={handleBusqueda}
          style={{
            border: "none", outline: "none", background: "transparent",
            fontSize: "14px", color: "#1c1c1a", width: "100%",
          }}
        />
        {textoBusqueda && (
          <button
            onClick={() => { setTextoBusqueda(""); setSearchParams({}); }}
            style={{
              border: "none", background: "none", cursor: "pointer",
              color: "#8a8a82", fontSize: "18px", lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Filtros por categoría ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px",
      }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoria(cat)}
            style={{
              padding: "7px 18px",
              borderRadius: "50px",
              border: categoriaActiva === cat ? "none" : "1.5px solid #e4e2dc",
              background: categoriaActiva === cat ? "#1a3a2a" : "#fff",
              color: categoriaActiva === cat ? "#fff" : "#1c1c1a",
              fontSize: "13px",
              fontWeight: categoriaActiva === cat ? "500" : "400",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: categoriaActiva === cat ? "0 4px 12px rgba(26,58,42,0.2)" : "none",
            }}
          >
            {cat}
          </button>
        ))}

        {/* Botón limpiar filtros */}
        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            style={{
              padding: "7px 18px", borderRadius: "50px",
              border: "1.5px solid #e4e2dc", background: "transparent",
              color: "#8a8a82", fontSize: "13px", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Grid de productos ── */}
      {productosMostrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8a8a82" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
          <p style={{ fontSize: "16px", margin: "0 0 8px" }}>No encontramos productos para "<strong>{textoBusqueda}</strong>"</p>
          <button
            onClick={limpiarFiltros}
            style={{
              marginTop: "16px", padding: "10px 24px", borderRadius: "50px",
              border: "1.5px solid #1a3a2a", background: "transparent",
              color: "#1a3a2a", cursor: "pointer", fontSize: "14px",
            }}
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {productosMostrados.map((producto) => (
           <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

    </div>
  );
}