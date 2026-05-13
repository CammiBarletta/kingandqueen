import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const ProductsContext = createContext();

const COLECCION = 'productos';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizarProducto = (producto) => ({
  destacado: false,
  activo: true,
  stock: null,
  precioAnterior: null,
  orden: 0,
  descripcion: '',
  categoria: 'general',
  ...producto,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProductsProvider({ children }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizandoIds, setActualizandoIds] = useState(new Set());

  const marcarActualizando = (id) =>
    setActualizandoIds((prev) => new Set(prev).add(id));

  const desmarcarActualizando = (id) =>
    setActualizandoIds((prev) => {
      const siguiente = new Set(prev);
      siguiente.delete(id);
      return siguiente;
    });

  // ─── Escucha en tiempo real ───────────────────────────────────────────────

  useEffect(() => {
    setCargando(true);
    const unsub = onSnapshot(
      collection(db, COLECCION),
      (snapshot) => {
        const datos = snapshot.docs.map((docSnap) =>
          normalizarProducto({ id: docSnap.id, ...docSnap.data() })
        );
        setProductos(datos);
        setCargando(false);
      },
      (err) => {
        console.error('Error al escuchar productos:', err);
        setError('No se pudieron cargar los productos 😢');
        setCargando(false);
      }
    );
    return () => unsub(); // limpia el listener al desmontar
  }, []);

  // ─── Valores derivados ────────────────────────────────────────────────────

  const productosFiltrados = useMemo(() => {
    const activos = productos.filter((p) => p.activo !== false);
    if (categoriaSeleccionada === 'todas') return activos;
    return activos.filter((p) => p.categoria === categoriaSeleccionada);
  }, [productos, categoriaSeleccionada]);

  const productosDestacados = useMemo(
    () => productosFiltrados.filter((p) => p.destacado === true),
    [productosFiltrados]
  );

  const categorias = useMemo(() => {
    const lista = productos.map((p) => p.categoria);
    return ['todas', ...new Set(lista)];
  }, [productos]);

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  const agregarProducto = useCallback(async (nuevoProducto) => {
    const productoConDefaults = {
      destacado: false,
      activo: true,
      stock: null,
      precioAnterior: null,
      orden: 0,
      creadoEn: serverTimestamp(),
      ...nuevoProducto,
    };
    try {
      const docRef = await addDoc(collection(db, COLECCION), productoConDefaults);
      return { id: docRef.id, ...productoConDefaults };
    } catch (err) {
      console.error('Error al agregar producto:', err);
      throw err;
    }
  }, []);

  const editarProducto = useCallback(async (productoActualizado) => {
    const { id, ...datos } = productoActualizado;
    marcarActualizando(id);
    try {
      await updateDoc(doc(db, COLECCION, id), datos);
      return productoActualizado;
    } catch (err) {
      console.error('Error al editar producto:', err);
      throw err;
    } finally {
      desmarcarActualizando(id);
    }
  }, []);

  const eliminarProducto = useCallback(async (id) => {
    marcarActualizando(id);
    try {
      await deleteDoc(doc(db, COLECCION, id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      throw err;
    } finally {
      desmarcarActualizando(id);
    }
  }, []);

  // ─── Acciones rápidas ─────────────────────────────────────────────────────

  const toggleDestacado = useCallback(async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    const nuevoValor = !producto.destacado;
    marcarActualizando(id);
    try {
      await updateDoc(doc(db, COLECCION, id), { destacado: nuevoValor });
      return nuevoValor;
    } catch (err) {
      console.error('Error al actualizar destacado:', err);
      throw err;
    } finally {
      desmarcarActualizando(id);
    }
  }, [productos]);

  const toggleActivo = useCallback(async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    const nuevoValor = !producto.activo;
    marcarActualizando(id);
    try {
      await updateDoc(doc(db, COLECCION, id), { activo: nuevoValor });
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      throw err;
    } finally {
      desmarcarActualizando(id);
    }
  }, [productos]);

  // ─── Validación ───────────────────────────────────────────────────────────

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

  // ─── Valor del contexto ───────────────────────────────────────────────────

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
        categorias,
        categoriaSeleccionada,
        setCategoriaSeleccionada,
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