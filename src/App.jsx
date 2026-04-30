import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Nosotros from './pages/Nosotros';
import Inicio from './pages/Inicio';
import Contacto from './pages/Contacto';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Footer from './components/Footer';
import IniciarSesion from './pages/IniciarSesion';
import Pagar from './pages/Pagar';
import CartDrawer from './components/CartDrawer';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from './context/ProductsContext';
import './index.css';
import './Footer.css'

function App() {
  return (
    <CartProvider>
      <AuthProvider>
         <ProductsProvider>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
          <Navbar />
          <CartDrawer />
          <div style={{ paddingTop: "var(--navbar-height)",flex: "1 1 auto",minHeight: "60vh"}}>
            <Routes>
              <Route path='/' element={<Inicio />} />
              <Route path='/nosotros' element={<Nosotros />} />
              <Route path='/productos' element={<Productos />} />
              <Route path='/productos/:id' element={<DetalleProducto />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path='/iniciarsesion' element={<IniciarSesion />} />
              <Route path='/pagar' element={<Pagar />} /> 
            </Routes>
          </div>
          <Footer />
        </div>
        </ProductsProvider>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;