// src/pages/admin/ProductList.jsx
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIAS } from '../constants/categories';

// ─── Helper ───────────────────────────────────────────────────────────────────
// Una sola función para normalizar texto. Si mañana cambia la lógica,
// se cambia en un lugar.
const normalizarTexto = (txt = '') =>
  txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ─── Custom hook: useDebounce ─────────────────────────────────────────────────
// Devuelve el valor recibido, pero "atrasado" N milisegundos.
// El input actualiza `busqueda` al instante (UX fluida).
// El filtrado usa `busquedaDebounced` (solo cuando el usuario paró de escribir).
import { useEffect, useRef } from 'react';

function useDebounce(valor, ms = 300) {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    // Cada vez que `valor` cambia, armamos un timer.
    const timer = setTimeout(() => setValorDebounced(valor), ms);
    // Si `valor` cambia antes de que pasen los ms, cancelamos el timer anterior.
    // Esto es la clave del debounce: solo ejecuta cuando el valor "se asentó".
    return () => clearTimeout(timer);
  }, [valor, ms]);

  return valorDebounced;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const OPCIONES_ESTADO = [
  { value: 'todos',     label: 'Todos'     },
  { value: 'activos',   label: 'Activos'   },
  { value: 'inactivos', label: 'Inactivos' },
];

// Columnas que soportan sorting. `key` tiene que coincidir con el campo
// del objeto producto para que el comparador genérico funcione.
const COLUMNAS_SORT = [
  { key: 'nombre',    label: 'Nombre'    },
  { key: 'precio',    label: 'Precio'    },
  { key: 'stock',     label: 'Stock'     },
  { key: 'destacado', label: 'Destacado' },
];

const PRODUCTOS_POR_PAGINA = 10;

