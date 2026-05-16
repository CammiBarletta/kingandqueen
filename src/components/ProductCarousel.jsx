import { useRef, useState, useCallback, useEffect } from "react";
import ProductoCard from "./ProductoCard";

export default function ProductCarousel({ productos = [] }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const pausedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_WIDTH = 280;
  const SPEED = 0.9; 

  // ── Auto-scroll en loop ──────────────────────────────────────────
  const tick = useCallback(() => {
    const el = trackRef.current;
    if (!el || pausedRef.current) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    el.scrollLeft += SPEED;

    // Si llegó al final, vuelve al principio suavemente
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
      el.scrollLeft = 0;
    }

    // Actualizar flechas
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  // ── Pausa con hover ──────────────────────────────────────────────
  const onMouseEnter = () => { pausedRef.current = true; };
  const onMouseLeave = () => {
    pausedRef.current = false;
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  // ── Flechas manuales ─────────────────────────────────────────────
  const handleScrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * CARD_WIDTH * 2, behavior: "smooth" });
  };

  // ── Drag con mouse ───────────────────────────────────────────────
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
    trackRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  // ── Touch ────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    pausedRef.current = true;
    setStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const onTouchEnd = () => { pausedRef.current = false; };

  const onTouchMove = (e) => {
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!productos.length) {
    return <p style={{ color: "#999", fontStyle: "italic", padding: "24px 0" }}>Próximamente productos destacados…</p>;
  }
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Flecha izquierda */}
      <button
        onClick={() => handleScrollBy(-1)}
        style={{
          position: "absolute", top: "50%", left: "-18px",
          transform: "translateY(-60%)", zIndex: 10,
          width: "40px", height: "40px", borderRadius: "50%",
          border: "1.5px solid #d0d0c8", background: "#fff",
          color: "#1a3a2a", cursor: "pointer",
          display: canScrollLeft ? "flex" : "none",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1a3a2a"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a3a2a"; }}
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      {/* Track */}
      <div
        ref={trackRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: "20px",
          padding: "12px 4px 4px",
          cursor: "grab",
          // Ocultar scrollbar en todos los navegadores
          scrollbarWidth: "none",       // Firefox
          msOverflowStyle: "none",      // IE/Edge
        }}
      >
        {/* WebKit scrollbar oculto via style tag inline */}
        <style>{`.carousel-no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {productos.map((producto) => (
         <div
             key={producto.id}
            style={{
              flex: "0 0 260px",
              width: "260px",
              minWidth: "260px",
              maxWidth: "260px",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <ProductoCard producto={producto} />
          </div>
        ))}
      </div>
      {/* Flecha derecha */}
      <button
        onClick={() => handleScrollBy(1)}
        style={{
          position: "absolute", top: "50%", right: "-18px",
          transform: "translateY(-60%)", zIndex: 10,
          width: "40px", height: "40px", borderRadius: "50%",
          border: "1.5px solid #d0d0c8", background: "#fff",
          color: "#1a3a2a", cursor: "pointer",
          display: canScrollRight ? "flex" : "none",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1a3a2a"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a3a2a"; }}
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Fades laterales */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "48px",
        background: "linear-gradient(to right, #faf9f7, transparent)",
        pointerEvents: "none", zIndex: 5,
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: "48px",
        background: "linear-gradient(to left, #faf9f7, transparent)",
        pointerEvents: "none", zIndex: 5,
      }} />
    </div>
  );
}