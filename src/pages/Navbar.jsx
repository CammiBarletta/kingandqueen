import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
    
        <li>
          <Link to="/productos">Nosotros</Link>
        </li>

        <li>
          <Link to="/contacto">Contacto</Link>
        </li>

        <li>
          <Link to="/iniciar-sesion">Iniciar Sesión</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
