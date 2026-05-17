
import { useRef, useEffect } from "react";
import './SplitSection.css';

export default function SplitSection({
  imagen,
  imagenAlt = "",
  fotoLado = "left",
  fondo = "light",
  eyebrow,
  titulo,
  children,
}) {
  const ref        = useRef(null);
  const imgRef     = useRef(null);
  const textRef    = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("ss-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const imagenEl = (
    <div
      ref={imgRef}
      className={`ss__img-wrap ss__img-wrap--${fotoLado === "left" ? "from-left" : "from-right"}`}
    >
      <img src={imagen} alt={imagenAlt || titulo} className="ss__img" />
    </div>
  );

  const textoEl = (
    <div ref={textRef} className={`ss__text ss__text--${fondo}`}>
      <div className="ss__text-inner">
        {eyebrow && <p className="ss__eyebrow">{eyebrow}</p>}
        <h2 className="ss__title">{titulo}</h2>
        <div className="ss__divider" aria-hidden="true" />
        <div className="ss__body">{children}</div>
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`ss ss--${fondo}`}
    >
      {fotoLado === "left" ? (
        <>{imagenEl}{textoEl}</>
      ) : (
        <>{textoEl}{imagenEl}</>
      )}
    </section>
  );
}