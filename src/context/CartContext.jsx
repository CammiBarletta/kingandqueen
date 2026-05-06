import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

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
        return [...prevCarrito, {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen || producto.avatar,
          cantidad: 1,
        }];
      }
    });
    toast.success(`${producto.nombre} agregado al carrito 🐾`);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    toast.info("Carrito vaciado");
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
    toast.info("Producto eliminado");
  };

  const quitarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(producto => {
        if (producto.id === idProducto) {
          const cantidadActual = producto.cantidad || 1;
          if (cantidadActual === 1) return null;
          return { ...producto, cantidad: cantidadActual - 1 };
        }
        return producto;
      }).filter(Boolean)
    );
  };

  const agregarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(producto =>
        producto.id === idProducto
          ? { ...producto, cantidad: (producto.cantidad || 1) + 1 }
          : producto
      )
    );
  };

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + (Number(item.precio) * (item.cantidad || 1)), 0),
    [carrito]
  );

  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0),
    [carrito]
  );

  const enviarPedidoPorWhatsapp = () => {
    if (carrito.length === 0) {
      toast.error("Tu carrito está vacío 🐾");
      return;
    }

    const sanitizar = (texto) => texto.replace(/[*_~`]/g, '');

    const items = carrito.map(item =>
      `• ${sanitizar(item.nombre)} x${item.cantidad || 1} - $${(Number(item.precio) * (item.cantidad || 1)).toLocaleString('es-AR')}`
    ).join('\n');

    const mensaje =
      `*Nuevo pedido King & Queen*\n\n` +
      `${items}\n\n` +
      `*Total: $${total.toLocaleString('es-AR')}*\n\n` +
      `¡Hola! Quiero realizar este pedido`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsapp = "5491128714704";
    window.open(`https://wa.me/${numeroWhatsapp}?text=${mensajeCodificado}`, '_blank');
  };

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const cerrarDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      vaciarCarrito,
      eliminarDelCarrito,
      agregarCantidad,
      quitarCantidad,
      total,
      totalItems,
      enviarPedidoPorWhatsapp,
      isDrawerOpen,
      toggleDrawer,
      cerrarDrawer,
    }}>
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