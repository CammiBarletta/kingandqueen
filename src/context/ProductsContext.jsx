import { createContext, useState, useContext, useEffect } from 'react';

const API_URL = 'https://698bbfdb6c6f9ebe57bd76ba.mockapi.io/kingandqueen/productos';

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al montar
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al cargar productos');
        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        setError("No se pudieron cargar los productos 😢");
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // Agregar producto
  const agregarProducto = async (nuevoProducto) => {
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
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

  // Editar producto
  const editarProducto = async (productoActualizado) => {
    try {
      const respuesta = await fetch(`${API_URL}/${productoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado),
      });
      if (!respuesta.ok) throw new Error('Error al editar producto');
      const data = await respuesta.json();
      setProductos(prev =>
        prev.map(p => p.id === productoActualizado.id ? data : p)
      );
      return data;
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar producto');
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  // Validación
  const validar = (producto) => {
    const errores = {};
    if (!producto.nombre?.trim())
      errores.nombre = 'El nombre es obligatorio.';
    if (!producto.precio?.toString().trim())
      errores.precio = 'El precio es obligatorio.';
    else if (isNaN(Number(producto.precio)) || Number(producto.precio) <= 0)
      errores.precio = 'Debe ser un número mayor a 0.';
    if (!producto.descripcion?.trim())
      errores.descripcion = 'La descripción es obligatoria.';
    else if (producto.descripcion.length < 10)
      errores.descripcion = 'Mínimo 10 caracteres.';
    if (!producto.categoria?.trim())
      errores.categoria = 'La categoría es obligatoria.';

    return {
      esValido: Object.keys(errores).length === 0,
      errores
    };
  };

  return (
    <ProductsContext.Provider value={{
      productos,
      cargando,
      error,
      agregarProducto,
      editarProducto,
      eliminarProducto,
      validar,
    }}>
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