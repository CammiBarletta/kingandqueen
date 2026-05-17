import { useState, useEffect, useRef, useCallback } from "react";

const OPINIONES = [
  {
    id: 1,
    nombre: "Gabriela Alemandi",
    fecha: "30/08/2025",
    estrellas: 5,
    texto: "Encontras todo para tu mascota, muy buena atención, todos los medios de pagos.",
    inicial: "G",
    color: "#1a7a4a",
  },
  {
    id: 2,
    nombre: "Gisela Dominguez",
    fecha: "19/08/2025",
    estrellas: 5,
    texto: "Soy cliente desde hace unos años. Siempre buen precio y buena atención.",
    inicial: "G",
    color: "#1a7a4a",
  },
  {
    id: 3,
    nombre: "Ernesto Jorge",
    fecha: "10/04/2025",
    estrellas: 5,
    texto: "Muy buen surtido y buenos precios en artículos para mascotas.",
    inicial: "E",
    color: "#4a6fa5",
    tieneAvatar: true,
  },
  {
    id: 4,
    nombre: "Nancy Cumpa Lopez",
    fecha: "05/02/2025",
    estrellas: 5,
    texto: "Mucha variedad de productos para mascotas. Buenos precios.",
    inicial: "N",
    color: "#2e6b8a",
  },
  {
    id: 5,
    nombre: "Leandro Ojeda",
    fecha: "01/02/2025",
    estrellas: 5,
    texto: "Buenos precios, buena atención.",
    inicial: "L",
    color: "#7a5c3a",
    tieneAvatar: true,
  },
  {
    id: 6,
    nombre: "Alicia Coronel",
    fecha: "27/01/2025",
    estrellas: 5,
    texto: "Los lugares que vuelvo es porque encontré lo que buscaba, buen trato, buena mercadería, se adecuan a la economía del cliente.",
    inicial: "A",
    color: "#8a3a3a",
  },
];

const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Estrellas = ({ cantidad }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < cantidad ? "#f5a623" : "#ccc"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const Avatar = ({ inicial, color }) => (
  <div style={{
    width: "40px", height: "40px", borderRadius: "50%",
    background: color, color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700", flexShrink: 0,
  }}>
    {inicial}
  </div>
);

export default function OpinionesCarrusel() {
  const [indice, setIndice] = useState(0);
  const [visibles, setVisibles] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);

  // Calcular cuántas cards mostrar según ancho
  useEffect(() => {
    const calcular = () => {
      const w = window.innerWidth;
      if (w < 600) setVisibles(1);
      else if (w < 960) setVisibles(2);
      else setVisibles(3);
    };
    calcular();
    window.addEventListener("resize", calcular);
    return () => window.removeEventListener("resize", calcular);
  }, []);

  const maxIndice = Math.max(0, OPINIONES.length - visibles);

  const siguiente = useCallback(() => {
    setIndice((prev) => (prev >= maxIndice ? 0 : prev + 1));
  }, [maxIndice]);

  const anterior = () => {
    setIndice((prev) => (prev <= 0 ? maxIndice : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(siguiente, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [siguiente]);

  const resetAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(siguiente, 4000);
  };

  const ir = (i) => { setIndice(i); resetAutoplay(); };

  // Swipe touch/mouse
  const onDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.type === "mousedown" ? e.clientX : e.touches[0].clientX);
  };

  const onDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const end = e.type === "mouseup" ? e.clientX : e.changedTouches[0].clientX;
    const diff = dragStart - end;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { setIndice((p) => Math.min(p + 1, maxIndice)); }
      else { setIndice((p) => Math.max(p - 1, 0)); }
      resetAutoplay();
    }
  };

  const cardWidth = `calc(${100 / visibles}% - ${(visibles - 1) * 16 / visibles}px)`;

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", position: "relative", padding: "0 0 40px" }}>

      {/* Track con overflow hidden */}
      <div style={{ overflow: "hidden", borderRadius: "12px" }}>
        <div
          ref={trackRef}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
          style={{
            display: "flex",
            gap: "16px",
            transform: `translateX(calc(-${indice * (100 / visibles)}% - ${indice * 16 / visibles}px))`,
            transition: isDragging ? "none" : "transform 0.4s ease",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          {OPINIONES.map((op) => (
            <div
              key={op.id}
              style={{
                minWidth: cardWidth,
                flexShrink: 0,
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "left",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header card */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar inicial={op.inicial} color={op.color} />
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1c1c1a" }}>{op.nombre}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>{op.fecha}</p>
                  </div>
                </div>
                <IconGoogle />
              </div>

              {/* Estrellas */}
              <div style={{ marginBottom: "10px" }}>
                <Estrellas cantidad={op.estrellas} />
              </div>

              {/* Texto */}
              <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: "1.6" }}>
                "{op.texto}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Controles: flechas */}
      <button
        onClick={() => { anterior(); resetAutoplay(); }}
        style={{
          position: "absolute", left: "-20px", top: "50%", transform: "translateY(-60%)",
          background: "#fff", border: "1px solid #e0e0e0",
          borderRadius: "50%", width: "36px", height: "36px",
          color: "#1c1c1a", fontSize: "20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.2s",
          zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
      >
        ‹
      </button>
      <button
        onClick={() => { siguiente(); resetAutoplay(); }}
        style={{
          position: "absolute", right: "-20px", top: "50%", transform: "translateY(-60%)",
          background: "#fff", border: "1px solid #e0e0e0",
          borderRadius: "50%", width: "36px", height: "36px",
          color: "#1c1c1a", fontSize: "20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.2s",
          zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
      >
        ›
      </button>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
        {Array.from({ length: maxIndice + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => ir(i)}
            style={{
              width: indice === i ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: indice === i ? "#1a3a2a" : "#d0d0d0",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}