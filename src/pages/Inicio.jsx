import InicioBanner from "../components/InicioBanner"; 
export default function Inicio() {
  return (
    <>
      <InicioBanner />

      {/* Contenido de abajo */}
      <div className="container mt-4">
        <p>Más contenido acá abajo...</p>
      </div>
    </>
  );
}