export default function Inicio() {
  return (
    <div>
      {/* Banner full width */}
      <div style={{
        position: "relative",
        height: "380px",
        overflow: "hidden",
        width: "95vw",
        marginLeft: "55%",
        transform: "translateX(-50%)"
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: "95%", height: "95%", objectFit: "fill" }}
        >
          <source src="/videos/banner_inicio.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Contenido de abajo */}
      <div className="container mt-4">
        <p>Más contenido acá abajo...</p>
      </div>
    </div>
  );
}