// src/pages/Nosotros.jsx
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NosotrosHero from "../components/NosotrosHero";
import SplitSection from "../components/SplitSection";
import OpinionesCarrusel from "../components/OpinionesCarrusel";
import "./Nosotros.css";

const IMG_LOCAL      = "https://res.cloudinary.com/ddutzhkpe/image/upload/f_auto,q_auto,w_1600/v1778896577/ChatGPT_Image_15_may_2026_10_56_07_p.m._jvxaim.png";
const IMG_TIENDA     = "https://res.cloudinary.com/ddutzhkpe/image/upload/f_auto,q_auto,w_1600/v1778896550/943c53ed-21a0-46eb-848f-8e290d2ba58b.png";
const IMG_PELUQUERIA = "https://res.cloudinary.com/ddutzhkpe/image/upload/f_auto,q_auto,w_1800/v1778898756/ChatGPT_Image_15_may_2026_11_32_25_p.m._r8qr2m.png";

// Hook optimizado para transiciones suaves al scroll
function useFadeOnScroll() {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15, // Activación temprana para evitar tirones visuales
        rootMargin: "0px 0px -40px 0px"
      }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  
  return ref;
}

export default function Nosotros() {
  const refCierre = useFadeOnScroll();

  return (
    <div className="nosotros-page-container">

      {/* ── 1. Hero ── */}
      <NosotrosHero
        imagen={IMG_LOCAL}
        eyebrow="Desde 2024"
        titulo="Nuestra historia"
        subtitulo="Apasionados por los animales"
      />

      {/* ── 2. Historia ── */}
      <SplitSection
        imagen={IMG_LOCAL}
        imagenAlt="Frente del local King & Queen Pet Shop"
        fotoLado="left"
        fondo="light"
        eyebrow="Quiénes somos"
        
      >
        <p>
          King & Queen nació en 2024 con una idea simple: que cada mascota reciba el cuidado que merece.
        </p>
        <p>
          Desde el primer día, el local se convirtió en un espacio donde los dueños de mascotas encuentran no solo productos, sino también consejos, contención y una atención personalizada que hace la diferencia.
        </p>
      </SplitSection>

      {/* ── 3. Peluquería ── */}
      <SplitSection
        imagen={IMG_PELUQUERIA}
        imagenAlt="Perro siendo atendido en la peluquería canina de King & Queen"
        fotoLado="right"
        fondo="white"
        eyebrow="Peluquería canina"
       
      >
        <p>
          Además de nuestra tienda, ofrecemos un servicio de{" "}
          <strong>peluquería canina profesional</strong>. Baño, corte, secado y cepillado — todo con productos de calidad y mucho amor.
        </p>
        <p>
          Reservá tu turno por WhatsApp y llevá a tu perro a lucir lo mejor de sí.
        </p>
        <a
          href="https://wa.me/549TUNUMERO"
          target="_blank"
          rel="noopener noreferrer"
          className="nosotros-btn"
        >
          Reservar turno →
        </a>
      </SplitSection>

      {/* ── 4. Tienda ── */}
      <SplitSection
        imagen={IMG_TIENDA}
        imagenAlt="Productos seleccionados en la tienda King & Queen"
        fotoLado="left"
        fondo="light"
        eyebrow="Nuestra tienda"
       
      >
        <p>
          Alimentos balanceados, accesorios, juguetes y productos de higiene — seleccionados con criterio y cuidado. No somos un local más: somos el lugar donde encontrás lo que tu mascota necesita, con el consejo de alguien que realmente le importa.
        </p>
        <p>
          Trabajamos con las mejores marcas del mercado y renovemos el catálogo constantemente para ofrecerte siempre lo mejor.
        </p>
      </SplitSection>

      {/* ── 5. Cierre ── */}
      <section ref={refCierre} className="nosotros-cierre fade-in-scroll">
        <h2 className="nosotros-cierre__eyebrow">Google Reviews</h2>
        
        <OpinionesCarrusel />
        
        <div className="nosotros-cierre__actions" style={{ marginTop: "48px" }}>
          <Link to="/productos" className="nosotros-cierre__btn-primary">
            Ver productos
          </Link>
          <a
            href="https://wa.me/5491128714704"
            target="_blank"
            rel="noopener noreferrer"
            className="nosotros-cierre__btn-ghost"
          >
            WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}