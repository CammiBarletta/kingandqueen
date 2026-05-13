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

  // ─── Carrito ──────────────────────────────────────────────────────────────────

  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const idNormalizado = String(producto.id);
      const productoExistente = prevCarrito.find(item => item.id === idNormalizado);

      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === idNormalizado
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        return [...prevCarrito, {
          id: idNormalizado,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen || producto.avatar,
          cantidad: 1,
        }];
      }
    });
    toast.success(`${producto.nombre} agregado al carrito 🐾`);
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== String(productoId)));
    toast.info("Producto eliminado");
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    toast.info("Carrito vaciado");
  };

  const agregarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(producto =>
        producto.id === String(idProducto)
          ? { ...producto, cantidad: (producto.cantidad || 1) + 1 }
          : producto
      )
    );
  };

  const quitarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(producto => {
        if (producto.id !== String(idProducto)) return producto;
        const cantidadActual = producto.cantidad || 1;
        if (cantidadActual === 1) return null;
        return { ...producto, cantidad: cantidadActual - 1 };
      }).filter(Boolean)
    );
  };

  // ─── Valores derivados ────────────────────────────────────────────────────────

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + (Number(item.precio) * (item.cantidad || 1)), 0),
    [carrito]
  );

  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0),
    [carrito]
  );

  // ─── WhatsApp ─────────────────────────────────────────────────────────────────

  const enviarPedidoPorWhatsapp = () => {
    if (carrito.length === 0) {
      toast.error("Tu carrito está vacío 🐾");
      return;
    }

    const sanitizar = (texto) => texto.replace(/[*_~`]/g, "");

    const items = carrito
      .map(item =>
        `• ${sanitizar(item.nombre)} x${item.cantidad || 1} - $${(
          Number(item.precio) * (item.cantidad || 1)
        ).toLocaleString("es-AR")}`
      )
      .join("\n");

    const mensaje =
      `*Nuevo pedido King & Queen*\n\n` +
      `${items}\n\n` +
      `*Total: $${total.toLocaleString("es-AR")}*\n\n` +
      `¡Hola! Quiero realizar este pedido`;

    const numeroWhatsapp = "5491128714704";
    window.open(`https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  // ─── Drawer ───────────────────────────────────────────────────────────────────

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const cerrarDrawer = () => setIsDrawerOpen(false);

  // ─── Provider ─────────────────────────────────────────────────────────────────

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      vaciarCarrito,
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