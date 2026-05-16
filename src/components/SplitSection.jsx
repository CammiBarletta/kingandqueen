
import { useEffect, useRef } from "react";

/**
 * Sección reutilizable con foto a un lado y texto al otro.
 * Aparece con animación al hacer scroll.
 *
 * @param {string}    imagen       - URL de la imagen de fondo
 * @param {string}    imagenAlt    - Descripción accesible de la imagen
 * @param {"left"|"right"} fotoLado - Lado donde va la foto (default: "left")
 * @param {"light"|"white"} fondo  - Color de fondo del panel de texto
 * @param {string}    eyebrow      - Etiqueta pequeña superior
 * @param {string}    titulo       - Título de la sección
 * @param {ReactNode} children     - Contenido del panel de texto
 */
export default function SplitSection({
  imagen,
  imagenAlt = "",
  fotoLado = "left",
  fondo = "light",
  eyebrow,
  titulo,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const imagenEl = (
    <div
      className="split-section__image"
      style={{ backgroundImage: `url(${imagen})` }}
      role="img"
      aria-label={imagenAlt || titulo}
    />
  );

  const textoEl = (
    <div className={`split-section__text split-section__text--${fondo}`}>
      {eyebrow && <p className="split-section__eyebrow">{eyebrow}</p>}
      <h2 className="split-section__title">{titulo}</h2>
      <div className="split-section__divider" aria-hidden="true" />
      {children}
    </div>
  );

  return (
    <section ref={ref} className="split-section fade-in-scroll">
      {fotoLado === "left" ? (
        <>{imagenEl}{textoEl}</>
      ) : (
        <>{textoEl}{imagenEl}</>
      )}
    </section>
  );
}