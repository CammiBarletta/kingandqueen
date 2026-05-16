
/**
 * Hero a pantalla completa para la página Nosotros.
 * @param {string} imagen  - URL de la imagen de fondo
 * @param {string} eyebrow - Texto pequeño superior (ej: "Desde 2024")
 * @param {string} titulo  - Título principal
 * @param {string} subtitulo
 */
export default function NosotrosHero({ imagen, eyebrow, titulo, subtitulo }) {
  return (
    <section className="nosotros-hero">
      <div
        className="nosotros-hero__bg"
        style={{ backgroundImage: `url(${imagen})` }}
        role="img"
        aria-label={titulo}
      />

      <div className="nosotros-hero__content">
        {eyebrow && <p className="nosotros-hero__eyebrow">{eyebrow}</p>}

        <h1 className="nosotros-hero__title">{titulo}</h1>

        {subtitulo && <p className="nosotros-hero__subtitle">{subtitulo}</p>}

        <div className="nosotros-hero__arrow" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}