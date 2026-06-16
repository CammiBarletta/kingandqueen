import { useRef, useState, useCallback, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import "./ProductCarousel.css";

export default function ProductCarousel({ productos = [] }) {
  const trackRef       = useRef(null);
  const animRef        = useRef(null);
  const pausedRef      = useRef(false);  // true = auto-scroll detenido
  const scrollingRef   = useRef(false);  // true = hay un scrollBy smooth en curso

  const [isDragging, setIsDragging]       = useState(false);
  const [startX, setStartX]               = useState(0);
  const [scrollLeft, setScrollLeft]       = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


  const CARD_WIDTH = 280;
  const SPEED      = 0.8;

  // ── Auto-scroll en loop ──────────────────────────────────────────
  const tick = useCallback(() => {
    const el = trackRef.current;

    // Si está pausado O hay un scrollBy smooth en curso → esperar
    if (!el || pausedRef.current || scrollingRef.current) {
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

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScrollEnd = () => {
      scrollingRef.current = false;
      // Actualizamos flechas al terminar el scroll
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };

    // scrollend es soportado en Chrome 114+, Firefox 109+, Safari 17.4+
    const supportsScrollEnd = "onscrollend" in window;

    if (supportsScrollEnd) {
      el.addEventListener("scrollend", onScrollEnd);
      return () => el.removeEventListener("scrollend", onScrollEnd);
    } else {
      /*
        Fallback: pooling cada 100ms.
        Si el scrollLeft no cambió desde el último check → terminó.
      */
      let lastScrollLeft = -1;
      let fallbackTimer  = null;

      const pollScrollEnd = () => {
        if (!scrollingRef.current) return;
        if (el.scrollLeft === lastScrollLeft) {
          onScrollEnd();
        } else {
          lastScrollLeft = el.scrollLeft;
          fallbackTimer = setTimeout(pollScrollEnd, 100);
        }
      };

      // Arrancamos el poll cuando empieza un scroll
      const onScroll = () => {
        if (!scrollingRef.current) return;
        clearTimeout(fallbackTimer);
        lastScrollLeft = el.scrollLeft;
        fallbackTimer  = setTimeout(pollScrollEnd, 100);
      };

      el.addEventListener("scroll", onScroll);
      return () => {
        el.removeEventListener("scroll", onScroll);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  // ── Pausa con hover ──────────────────────────────────────────────
  const onMouseEnter = () => { pausedRef.current = true; };
  const onMouseLeave = () => {
    pausedRef.current = false;
    setIsDragging(false);
  };

  // ── Flechas manuales ─────────────────────────────────────────────
  const handleScrollBy = (direction) => {
    const el = trackRef.current;
    if (!el || scrollingRef.current) return; // ignorar click si ya está scrolleando

    pausedRef.current  = true;   // pausa el auto-scroll
    scrollingRef.current = true; // marca que hay un smooth en curso

    el.scrollBy({ left: direction * CARD_WIDTH * 2, behavior: "smooth" });


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
    const x    = e.pageX - trackRef.current.offsetLeft;
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
    // En touch usamos 400ms porque scrollend no siempre
    // se dispara tras un swipe manual en todos los móviles
    setTimeout(() => { pausedRef.current = false; }, 400);
  };

  const onTouchMove = (e) => {
    const x    = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!productos.length) {
    return <p className="slider-empty">Próximamente productos destacados…</p>;
  }

  return (
    <div className="slider-wrapper">
      {/* Flecha izquierda */}
      <button
        className={`slider-arrow slider-arrow--left ${!canScrollLeft ? "slider-arrow--hidden" : ""}`}
        onClick={() => handleScrollBy(-1)}
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className={`slider-track${isDragging ? " is-dragging" : ""}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
  {productos.map((producto, index) => (
  <div key={producto.id || producto.nombre || index} className="slider-item">
    <ProductoCard producto={producto} isMobile={false} />
  </div>
))}
      </div>

      {/* Flecha derecha */}
      <button
        className={`slider-arrow slider-arrow--right ${!canScrollRight ? "slider-arrow--hidden" : ""}`}
        onClick={() => handleScrollBy(1)}
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Fades laterales */}
      <div className="slider-fade slider-fade--left" />
      <div className="slider-fade slider-fade--right" />
    </div>
  );
}