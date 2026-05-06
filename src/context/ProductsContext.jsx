import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const API_URL = 'https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos';

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
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

  const normalizarProducto = (producto) => ({
    destacado: false,
    activo: true,
    stock: null,
    precioAnterior: null,
    orden: 0,
    descripcion: "",
    categoria: "general",
    ...producto,
  });

  // ─── Carga inicial ────────────────────────────────────────────────────────────

  useEffect(() => {
    const cargarProductos = async () => {
      setError(null); // ← acá adentro, no suelto afuera
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al cargar productos');
        const datos = await respuesta.json();
        setProductos(datos.map(normalizarProducto));
      } catch (error) {
        setError('No se pudieron cargar los productos 😢');
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // ─── Valores derivados ────────────────────────────────────────────────────────

  const productosFiltrados = useMemo(
    () => productos.filter(p => p.activo !== false),
    [productos]
  );

  const productosDestacados = useMemo(
    () => productosFiltrados.filter(p => p.destacado === true),
    [productosFiltrados]
  );

  // ─── CRUD ─────────────────────────────────────────────────────────────────────

  const agregarProducto = useCallback(async (nuevoProducto) => {
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
      setProductos(prev => [...prev, normalizarProducto(data)]);
      return data;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }, []); // sin deps — no usa productos

  const editarProducto = useCallback(async (productoActualizado) => {
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
        prev.map(p => (p.id === productoActualizado.id ? normalizarProducto(data) : p))
      );
      return data;
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    } finally {
      desmarcarActualizando(productoActualizado.id);
    }
  }, []); // sin deps — usa setter funcional

  const eliminarProducto = useCallback(async (id) => {
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
  }, []); // sin deps — usa setter funcional

  // ─── Acciones rápidas ─────────────────────────────────────────────────────────

  const toggleDestacado = useCallback(async (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    const nuevoValor = !producto.destacado;

    marcarActualizando(id);
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, destacado: nuevoValor } : p))
    );

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destacado: nuevoValor }),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar destacado');
      return nuevoValor;
    } catch (error) {
      setProductos(prev =>
        prev.map(p => (p.id === id ? { ...p, destacado: !nuevoValor } : p))
      );
      throw error;
    } finally {
      desmarcarActualizando(id);
    }
  }, [productos]); // necesita productos para el .find()

  const toggleActivo = useCallback(async (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    const nuevoValor = !producto.activo;

    marcarActualizando(id);
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, activo: nuevoValor } : p))
    );

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
      throw error;
    } finally {
      desmarcarActualizando(id);
    }
  }, [productos]); // necesita productos para el .find()

  // ─── Validación ───────────────────────────────────────────────────────────────

  const validar = useCallback((producto) => {
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
      if (isNaN(Number(producto.precioAnterior)) || Number(producto.precioAnterior) <= 0)
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

    return { esValido: Object.keys(errores).length === 0, errores };
  }, []);

  // ─── Valor del contexto ───────────────────────────────────────────────────────

  return (
    <ProductsContext.Provider
      value={{
        productos,
        productosFiltrados,
        productosDestacados,
        cargando,
        error,
        actualizandoIds,
        agregarProducto,
        editarProducto,
        eliminarProducto,
        toggleDestacado,
        toggleActivo,
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