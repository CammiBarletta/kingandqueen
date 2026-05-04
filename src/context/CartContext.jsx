import React, { createContext, useContext, useState,  useEffect} from "react";
import { toast } from "react-toastify";

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export function CartProvider({ children }) {
  // Estado del carrito
  const [carrito, setCarrito] = useState(() => {
  const guardado = localStorage.getItem("carrito");
  return guardado ? JSON.parse(guardado) : [];
});
    useEffect(() => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
      }, [carrito]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Funciones para el carrito
const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
     
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
   toast.success(`${producto.nombre} agregado al carrito 🐾`);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    toast.info("Carrito vaciado ");
  };

 const eliminarDelCarrito = (productoId) => {
  setCarrito(prev => prev.filter(item => item.id !== productoId));
  toast.info("Producto eliminado ");
};
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const cerrarDrawer = () => setIsDrawerOpen(false);


const quitarCantidad = (idProducto) => {
  setCarrito(prev => prev.map(producto => {
    if (producto.id === idProducto) {
      const cantidadActual = producto.cantidad || 1;
      if (cantidadActual === 1) return null;
      return { ...producto, cantidad: cantidadActual - 1 };
    }
    return producto;
  }).filter(Boolean));
};

    const agregarCantidad = (idProducto) => {
  setCarrito(prev => prev.map(producto =>
    producto.id === idProducto
      ? { ...producto, cantidad: (producto.cantidad || 1) + 1 }
      : producto
  ));
};

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (Number(item.precio) * cantidad);
  }, 0);
  const totalItems = carrito.reduce((sum, item) => 
  sum + (item.cantidad || 1), 0
);
const enviarPedidoPorWhatsapp = () => {
  if (carrito.length === 0) {
    toast.error("Tu carrito está vacío 🐾");
    return;
  }

  // 1. Arma la lista de productos
  const items = carrito.map(item => 
    `• ${item.nombre} x${item.cantidad || 1} - $${(Number(item.precio) * (item.cantidad || 1)).toLocaleString('es-AR')}`
  ).join('\n');

  // 2. Arma el mensaje completo
  const mensaje = 
    ` *Nuevo pedido King & Queen*\n\n` +
    `${items}\n\n` +
    `*Total: $${total.toLocaleString('es-AR')}*\n\n` +
    `¡Hola! Quiero realizar este pedido `;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const numeroWhatsapp = "5491128714704";

  window.open(`https://wa.me/${numeroWhatsapp}?text=${mensajeCodificado}`, '_blank');
};
  // Valor que se provee a todos los componentes
  const value = {  
    // Carrito
    carrito,
    agregarAlCarrito,
    vaciarCarrito,
    eliminarDelCarrito,

    // f(x) de Cantidad
    agregarCantidad,
    quitarCantidad,

    // f(x) total
    total ,
    totalItems, 
    // WhatsApp
    enviarPedidoPorWhatsapp,

    isDrawerOpen,
    toggleDrawer,
    cerrarDrawer,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de CartProvider");
  }
  return context;
}