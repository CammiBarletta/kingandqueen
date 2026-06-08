import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductoCard from "../components/ProductoCard";

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

// ── Hook simple para detectar mobile ────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function Productos() {
  const { productosActivos, cargando, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();

  // ── Estado de filtros ────────────────────────────────────────────────────
  const [mascotaAbierta, setMascotaAbierta] = useState({ perro: true, gato: false });
  const [mascotaActiva, setMascotaActiva]   = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [textoBusqueda, setTextoBusqueda]   = useState(searchParams.get("q") || "");

  // ── Estado del drawer mobile de filtros ─────────────────────────────────
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // ── Paginación ───────────────────────────────────────────────────────────
  const PRODUCTOS_POR_PAGINA = 8;
  const [paginaActual, setPaginaActual] = useState(1);

  // precioMax arranca en PRECIO_MAX y se sincroniza cuando cargan los productos
  const [precioMax, setPrecioMax] = useState(PRECIO_MAX);

  const precioMaxReal = useMemo(() => {
    if (!productosActivos.length) return PRECIO_MAX;
    return Math.max(...productosActivos.map((p) => Number(p.precio) || 0));
  }, [productosActivos]);

  // Sincronizar slider cuando llegan los productos reales
  useEffect(() => {
    setPrecioMax(precioMaxReal);
  }, [precioMaxReal]);

  useEffect(() => {
    const mascotaParam = searchParams.get("mascota");
    if (mascotaParam === "perro" || mascotaParam === "gato") {
      setMascotaActiva(mascotaParam);
      setMascotaAbierta((prev) => ({ ...prev, [mascotaParam]: true }));
    }
  }, [searchParams]);

  // Bloquear scroll del body cuando el drawer de filtros está abierto en mobile
  useEffect(() => {
    if (isMobile && filtrosAbiertos) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, filtrosAbiertos]);

  const toggleMascota = (mascota) => {
    setMascotaAbierta((prev) => ({ ...prev, [mascota]: !prev[mascota] }));
  };

  const seleccionarCategoria = (mascota, categoria) => {
    if (mascotaActiva === mascota && categoriaActiva === categoria) {
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

  const productosMostrados = useMemo(() => {
    const texto = textoBusqueda.trim().toLowerCase();
    return productosActivos.filter((p) => {
      const precio = Number(p.precio) || 0;
      const coincideMascota   = !mascotaActiva || p.mascota === mascotaActiva || p.mascota === "ambos";
      const coincideCategoria = !categoriaActiva || p.categoria === categoriaActiva;
      const coincidePrecio    = precio <= precioMax;
      const coincideTexto     = !texto || p.nombre?.toLowerCase().includes(texto) || p.descripcion?.toLowerCase().includes(texto) || p.categoria?.toLowerCase().includes(texto);
      return coincideMascota && coincideCategoria && coincidePrecio && coincideTexto;
    });
  }, [productosActivos, mascotaActiva, categoriaActiva, precioMax, textoBusqueda]);

  const limpiarFiltros = () => {
    setMascotaActiva(null);
    setCategoriaActiva(null);
    setPrecioMax(precioMaxReal);
    setTextoBusqueda("");
    setSearchParams({});
    setPaginaActual(1);
  };

  const hayFiltros = mascotaActiva || categoriaActiva || precioMax < precioMaxReal || textoBusqueda.trim();

  // Resetear página cuando cambian los filtros
  useEffect(() => { setPaginaActual(1); }, [mascotaActiva, categoriaActiva, precioMax, textoBusqueda]);

  // ── Paginación ───────────────────────────────────────────────────────────
  const totalPaginas = Math.ceil(productosMostrados.length / PRODUCTOS_POR_PAGINA);

  // Guard: si al filtrar la página actual queda fuera de rango, volver a 1
  useEffect(() => {
    if (paginaActual > totalPaginas && totalPaginas > 0) setPaginaActual(1);
  }, [totalPaginas]);

  const productosPagina = productosMostrados.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  );

  const irAPagina = (n) => {
    setPaginaActual(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cuenta filtros activos para el badge del botón mobile
  const cantidadFiltros = [mascotaActiva, categoriaActiva, precioMax < precioMaxReal, textoBusqueda.trim()].filter(Boolean).length;

  if (cargando) return <p style={{ padding: "40px" }}>Cargando productos...</p>;
  if (error)    return <p style={{ padding: "40px" }}>{error}</p>;

  // ── Contenido del sidebar (reutilizado en desktop y drawer mobile) ────────
  const SidebarContenido = () => (
    <>
      <div style={{ borderBottom: "2px solid #1c1c1a", paddingBottom: "10px", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1c1c1a" }}>
          Categorías
        </h3>
      </div>

      {/* Perros */}
      <div style={{ marginBottom: "4px" }}>
        <button
          onClick={() => toggleMascota("perro")}
          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "10px 0", fontSize: "14px", fontWeight: "600", color: "#1c1c1a" }}
        >
          <span onClick={(e) => { e.stopPropagation(); seleccionarMascota("perro"); }} style={{ color: mascotaActiva === "perro" && !categoriaActiva ? "#1a3a2a" : "#1c1c1a" }}>
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
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", width: "100%", textAlign: "left", fontSize: "14px", color: activo ? "#1a3a2a" : "#444", fontWeight: activo ? "600" : "400", borderLeft: activo ? "3px solid #1a3a2a" : "3px solid transparent", paddingLeft: "10px", transition: "all 0.15s" }}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Gatos */}
      <div style={{ marginBottom: "4px" }}>
        <button
          onClick={() => toggleMascota("gato")}
          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "10px 0", fontSize: "14px", fontWeight: "600", color: "#1c1c1a", borderTop: "1px solid #f0efeb" }}
        >
          <span onClick={(e) => { e.stopPropagation(); seleccionarMascota("gato"); }} style={{ color: mascotaActiva === "gato" && !categoriaActiva ? "#1a3a2a" : "#1c1c1a" }}>
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
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", width: "100%", textAlign: "left", fontSize: "14px", color: activo ? "#1a3a2a" : "#444", fontWeight: activo ? "600" : "400", borderLeft: activo ? "3px solid #1a3a2a" : "3px solid transparent", paddingLeft: "10px", transition: "all 0.15s" }}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Filtro precio */}
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

      {/* Limpiar filtros */}
      {hayFiltros && (
        <button
          onClick={() => { limpiarFiltros(); setFiltrosAbiertos(false); }}
          style={{ marginTop: "20px", width: "100%", padding: "9px 0", borderRadius: "6px", border: "1.5px solid #e4e2dc", background: "transparent", color: "#8a8a82", fontSize: "13px", cursor: "pointer" }}
        >
          ✕ Limpiar filtros
        </button>
      )}

      {/* Botón aplicar solo en mobile */}
      {isMobile && (
        <button
          onClick={() => setFiltrosAbiertos(false)}
          style={{ marginTop: "12px", width: "100%", padding: "12px 0", borderRadius: "8px", border: "none", background: "#1a3a2a", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
        >
          Ver {productosMostrados.length} producto{productosMostrados.length !== 1 ? "s" : ""}
        </button>
      )}
    </>
  );

  return (
     <div className="page-content"> 

      {/* ── BARRA SUPERIOR MOBILE: buscador + botón filtros ── */}
      {isMobile && (
        <div style={{ marginBottom: "16px" }}>
          {/* Título */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "500", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a3a2a", marginBottom: "4px" }}>
              {mascotaActiva ? (mascotaActiva === "perro" ? "🐶 Perros" : "🐱 Gatos") : "Tienda"}
              {categoriaActiva ? ` / ${categoriaActiva}` : ""}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: "600", margin: 0, color: "#1c1c1a" }}>
              {categoriaActiva
                ? CATEGORIAS_POR_MASCOTA[mascotaActiva]?.find(c => c.valor === categoriaActiva)?.label || "Productos"
                : "Todos los productos"}
            </h1>
          </div>

          {/* Buscador + botón filtros en fila */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1.5px solid #e4e2dc", borderRadius: "50px", padding: "10px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar..."
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

            {/* Botón filtros */}
            <button
              onClick={() => setFiltrosAbiertos(true)}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "50px", border: "1.5px solid #e4e2dc", background: "white", color: "#1c1c1a", fontSize: "14px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filtros
              {cantidadFiltros > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#1a3a2a", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cantidadFiltros}
                </span>
              )}
            </button>
          </div>

          <p style={{ color: "#8a8a82", fontSize: "12px", margin: "10px 0 0" }}>
            {productosMostrados.length} producto{productosMostrados.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ── LAYOUT DESKTOP: sidebar + contenido ── */}
      <div style={{ display: isMobile ? "block" : "flex", gap: "40px", alignItems: "flex-start" }}>

        {/* SIDEBAR DESKTOP */}
        {!isMobile && (
          <aside style={{ width: "240px", flexShrink: 0 }}>
            <SidebarContenido />
          </aside>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Encabezado desktop */}
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "500", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a3a2a", marginBottom: "4px" }}>
                  {mascotaActiva ? (mascotaActiva === "perro" ? "🐶 Perros" : "🐱 Gatos") : "Tienda"}
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
          )}

          {/* Buscador desktop */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", border: "1.5px solid #e4e2dc", borderRadius: "50px", padding: "10px 20px", marginBottom: "28px", maxWidth: "420px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
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
          )}

          {/* Grid de productos */}
          {productosMostrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#8a8a82" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontSize: "16px", margin: "0 0 16px" }}>No encontramos productos con estos filtros.</p>
              <button onClick={limpiarFiltros} style={{ padding: "10px 24px", borderRadius: "50px", border: "1.5px solid #1a3a2a", background: "transparent", color: "#1a3a2a", cursor: "pointer", fontSize: "14px" }}>
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
                gap: isMobile ? "12px" : "24px",
              }}>
                {productosPagina.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} isMobile={isMobile} />
                ))}
              </div>

              {/* ── Paginación ── */}
              {totalPaginas > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "40px" }}>

                  {/* Anterior */}
                  <button
                    onClick={() => irAPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: "1.5px solid #e4e2dc", background: "transparent",
                      color: paginaActual === 1 ? "#ccc" : "#1c1c1a",
                      cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                      fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    ‹
                  </button>

                  {/* Números */}
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => {
                    // Mostrar siempre: primera, última, actual y adyacentes
                    const mostrar = n === 1 || n === totalPaginas || Math.abs(n - paginaActual) <= 1;
                    const esEllipsis =
                      (n === 2 && paginaActual > 3) ||
                      (n === totalPaginas - 1 && paginaActual < totalPaginas - 2);

                    if (!mostrar && !esEllipsis) return null;
                    if (esEllipsis) return (
                      <span key={n} style={{ color: "#aaa", fontSize: "14px", padding: "0 4px" }}>…</span>
                    );

                    return (
                      <button
                        key={n}
                        onClick={() => irAPagina(n)}
                        style={{
                          width: "36px", height: "36px", borderRadius: "8px",
                          border: paginaActual === n ? "none" : "1.5px solid #e4e2dc",
                          background: paginaActual === n ? "#1a3a2a" : "transparent",
                          color: paginaActual === n ? "#fff" : "#1c1c1a",
                          cursor: "pointer", fontSize: "14px", fontWeight: paginaActual === n ? "600" : "400",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}

                  {/* Siguiente */}
                  <button
                    onClick={() => irAPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: "1.5px solid #e4e2dc", background: "transparent",
                      color: paginaActual === totalPaginas ? "#ccc" : "#1c1c1a",
                      cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
                      fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    ›
                  </button>
                </div>
              )}

              {/* Texto indicador */}
              {totalPaginas > 1 && (
                <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px", marginTop: "12px" }}>
                  Página {paginaActual} de {totalPaginas} — {productosMostrados.length} productos
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DRAWER DE FILTROS MOBILE
      ══════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* Overlay */}
          {filtrosAbiertos && (
            <div
              onClick={() => setFiltrosAbiertos(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
            />
          )}

          {/* Panel drawer desde abajo */}
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: "85vh",
            backgroundColor: "white",
            zIndex: 1050,
            borderRadius: "20px 20px 0 0",
            transform: filtrosAbiertos ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
          }}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#ddd" }} />
            </div>

            {/* Header del drawer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 12px", borderBottom: "1px solid #f0efeb" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Filtros</h3>
              <button onClick={() => setFiltrosAbiertos(false)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#666", lineHeight: 1 }}>✕</button>
            </div>

            {/* Contenido scrolleable */}
            <div style={{ overflowY: "auto", padding: "16px 20px 24px" }}>
              <SidebarContenido />
            </div>
          </div>
        </>
      )}
    </div>
    
  );
}