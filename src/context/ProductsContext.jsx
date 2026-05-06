import { createContext, useState, useContext, useEffect, useMemo } from 'react';

const API_URL = 'https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos';

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Registra qué IDs están siendo actualizados en este momento.
  // Usamos un Set para poder tener varios productos actualizándose a la vez.
  const [actualizandoIds, setActualizandoIds] = useState(new Set());

  // ─── Helpers internos ────────────────────────────────────────────────────────

  const marcarActualizando = (id) =>
    setActualizandoIds(prev => new Set(prev).add(id));

  const desmarcarActualizando = (id) =>
    setActualizandoIds(prev => {
      const siguiente = new Set(prev);
      siguiente.delete(id);
      return siguiente;
    });

  // ─── Carga inicial ────────────────────────────────────────────────────────────

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al cargar productos');
        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        setError('No se pudieron cargar los productos 😢');
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // ─── Valores derivados ────────────────────────────────────────────────────────
  // useMemo evita recalcular en cada render. Solo se recalcula cuando
  // cambia el array de productos.

  // La tienda pública solo ve productos activos.
  const productosFiltrados = useMemo(
    () => productos.filter(p => p.activo !== false),
    [productos]
  );

  // La sección Home "Destacados" usa esto directamente.
  const productosDestacados = useMemo(
    () => productosFiltrados.filter(p => p.destacado === true),
    [productosFiltrados]
  );

  // ─── CRUD ─────────────────────────────────────────────────────────────────────

  const agregarProducto = async (nuevoProducto) => {
    // Valores por defecto para los campos nuevos.
    // Si el formulario ya los manda, estos no pisan nada.
    const productoConDefaults = {
      destacado: false,
      activo: true,
      stock: null,
      precioAnterior: null,
      orden: 0,
      creadoEn: new Date().toISOString().split('T')[0],
      ...nuevoProducto,
    };

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoConDefaults),
      });
      if (!respuesta.ok) throw new Error('Error al agregar producto');
      const data = await respuesta.json();
      setProductos(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  };

  const editarProducto = async (productoActualizado) => {
    marcarActualizando(productoActualizado.id);
    try {
      const respuesta = await fetch(`${API_URL}/${productoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado),
      });
      if (!respuesta.ok) throw new Error('Error al editar producto');
      const data = await respuesta.json();
      setProductos(prev =>
        prev.map(p => (p.id === productoActualizado.id ? data : p))
      );
      return data;
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    } finally {
      desmarcarActualizando(productoActualizado.id);
    }
  };

  const eliminarProducto = async (id) => {
    marcarActualizando(id);
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!respuesta.ok) throw new Error('Error al eliminar producto');
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    } finally {
      desmarcarActualizando(id);
    }
  };

  // ─── Acciones rápidas (sin abrir formulario) ─────────────────────────────────
  // Usan PATCH porque solo tocan un campo. Es más correcto que mandar

 const toggleDestacado = async (id) => {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  const nuevoValor = !producto.destacado;

  setProductos(prev =>
    prev.map(p => (p.id === id ? { ...p, destacado: nuevoValor } : p))
  );
  marcarActualizando(id);

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destacado: nuevoValor }),
    });
    if (!respuesta.ok) throw new Error('Error al actualizar destacado');
    return nuevoValor; // ← única línea nueva
  } catch (error) {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, destacado: !nuevoValor } : p))
    );
    throw error;
  } finally {
    desmarcarActualizando(id);
  }
};
  const toggleActivo = async (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const nuevoValor = !producto.activo;

    // Mismo patrón optimista que toggleDestacado.
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, activo: nuevoValor } : p))
    );
    marcarActualizando(id);

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoValor }),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar estado');
    } catch (error) {
      setProductos(prev =>
        prev.map(p => (p.id === id ? { ...p, activo: !nuevoValor } : p))
      );
      console.error('Error al togglear activo:', error);
      throw error;
    } finally {
      desmarcarActualizando(id);
    }
  };

  // ─── Validación ───────────────────────────────────────────────────────────────

  const validar = (producto) => {
    const errores = {};

    if (!producto.nombre?.trim())
      errores.nombre = 'El nombre es obligatorio.';

    if (!producto.precio?.toString().trim())
      errores.precio = 'El precio es obligatorio.';
    else if (isNaN(Number(producto.precio)) || Number(producto.precio) <= 0)
      errores.precio = 'Debe ser un número mayor a 0.';

    if (
      producto.precioAnterior !== null &&
      producto.precioAnterior !== '' &&
      producto.precioAnterior !== undefined
    ) {
      if (
        isNaN(Number(producto.precioAnterior)) ||
        Number(producto.precioAnterior) <= 0
      )
        errores.precioAnterior = 'Debe ser un número mayor a 0.';
      else if (Number(producto.precioAnterior) <= Number(producto.precio))
        errores.precioAnterior = 'El precio anterior debe ser mayor al precio actual.';
    }

    if (!producto.descripcion?.trim())
      errores.descripcion = 'La descripción es obligatoria.';
    else if (producto.descripcion.length < 10)
      errores.descripcion = 'Mínimo 10 caracteres.';

    if (!producto.categoria?.trim())
      errores.categoria = 'La categoría es obligatoria.';

    if (
      producto.stock !== null &&
      producto.stock !== '' &&
      producto.stock !== undefined
    ) {
      if (isNaN(Number(producto.stock)) || Number(producto.stock) < 0)
        errores.stock = 'El stock debe ser un número igual o mayor a 0.';
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores,
    };
  };

  // ─── Valor del contexto ───────────────────────────────────────────────────────

  return (
    <ProductsContext.Provider
      value={{
        // Estado
        productos,           // todos — para el panel admin
        productosFiltrados,  // solo activos — para la tienda pública
        productosDestacados, // activos + destacados — para el Home
        cargando,
        error,
        actualizandoIds,     // Set<id> — para deshabilitar botones en vuelo

        // CRUD
        agregarProducto,
        editarProducto,
        eliminarProducto,

        // Acciones rápidas
        toggleDestacado,
        toggleActivo,

        // Utilidades
        validar,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductsProvider');
  }
  return context;
}