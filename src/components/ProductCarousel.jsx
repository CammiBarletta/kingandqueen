import { useRef, useState, useCallback, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import "./ProductCarousel.css";

export default function ProductCarousel({ productos = [] }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const pausedRef = useRef(false);
  const isSnappingRef = useRef(false); 

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_WIDTH = 280;
  const SPEED = 0.8;

  // ── Auto-scroll en loop ──────────────────────────────────────────
  const tick = useCallback(() => {
    const el = trackRef.current;
    if (!el || pausedRef.current) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    el.scrollLeft += SPEED;

    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
      el.scrollLeft = 0;
    }

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
  };

  // ── Flechas manuales ─────────────────────────────────────────────
  const handleScrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    pausedRef.current = true; // pausa el auto-scroll mientras el usuario navega
    el.scrollBy({ left: direction * CARD_WIDTH * 2, behavior: "smooth" });
    // retoma después de la animación smooth (~500ms)
    setTimeout(() => { pausedRef.current = false; }, 600);
  };

  // ── Drag con mouse ───────────────────────────────────────────────
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  // ── Touch ────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    pausedRef.current = true;
    setStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const onTouchEnd = () => {
    setTimeout(() => { pausedRef.current = false; }, 400);
  };

  const onTouchMove = (e) => {
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!productos.length) {
    return <p className="carousel-empty">Próximamente productos destacados…</p>;
  }

  return (
    <div className="carousel-wrapper">
      {/* Flecha izquierda */}
      <button
        className={`carousel-arrow carousel-arrow--left ${!canScrollLeft ? "carousel-arrow--hidden" : ""}`}
        onClick={() => handleScrollBy(-1)}
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

  
      <div
        ref={trackRef}
        className={`carousel-track${isDragging ? " is-dragging" : ""}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {productos.map((producto) => (
          <div key={producto.id} className="carousel-item">
            <ProductoCard producto={producto} isMobile={false} />
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        className={`carousel-arrow carousel-arrow--right ${!canScrollRight ? "carousel-arrow--hidden" : ""}`}
        onClick={() => handleScrollBy(1)}
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Fades laterales */}
      <div className="carousel-fade carousel-fade--left" />
      <div className="carousel-fade carousel-fade--right" />
    </div>
  );
}