import { useState, useEffect, useCallback, useRef } from "react";
import "../InicioBanner.css";

/**
 *
 *
 * Props:
 * @param {Array}  slides    - Array de objetos { src, alt, caption? }
 *                             src: ruta a la imagen (ej: "/img/banner1.jpg")
 *                             alt: texto alternativo (accesibilidad)
 *                             caption: texto opcional superpuesto
 * @param {number} interval  - Milisegundos entre cambios automáticos (default: 5000)
 * @param {React.ReactNode} children - Contenido superpuesto global (CTA, título, etc.)
 * @param {string} className - Clases CSS adicionales
 *


/* ── Íconos de flechas ────────────────────────────────────────── */
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function InicioBanner({
  slides = [],
  interval = 5000,
  children,
  className = "",
}) {
  const [current, setCurrent]     = useState(0);
  const [animDir, setAnimDir]     = useState("next"); // "next" | "prev"
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const total = slides.length;

  /* ── Función de cambio de slide ─────────────────────────────── */
  const goTo = useCallback((index, direction = "next") => {
    if (isAnimating || total === 0) return;

    setAnimDir(direction);
    setIsAnimating(true);


    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, total]);

  const goNext = useCallback(() => {
    goTo((current + 1) % total, "next");
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, "prev");
  }, [current, total, goTo]);

  /* ── Autoplay ────────────────────────────────────────────────── */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, interval);
  }, [goNext, interval]);

  useEffect(() => {
    if (total <= 1) return; // con 1 sola imagen no tiene sentido el timer
    timerRef.current = setInterval(goNext, interval);
    return () => clearInterval(timerRef.current);
  }, [goNext, interval, total]);

  /* ── Pausa el autoplay cuando el usuario interactúa ─────────── */
  const handleManualNav = (fn) => {
    fn();
    resetTimer(); // reinicia el contador para no cambiar justo después del click
  };

  /* ── Fallback si no hay slides ───────────────────────────────── */
  if (!slides.length) {
    return (
      <section className={`inicio-banner ${className}`} aria-label="Banner de inicio">
        <div className="inicio-banner__skeleton" aria-hidden="true" />
      </section>
    );
  }

  return (
    <section
      className={`inicio-banner ${className}`}
      aria-label="Banner de inicio"
      aria-roledescription="carrusel"
    >
      {/* ── Imágenes ────────────────────────────────────────────── */}
      <div className="inicio-banner__track">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={[
              "inicio-banner__slide",
              i === current ? "inicio-banner__slide--active" : "",
              isAnimating && i === current ? `inicio-banner__slide--out-${animDir}` : "",
            ].join(" ").trim()}
            aria-hidden={i !== current}
          >
            <img
              src={slide.src}
              alt={slide.alt || `Banner ${i + 1}`}
              className="inicio-banner__img"
            />

            {/* Caption individual por slide (opcional) */}
            {slide.caption && (
              <div className="inicio-banner__caption">
                {slide.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Overlay para children globales (CTA, título, etc.) ── */}
      {children && (
        <div className="inicio-banner__overlay">
          {children}
        </div>
      )}

      {/* ── Flechas — solo si hay más de 1 slide ────────────────── */}
      {total > 1 && (
        <>
          <button
            className="inicio-banner__arrow inicio-banner__arrow--left"
            onClick={() => handleManualNav(goPrev)}
            aria-label="Imagen anterior"
          >
            <IconChevronLeft />
          </button>

          <button
            className="inicio-banner__arrow inicio-banner__arrow--right"
            onClick={() => handleManualNav(goNext)}
            aria-label="Imagen siguiente"
          >
            <IconChevronRight />
          </button>

          {/* ── Dots indicadores ──────────────────────────────── */}
          <div className="inicio-banner__dots" role="tablist" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir a imagen ${i + 1}`}
                className={`inicio-banner__dot ${i === current ? "inicio-banner__dot--active" : ""}`}
                onClick={() => handleManualNav(() => goTo(i, i > current ? "next" : "prev"))}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}