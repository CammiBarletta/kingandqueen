// ✅ 1. BORRAR useState, ya no lo necesitamos acá
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Nosotros from './pages/Nosotros';
import Inicio from './pages/Inicio';
import Contacto from './pages/Contacto';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Footer from './components/Footer';
import IniciarSesion from './pages/IniciarSesion'; // ✅ 2. agregar la nueva página
import { AppProvider } from './context/AppContext'; // ✅ 3. importar el Provider
import './index.css';

function App() {

  return (
    <AppProvider> 
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
        <Navbar />
        <div style={{ paddingTop: "95px", flex: "1 1 auto", minHeight: "60vh" }}>
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/nosotros' element={<Nosotros />} />
            <Route path='/productos' element={<Productos />} /> 
            <Route path='/productos/:id' element={<DetalleProducto />} /> 
            <Route path="/contacto" element={<Contacto />} />
            <Route path='/carrito' element={<Carrito />} /> 
            <Route path='/iniciarsesion' element={<IniciarSesion />} /> 
          </Routes>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;