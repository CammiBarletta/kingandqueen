import { Routes, Route } from "react-router-dom";
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
import RutaProtegida from './pages/RutaProtegida';
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from './context/ProductsContext';
import Dashboard   from './admin/Dashboard';
import ProductList from './admin/ProductList';
import ProductForm from './admin/ProductForm';
import PedidosList from './admin/PedidoList';


import './index.css';
import './Navbar.css';
import './Footer.css'
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    
    <CartProvider>
      <AuthProvider>
         <ProductsProvider>
          <ScrollToTop />
       <div style={{ flex: "1 1 auto", minHeight: "60vh" }}>
  <Navbar />
  <CartDrawer />
  <div className="page-content" style={{ flex: "1 1 auto", minHeight: "60vh" }}>
    <Routes>
     {/* ── Rutas públicas ── */}
  <Route path='/'              element={<Inicio />}           />
  <Route path='/nosotros'      element={<Nosotros />}         />
  <Route path='/productos'     element={<Productos />}        />
  <Route path='/productos/:id' element={<DetalleProducto />}  />
  <Route path='/contacto'      element={<Contacto />}         />
  <Route path='/iniciarsesion' element={<IniciarSesion />}    />

  {/* ── Rutas protegidas ── */}
  <Route path='/pagar' element={
    <RutaProtegida><Pagar /></RutaProtegida>
  } />

  {/* ── Rutas admin ── */}
  <Route path='/admin' element={
    <RutaProtegida soloAdmin><Dashboard /></RutaProtegida>
  } />
  <Route path='/admin/pedidos' element={
  <RutaProtegida soloAdmin><PedidosList /></RutaProtegida>
  } />
  <Route path='/admin/productos' element={
    <RutaProtegida soloAdmin><ProductList /></RutaProtegida>
  } />
  <Route path='/admin/productos/nuevo' element={
    <RutaProtegida soloAdmin><ProductForm /></RutaProtegida>
  } />
  <Route path='/admin/productos/:id/editar' element={
    <RutaProtegida soloAdmin><ProductForm /></RutaProtegida>
  } />
</Routes>
          </div>
          <Footer />
          <ToastContainer
             position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            draggable
             pauseOnHover
              />
        </div>
        
        </ProductsProvider>
      </AuthProvider>
    </CartProvider>

  );
}

export default App;