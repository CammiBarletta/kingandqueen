import { Link } from "react-router-dom";
import "../Footer.css";

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
            <a
              href="https://wa.me/5491128714704"
              target="_blank"
              rel="noreferrer"
              className="site-footer__social-link"
            >
               WhatsApp
            </a>
            <a
              href="https://www.instagram.com/kingandqueen.petshop"
              target="_blank"
              rel="noreferrer"
              className="site-footer__social-link"
            >
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