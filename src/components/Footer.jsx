import { Link } from "react-router-dom";
import "../Footer.css";

const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* COLUMNA 1 — Info del negocio */}
        <div className="site-footer__col">
          <h6 className="site-footer__heading">KING & QUEEN PET SHOP</h6>
          <span className="site-footer__divider" />
          <p className="site-footer__text">Pet shop y Peluquería canina</p>
          <ul className="site-footer__list">
            <li>- Alimentos balanceados</li>
            <li>- Accesorios</li>
            <li>- Peluquería canina</li>
            <li>- Envíos disponibles</li>
          </ul>
          <p className="site-footer__text site-footer__tagline">
            Dale a tu mascota todo lo que se merece
          </p>
        </div>

        {/* COLUMNA 2 — Accesos directos */}
        <div className="site-footer__col">
          <h6 className="site-footer__heading">ACCESOS DIRECTOS</h6>
          <span className="site-footer__divider" />
          <ul className="site-footer__nav">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

 {/* COLUMNA 3 — Contacto */}
        <div className="site-footer__col">
          <h6 className="site-footer__heading">CONTACTO</h6>
          <span className="site-footer__divider" />
          <ul className="site-footer__list">
            <li>Buenos Aires, AR</li>
            <li>Lun-Sab: 08:00 a 20:00</li>
          </ul>
          <div className="site-footer__social">
            <a href="https://wa.me/5491128714704"
              target="_blank"
              rel="noreferrer"
              className="site-footer__social-link"
            >
              <IconWhatsApp />
              WhatsApp
            </a>
            <a href="https://www.instagram.com/kingandqueen.petshop"
              target="_blank"
              rel="noreferrer"
              className="site-footer__social-link"
            >
              <IconInstagram />
              Instagram
            </a>
          </div>
        </div>       

      </div>          
      {/* Copyright */}
      <div className="site-footer__bottom">
        <hr className="site-footer__hr" />
        <p className="site-footer__copy">
          PetShop © 2026 — Programado por @CammiBarletta
        </p>
      </div>

    </footer>
  );
}