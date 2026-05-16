import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";

// ── Estructura jerárquica del catálogo ──────────────────────────────────────
const CATEGORIAS_POR_MASCOTA = {
  perro: [
    { valor: "alimentacion", label: "Alimentación" },
    { valor: "salud",        label: "Salud" },
    { valor: "higiene",      label: "Higiene" },
    { valor: "juguetes",     label: "Juguetes" },
    { valor: "accesorios",   label: "Accesorios" },
  ],
  gato: [
    { valor: "alimentacion", label: "Alimentación" },
    { valor: "salud",        label: "Salud" },
    { valor: "higiene",      label: "Higiene" },
    { valor: "juguetes",     label: "Juguetes" },
    { valor: "accesorios",   label: "Accesorios" },
  ],
};

const PRECIO_MIN = 0;
const PRECIO_MAX = 200000;

export default function Productos() {
  const { productosActivos, cargando, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Estado de filtros ────────────────────────────────────────────────────
  const [mascotaAbierta, setMascotaAbierta] = useState({ perro: true, gato: false });
  const [mascotaActiva, setMascotaActiva]   = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [precioMax, setPrecioMax]           = useState(PRECIO_MAX);
  const [textoBusqueda, setTextoBusqueda]   = useState(searchParams.get("q") || "");

  useEffect(() => {
  const mascotaParam = searchParams.get("mascota");
  if (mascotaParam === "perro" || mascotaParam === "gato") {
    setMascotaActiva(mascotaParam);
    setMascotaAbierta((prev) => ({ ...prev, [mascotaParam]: true }));
  }
}, []);

  // ── Precio máximo real de los productos ──────────────────────────────────
  const precioMaxReal = useMemo(() => {
    if (!productosActivos.length) return PRECIO_MAX;
    return Math.max(...productosActivos.map((p) => Number(p.precio) || 0));
  }, [productosActivos]);

  // ── Toggle sección mascota ───────────────────────────────────────────────
  const toggleMascota = (mascota) => {
    setMascotaAbierta((prev) => ({ ...prev, [mascota]: !prev[mascota] }));
  };

  // ── Seleccionar filtro ───────────────────────────────────────────────────
  const seleccionarCategoria = (mascota, categoria) => {
    if (mascotaActiva === mascota && categoriaActiva === categoria) {
      // segundo clic deselecciona
      setMascotaActiva(null);
      setCategoriaActiva(null);
    } else {
      setMascotaActiva(mascota);
      setCategoriaActiva(categoria);
    }
  };

  const seleccionarMascota = (mascota) => {
    if (mascotaActiva === mascota && !categoriaActiva) {
      setMascotaActiva(null);
    } else {
      setMascotaActiva(mascota);
      setCategoriaActiva(null);
    }
  };

  // ── Filtrado principal ───────────────────────────────────────────────────
  const productosMostrados = useMemo(() => {
    const texto = textoBusqueda.trim().toLowerCase();
    return productosActivos.filter((p) => {
      const precio = Number(p.precio) || 0;

      const coincideMascota =
        !mascotaActiva ||
        p.mascota === mascotaActiva ||
        p.mascota === "ambos";

      const coincideCategoria =
        !categoriaActiva || p.categoria === categoriaActiva;

      const coincidePrecio = precio <= precioMax;

      const coincideTexto =
        !texto ||
        p.nombre?.toLowerCase().includes(texto) ||
        p.descripcion?.toLowerCase().includes(texto) ||
        p.categoria?.toLowerCase().includes(texto);

      return coincideMascota && coincideCategoria && coincidePrecio && coincideTexto;
    });
  }, [productosActivos, mascotaActiva, categoriaActiva, precioMax, textoBusqueda]);

  const limpiarFiltros = () => {
    setMascotaActiva(null);
    setCategoriaActiva(null);
    setPrecioMax(precioMaxReal);
    setTextoBusqueda("");
    setSearchParams({});
  };

  const hayFiltros = mascotaActiva || categoriaActiva || precioMax < precioMaxReal || textoBusqueda.trim();

  if (cargando) return <p style={{ padding: "40px" }}>Cargando productos...</p>;
  if (error)    return <p style={{ padding: "40px" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 80px", display: "flex", gap: "40px", alignItems: "flex-start" }}>

      {/* ══════════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════════ */}
      <aside style={{ width: "240px", flexShrink: 0 }}>

        {/* ── Título sidebar ── */}
        <div style={{ borderBottom: "2px solid #1c1c1a", paddingBottom: "10px", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1c1c1a" }}>
            Categorías
          </h3>
        </div>

        {/* ── Perros ── */}
        <div style={{ marginBottom: "4px" }}>
          <button
            onClick={() => toggleMascota("perro")}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 0", fontSize: "14px", fontWeight: "600", color: "#1c1c1a",
            }}
          >
            <span
              onClick={(e) => { e.stopPropagation(); seleccionarMascota("perro"); }}
              style={{ color: mascotaActiva === "perro" && !categoriaActiva ? "#1a3a2a" : "#1c1c1a" }}
            >
               Perros
            </span>
            <span style={{ fontSize: "11px", color: "#8a8a82", transition: "transform 0.2s", display: "inline-block", transform: mascotaAbierta.perro ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>

          {mascotaAbierta.perro && (
            <ul style={{ listStyle: "none", margin: "0 0 8px", padding: "0 0 0 16px" }}>
              {CATEGORIAS_POR_MASCOTA.perro.map((cat) => {
                const activo = mascotaActiva === "perro" && categoriaActiva === cat.valor;
                return (
                  <li key={cat.valor}>
                    <button
                      onClick={() => seleccionarCategoria("perro", cat.valor)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "7px 0", width: "100%", textAlign: "left",
                        fontSize: "13px",
                        color: activo ? "#1a3a2a" : "#444",
                        fontWeight: activo ? "600" : "400",
                        borderLeft: activo ? "3px solid #1a3a2a" : "3px solid transparent",
                        paddingLeft: "10px",
                        transition: "all 0.15s",
                      }}
                    >
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Gatos ── */}
        <div style={{ marginBottom: "4px" }}>
          <button
            onClick={() => toggleMascota("gato")}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 0", fontSize: "14px", fontWeight: "600", color: "#1c1c1a",
              borderTop: "1px solid #f0efeb",
            }}
          >
            <span
              onClick={(e) => { e.stopPropagation(); seleccionarMascota("gato"); }}
              style={{ color: mascotaActiva === "gato" && !categoriaActiva ? "#1a3a2a" : "#1c1c1a" }}
            >
               Gatos
            </span>
            <span style={{ fontSize: "11px", color: "#8a8a82", transition: "transform 0.2s", display: "inline-block", transform: mascotaAbierta.gato ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>

          {mascotaAbierta.gato && (
            <ul style={{ listStyle: "none", margin: "0 0 8px", padding: "0 0 0 16px" }}>
              {CATEGORIAS_POR_MASCOTA.gato.map((cat) => {
                const activo = mascotaActiva === "gato" && categoriaActiva === cat.valor;
                return (
                  <li key={cat.valor}>
                    <button
                      onClick={() => seleccionarCategoria("gato", cat.valor)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "7px 0", width: "100%", textAlign: "left",
                        fontSize: "13px",
                        color: activo ? "#1a3a2a" : "#444",
                        fontWeight: activo ? "600" : "400",
                        borderLeft: activo ? "3px solid #1a3a2a" : "3px solid transparent",
                        paddingLeft: "10px",
                        transition: "all 0.15s",
                      }}
                    >
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Filtro por precio ── */}
        <div style={{ borderTop: "1px solid #f0efeb", paddingTop: "20px", marginTop: "16px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1c1c1a" }}>
            Filtrar por precio
          </h3>
          <input
            type="range"
            min={PRECIO_MIN}
            max={precioMaxReal}
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#1a3a2a", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#444", marginTop: "8px" }}>
            <span>${PRECIO_MIN.toLocaleString("es-AR")}</span>
            <span style={{ fontWeight: "600", color: "#1a3a2a" }}>${precioMax.toLocaleString("es-AR")}</span>
          </div>
        </div>

        {/* ── Limpiar filtros ── */}
        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            style={{
              marginTop: "20px", width: "100%", padding: "9px 0",
              borderRadius: "6px", border: "1.5px solid #e4e2dc",
              background: "transparent", color: "#8a8a82",
              fontSize: "13px", cursor: "pointer",
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* ── Encabezado ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "500", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a3a2a", marginBottom: "4px" }}>
              {mascotaActiva ? (mascotaActiva === "perro" ? " Perros" : " Gatos") : "Tienda"}
              {categoriaActiva ? ` / ${categoriaActiva}` : ""}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: "600", margin: 0, color: "#1c1c1a" }}>
              {categoriaActiva
                ? CATEGORIAS_POR_MASCOTA[mascotaActiva]?.find(c => c.valor === categoriaActiva)?.label || "Productos"
                : "Todos los productos"}
            </h1>
          </div>
          <p style={{ color: "#8a8a82", fontSize: "13px", margin: 0 }}>
            Mostrando {productosMostrados.length} producto{productosMostrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Buscador ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "#fff", border: "1.5px solid #e4e2dc",
          borderRadius: "50px", padding: "10px 20px",
          marginBottom: "28px", maxWidth: "420px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={textoBusqueda}
            onChange={(e) => {
              setTextoBusqueda(e.target.value);
              e.target.value.trim() ? setSearchParams({ q: e.target.value.trim() }) : setSearchParams({});
            }}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1c1c1a", width: "100%" }}
          />
          {textoBusqueda && (
            <button onClick={() => { setTextoBusqueda(""); setSearchParams({}); }} style={{ border: "none", background: "none", cursor: "pointer", color: "#8a8a82", fontSize: "18px", lineHeight: 1, padding: 0 }}>×</button>
          )}
        </div>

        {/* ── Grid de productos ── */}
        {productosMostrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8a8a82" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "16px", margin: "0 0 16px" }}>No encontramos productos con estos filtros.</p>
            <button onClick={limpiarFiltros} style={{ padding: "10px 24px", borderRadius: "50px", border: "1.5px solid #1a3a2a", background: "transparent", color: "#1a3a2a", cursor: "pointer", fontSize: "14px" }}>
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {productosMostrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}