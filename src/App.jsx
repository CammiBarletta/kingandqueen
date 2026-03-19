import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [carrito, setCarrito] = useState([]);

  return (
    <div>
      <Navbar carrito={carrito} />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/productos' element={<Productos carrito={carrito} setCarrito={setCarrito} />} />
          <Route path='/productos/:id' element={<DetalleProducto />} />
          <Route path='/carrito' element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
