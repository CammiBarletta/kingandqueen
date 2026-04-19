import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {

  // ── Autenticación ──────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", email: "" });
  // ── Carrito ────────────────────────────────────────────────
  const [carrito, setCarrito] = useState([]);
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {                          
      const yaEsta = prevCarrito.find(item => item.id === producto.id);
      if (yaEsta) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (productoId) => {          
    setCarrito(prevCarrito =>
      prevCarrito.filter(item => item.id !== productoId)
    );
  };

  const vaciarCarrito = () => {                        
    setCarrito([]);
  };

  // ── Sesión ─────────────────────────────────────────────────
  const cerrarSesion = () => {
    setIsAuthenticated(false);
    setUsuario({ nombre: "", email: "" });
    vaciarCarrito();                                     
  };
  // ── Todo lo que los componentes pueden usar ────────────────
  const value = {
    // Autenticación
    isAuthenticated,
    setIsAuthenticated,
    usuario,
    setUsuario,
    cerrarSesion,
    // Carrito
    carrito,
    setCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  };

  return (                                              
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useAppContext() {                        
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return context;

}
