// CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export function CartProvider({ children }) {

  // ─── Carrito por usuario ──────────────────────────────────────────────────
  // La key incluye el uid para que cada usuario tenga su propio carrito
  const getKey = (uid) => uid ? `carrito_${uid}` : "carrito_anonimo";

  const [uid, setUid] = useState(null);

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_anonimo");
    return guardado ? JSON.parse(guardado) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cuando el uid cambia (login/logout), cargamos el carrito correcto
  useEffect(() => {
    const key = getKey(uid);
    const guardado = localStorage.getItem(key);
    setCarrito(guardado ? JSON.parse(guardado) : []);
  }, [uid]);

  // Persistimos siempre que cambia el carrito
  useEffect(() => {
    const key = getKey(uid);
    localStorage.setItem(key, JSON.stringify(carrito));
  }, [carrito, uid]);

  // Exponemos setUid para que AuthContext lo llame al login/logout
  const sincronizarUsuario = (nuevoUid) => setUid(nuevoUid || null);

  // ─── Acciones ────────────────────────────────────────────────────────────

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const idNormalizado = String(producto.id);
      const existente = prev.find(item => item.id === idNormalizado);
      if (existente) {
        return prev.map(item =>
          item.id === idNormalizado
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }
      return [...prev, {
        id: idNormalizado,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || producto.avatar, 
        cantidad: 1,
      }];
    });
    toast.success(`${producto.nombre} agregado al carrito `);
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== String(productoId)));
    toast.info("Producto eliminado");
  };


  const vaciarCarrito = () => {
    setCarrito([]);
    toast.info("Carrito vaciado");
  };


  const vaciarCarritoSilencioso = () => setCarrito([]);

  const agregarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === String(idProducto)
          ? { ...p, cantidad: (p.cantidad || 1) + 1 }
          : p
      )
    );
  };

  const quitarCantidad = (idProducto) => {
    setCarrito(prev =>
      prev.map(p => {
        if (p.id !== String(idProducto)) return p;
        if ((p.cantidad || 1) === 1) return null;
        return { ...p, cantidad: p.cantidad - 1 };
      }).filter(Boolean)
    );
  };

  // ─── Valores derivados ────────────────────────────────────────────────────

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + (Number(item.precio) * (item.cantidad || 1)), 0),
    [carrito]
  );

  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0),
    [carrito]
  );

  // ─── Número de pedido ─────────────────────────────────────────────────────
  // Genera un número legible tipo KQ-4821
  const generarNumeroPedido = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `KQ-${num}`;
  };

  // ─── WhatsApp ─────────────────────────────────────────────────────────────

  const enviarPedidoPorWhatsapp = (numeroPedido) => {
    if (carrito.length === 0) {
      toast.error("Tu carrito está vacío 🐾");
      return;
    }

    const sanitizar = (texto) => texto.replace(/[*_~`]/g, "");

    const items = carrito
      .map(item =>
        `• ${sanitizar(item.nombre)} x${item.cantidad || 1} — $${(
          Number(item.precio) * (item.cantidad || 1)
        ).toLocaleString("es-AR")}`
      )
      .join("\n");

    const mensaje =
      `*Nuevo pedido King & Queen*\n` +
      `*N° ${numeroPedido}*\n\n` +
      `${items}\n\n` +
      `*Total: $${total.toLocaleString("es-AR")}*\n\n` +
      `¡Hola! Quiero realizar este pedido 🐾`;

    const numeroWhatsapp = "5491128714704";
    window.open(
      `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  // ─── Drawer ───────────────────────────────────────────────────────────────

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const cerrarDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      vaciarCarrito,
      vaciarCarritoSilencioso,
      agregarCantidad,
      quitarCantidad,
      total,
      totalItems,
      generarNumeroPedido,
      enviarPedidoPorWhatsapp,
      sincronizarUsuario,
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