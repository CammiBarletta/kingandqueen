import React, { useRef, useEffect, useState } from "react";
import "../InicioBanner.css";

/**
 * InicioBanner
 * Banner de video full-width responsive para la página de inicio.
 *
 * Props:
 * @param {string}  src          - Ruta al archivo de video (default: "/videos/banner_inicio.mp4")
 * @param {string}  poster       - Imagen de fallback mientras carga el video (opcional)
 * @param {React.ReactNode} children - Contenido superpuesto (texto, CTA, etc.) — opcional
 * @param {string}  className    - Clases CSS adicionales para el contenedor (opcional)
 */
const InicioBanner = ({
  src = "/videos/banner_inicio.mp4",
  poster,
  children,
  className = "",
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    // Si ya está listo (caché), activar de inmediato
    if (video.readyState >= 3) setIsLoaded(true);

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <section className={`inicio-banner ${className}`} aria-label="Banner de inicio">
      {/* Skeleton / placeholder mientras carga */}
      {!isLoaded && <div className="inicio-banner__skeleton" aria-hidden="true" />}

      <video
        ref={videoRef}
        className={`inicio-banner__video ${isLoaded ? "inicio-banner__video--visible" : ""}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>

      {/* Overlay listo para contenido superpuesto */}
      {children && (
        <div className="inicio-banner__overlay" aria-live="polite">
          {children}
        </div>
      )}
    </section>
  );
};

export default InicioBanner;