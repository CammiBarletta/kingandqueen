import React, { createContext, useContext, useState } from "react";

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export function CartProvider({ children }) {
  // Estado del carrito
  const [carrito, setCarrito] = useState([]);
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
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const cerrarDrawer = () => setIsDrawerOpen(false);


   const quitarCantidad = (idProducto) => {
    const carritoActualizado = carrito.map(producto => {
      if (producto.id === idProducto) {
        const cantidadActual = producto.cantidad || 1;
        if (cantidadActual === 1) {
          return null;
        }
        return { ...producto, cantidad: cantidadActual - 1 };
      }
      return producto;
    }).filter(producto => producto !== null);


    setCarrito(carritoActualizado);
  };

    const agregarCantidad = (idProducto) => {
    const nuevoCarrito = carrito.map(producto => {
      if (producto.id === idProducto) {
        return {
          ...producto,
          cantidad: (producto.cantidad || 1) + 1
        };
      }
      return producto;
    });
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (Number(item.precio) * cantidad);
  }, 0);

  const enviarPedidoPorWhatsapp = () => {
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

  // 3. Codifica el mensaje para la URL
  const mensajeCodificado = encodeURIComponent(mensaje);

  // 4. Abre WhatsApp con el mensaje
  const numeroWhatsapp = "5491128714704"; // WP CAMI // CAMBIAR POR ANDERSON
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