// ─── Componente ───────────────────────────────────────────────────────────────
export default function ProductList() {
  const navigate = useNavigate();

  const {
    productos,
    cargando,
    error,
    actualizandoIds,
    toggleDestacado,
    toggleActivo,
    eliminarProducto,
  } = useProducts();

  // ─── Estado local ────────────────────────────────────────────────────────────
  const [busqueda,         setBusqueda]         = useState('');
  const [categoriaFiltro,  setCategoriaFiltro]  = useState('todas');
  const [estadoFiltro,     setEstadoFiltro]     = useState('todos');
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [paginaActual,     setPaginaActual]     = useState(1);

  // Sort: qué columna y en qué dirección.
  // `asc` = A→Z / menor→mayor. `desc` = Z→A / mayor→menor.
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  // Valor de búsqueda "asentado" — lo usa el filtrado, no el input.
  const busquedaDebounced = useDebounce(busqueda, 300);

  // ─── Resetear página cuando cambian filtros ──────────────────────────────────
  // Si estás en página 3 y filtrás por "gato", probablemente no haya 30 resultados.
  // Volvemos a página 1 automáticamente.
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaDebounced, categoriaFiltro, estadoFiltro, sort]);

  // ─── Pipeline: filtrar → ordenar → paginar ───────────────────────────────────
  // Separado en 3 useMemo encadenados para que sea legible.
  // Cada uno solo recalcula cuando cambia su input.

    const productosFiltrados = useMemo(() => {
  return productos.filter(p => {
    const nombreNorm = normalizarTexto(p.nombre || '');
    const busquedaNorm = normalizarTexto(busquedaDebounced);

    const coincideBusqueda  = nombreNorm.includes(busquedaNorm);
    const coincideCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro;
    const coincideEstado =
      estadoFiltro === 'todos' ||
      (estadoFiltro === 'activos' && p.activo !== false) ||
      (estadoFiltro === 'inactivos' && p.activo === false);

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });
    } , [productos, busquedaDebounced, categoriaFiltro, estadoFiltro]);

  const productosOrdenados = useMemo(() => {
  if (!sort.key) return productosFiltrados;

  return [...productosFiltrados].sort((a, b) => {
    let valA = a[sort.key];
    let valB = b[sort.key];

    if (valA === null || valA === undefined) valA = sort.dir === 'asc' ? Infinity : -Infinity;
    if (valB === null || valB === undefined) valB = sort.dir === 'asc' ? Infinity : -Infinity;

    if (typeof valA === 'boolean') valA = valA ? 1 : 0;
    if (typeof valB === 'boolean') valB = valB ? 1 : 0;

    const numA = Number(valA);
    const numB = Number(valB);
    const ambosSonNumeros = !isNaN(numA) && !isNaN(numB);

    if (ambosSonNumeros) {
      return sort.dir === 'asc' ? numA - numB : numB - numA;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sort.dir === 'asc'
        ? normalizarTexto(valA).localeCompare(normalizarTexto(valB))
        : normalizarTexto(valB).localeCompare(normalizarTexto(valA));
    }

    return 0;
  });
}, [productosFiltrados, sort]);


  // 3. Paginado
  const totalPaginas    = Math.ceil(productosOrdenados.length / PRODUCTOS_POR_PAGINA);
  const productosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    return productosOrdenados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosOrdenados, paginaActual]);

  // ─── Handler de sorting ──────────────────────────────────────────────────────
  // Si hacés clic en la misma columna, invierte la dirección.
  // Si hacés clic en otra columna, empieza en 'asc'.
  const handleSort = (key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  // Ícono visual para la columna activa
  const iconoSort = (key) => {
    if (sort.key !== key) return <span className="text-muted ms-1">↕</span>;
    return sort.dir === 'asc'
      ? <span className="ms-1">↑</span>
      : <span className="ms-1">↓</span>;
  };

  // ─── Handlers de acciones ─────────────────────────────────────────────────
  const handleToggleDestacado = async (id) => {
    try {
      // toggleDestacado ahora devuelve el nuevo valor — sin leer estado viejo.
      const nuevoEstado = await toggleDestacado(id);
      toast.success(nuevoEstado ? '⭐ Producto destacado' : 'Quitado de destacados');
    } catch {
      toast.error('No se pudo actualizar el producto');
    }
  };

  const handleToggleActivo = async (id) => {
    try {
      const nuevoEstado = await toggleActivo(id);
      toast.success(nuevoEstado ? '✓ Producto activado' : 'Producto desactivado');
    } catch {
      toast.error('No se pudo actualizar el producto');
    }
  };

  const handleSolicitarEliminar  = (id) => setProductoAEliminar(id);
  const handleCancelarEliminar   = ()   => setProductoAEliminar(null);

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar);
      toast.success('Producto eliminado');
    } catch {
      toast.error('No se pudo eliminar el producto');
    } finally {
      setProductoAEliminar(null);
    }
  };

  // ─── Estados de carga y error ─────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid px-4 py-4">

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-semibold">Productos</h1>
          <p className="text-muted small mb-0">
            {productosFiltrados.length} de {productos.length} productos
            {sort.key && (
              <span className="ms-2 text-muted">
                · ordenado por {COLUMNAS_SORT.find(c => c.key === sort.key)?.label}
              </span>
            )}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/productos/nuevo')}
        >
          + Nuevo producto
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={busqueda}
            // El input actualiza `busqueda` al instante (UX fluida).
            // El filtrado usa `busquedaDebounced`, que va 300ms atrás.
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
          >
            {OPCIONES_ESTADO.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        {(busqueda || categoriaFiltro !== 'todas' || estadoFiltro !== 'todos') && (
          <div className="col-12 col-md-1">
            <button
              className="btn btn-outline-secondary w-100"
              title="Limpiar filtros"
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('todas');
                setEstadoFiltro('todos');
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-4 mb-1">😢</p>
          <p className="fw-medium mb-1">No se encontraron productos</p>
          <p className="text-muted small mb-3">
            {busqueda
              ? `No hay resultados para "${busqueda}"`
              : 'No hay productos que coincidan con los filtros seleccionados.'
            }
          </p>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setBusqueda('');
              setCategoriaFiltro('todas');
              setEstadoFiltro('todos');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          {/* Tabla */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Imagen</th>

                  {/* Columnas con sorting clickeable */}
                  {COLUMNAS_SORT.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    >
                      {col.label}{iconoSort(col.key)}
                    </th>
                  ))}

                  <th>Categoría</th>
                  <th>Estado</th>
                  <th style={{ width: '210px' }}></th>
                </tr>
              </thead>
              <tbody>
                {productosPagina.map(producto => {
                  const estaActualizando = actualizandoIds.has(producto.id);

                  return (
                    <tr
                      key={producto.id}
                      style={{ opacity: producto.activo === false ? 0.5 : 1 }}
                    >
                      {/* Imagen */}
                      <td>
                        {producto.avatar ? (
                          <img
                            src={producto.avatar}
                            alt={producto.nombre}
                            style={{
                              width: '48px', height: '48px',
                              objectFit: 'cover', borderRadius: '6px',
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '6px',
                            backgroundColor: '#f0f0f0', fontSize: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            🐾
                          </div>
                        )}
                      </td>

                      {/* Nombre */}
                      <td>
                        <span className="fw-medium">{producto.nombre}</span>
                        {producto.precioAnterior && (
                          <div>
                            <small className="text-muted text-decoration-line-through">
                              ${Number(producto.precioAnterior).toLocaleString('es-AR')}
                            </small>
                          </div>
                        )}
                      </td>

                      {/* Precio */}
                      <td className="fw-medium">
                        ${Number(producto.precio).toLocaleString('es-AR')}
                      </td>

                      {/* Stock */}
                      <td>
                        {producto.stock === null || producto.stock === undefined ? (
                          <span className="text-muted small">—</span>
                        ) : producto.stock === 0 ? (
                          <span className="badge bg-danger bg-opacity-10 text-danger">Sin stock</span>
                        ) : (
                          producto.stock
                        )}
                      </td>

                      {/* Destacado */}
                      <td className="text-center">
                        {producto.destacado ? '⭐' : <span className="text-muted">—</span>}
                      </td>

                      {/* Categoría */}
                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary fw-normal">
                          {CATEGORIAS.find(c => c.value === producto.categoria)?.label ?? producto.categoria}
                        </span>
                      </td>

                      {/* Estado */}
                      <td>
                        <span className={`badge ${
                          producto.activo !== false
                            ? 'bg-success bg-opacity-10 text-success'
                            : 'bg-secondary bg-opacity-10 text-secondary'
                        }`}>
                          {producto.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/productos/${producto.id}/editar`)}
                            disabled={estaActualizando}
                          >
                            Editar
                          </button>

                          <button
                            className={`btn btn-sm ${producto.destacado ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => handleToggleDestacado(producto.id)}
                            disabled={estaActualizando}
                            title={producto.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                          >
                            {estaActualizando ? '…' : producto.destacado ? '★' : '☆'}
                          </button>

                          <button
                            className={`btn btn-sm ${
                              producto.activo !== false ? 'btn-outline-secondary' : 'btn-outline-success'
                            }`}
                            onClick={() => handleToggleActivo(producto.id)}
                            disabled={estaActualizando}
                          >
                            {estaActualizando ? '…' : producto.activo !== false ? 'Desactivar' : 'Activar'}
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleSolicitarEliminar(producto.id)}
                            disabled={estaActualizando}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación — solo se muestra si hay más de una página */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Página {paginaActual} de {totalPaginas}
                {' · '}{productosFiltrados.length} resultados
              </small>

              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(p => p - 1)}
                      disabled={paginaActual === 1}
                    >
                      ‹
                    </button>
                  </li>

                  {/* Números de página — mostramos máximo 5 alrededor de la actual */}
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter(n =>
                      n === 1 ||
                      n === totalPaginas ||
                      Math.abs(n - paginaActual) <= 1
                    )
                    .reduce((acc, n, i, arr) => {
                      // Agrega "..." cuando hay un salto entre números
                      if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === '...' ? (
                        <li key={`ellipsis-${i}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      ) : (
                        <li
                          key={item}
                          className={`page-item ${paginaActual === item ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setPaginaActual(item)}
                          >
                            {item}
                          </button>
                        </li>
                      )
                    )
                  }

                  <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(p => p + 1)}
                      disabled={paginaActual === totalPaginas}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal confirmación de eliminación */}
      {productoAEliminar && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050,
          }}
          onClick={handleCancelarEliminar}
        >
          <div
            className="bg-white rounded-3 p-4 shadow"
            style={{ maxWidth: '400px', width: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <h5 className="fw-semibold mb-2">¿Eliminar producto?</h5>
            <p className="text-muted mb-4">
              Esta acción no se puede deshacer. El producto desaparecerá
              de la tienda inmediatamente.
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-secondary" onClick={handleCancelarEliminar}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmarEliminar}
                disabled={actualizandoIds.has(productoAEliminar)}
              >
                {actualizandoIds.has(productoAEliminar) ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}