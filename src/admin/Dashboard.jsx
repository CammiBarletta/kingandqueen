// src/pages/admin/Dashboard.jsx
import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';

// ─── Componente auxiliar: MetricCard ─────────────────────────────────────────
// Separado del Dashboard para que el JSX principal sea más legible.
// Recibe: título, valor numérico, color Bootstrap, y un emoji como ícono simple.
function MetricCard({ titulo, valor, variante, icono, descripcion }) {
  return (
    <div className="col-6 col-lg-3">
      <div className={`card border-${variante} h-100`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted small fw-semibold text-uppercase tracking-wide">
              {titulo}
            </span>
            <span style={{ fontSize: '1.25rem' }}>{icono}</span>
          </div>
          <p className={`display-6 fw-bold text-${variante} mb-1`}>
            {valor}
          </p>
          {descripcion && (
            <p className="text-muted small mb-0">{descripcion}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Componente auxiliar: AccesoRapido ────────────────────────────────────────
// Botón grande de acceso rápido. Acepta `onClick` o `to` (Link de React Router).
function AccesoRapido({ icono, titulo, descripcion, variante = 'outline-primary', onClick, to }) {
  const claseBtn = `btn btn-${variante} w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-2 py-4`;

  const contenido = (
    <>
      <span style={{ fontSize: '1.75rem' }}>{icono}</span>
      <span className="fw-semibold">{titulo}</span>
      {descripcion && (
        <span className="text-muted small fw-normal">{descripcion}</span>
      )}
    </>
  );

  if (to) {
    return (
      <div className="col-6 col-lg-3">
        <Link to={to} className={claseBtn} style={{ textDecoration: 'none', minHeight: '130px' }}>
          {contenido}
        </Link>
      </div>
    );
  }

  return (
    <div className="col-6 col-lg-3">
      <button onClick={onClick} className={claseBtn} style={{ minHeight: '130px' }}>
        {contenido}
      </button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate   = useNavigate();
  const { usuario, cerrarSesion } = useAuthContext();
  const { productos, cargando }   = useProducts();

  // ─── Métricas calculadas ────────────────────────────────────────────────────
  // Toda la lógica de cálculo fuera del JSX.
  // useMemo para no recalcular en cada render si productos no cambió.
  const metricas = useMemo(() => {
    const total      = productos.length;
    const activos    = productos.filter(p => p.activo !== false).length;
    const inactivos  = productos.filter(p => p.activo === false).length;
    const destacados = productos.filter(p => p.destacado === true).length;

    return { total, activos, inactivos, destacados };
  }, [productos]);

  // Saludo dinámico según la hora del día
  const saludo = useMemo(() => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/iniciar-sesion');
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid px-4 py-4">

      {/* ── Encabezado ── */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h1 className="h3 fw-semibold mb-1">Panel de administración</h1>
          <p className="text-muted mb-0">
            {saludo}, <strong>{usuario?.nombre ?? 'Admin'}</strong>.
            Acá tenés un resumen de tu tienda.
          </p>
        </div>

        {/* Botón cerrar sesión en el encabezado — siempre visible */}
        <button
          className="btn btn-outline-danger btn-sm align-self-start"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      {/* ── Métricas ── */}
      <section className="mb-5" aria-label="Métricas del catálogo">
        <h2 className="h6 text-muted text-uppercase fw-semibold mb-3">
          Resumen del catálogo
        </h2>

        {cargando ? (
          // Skeleton loader — las cards aparecen en gris mientras cargan
          <div className="row g-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div
                      className="placeholder-glow"
                      style={{ height: '80px' }}
                      aria-hidden="true"
                    >
                      <span className="placeholder col-6 mb-2 d-block" />
                      <span className="placeholder col-4 d-block" style={{ height: '2rem' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-3">
            <MetricCard
              titulo="Total de productos"
              valor={metricas.total}
              variante="primary"
              icono="📦"
              descripcion="en el catálogo"
            />
            <MetricCard
              titulo="Activos"
              valor={metricas.activos}
              variante="success"
              icono="✅"
              descripcion="visibles en la tienda"
            />
            <MetricCard
              titulo="Inactivos"
              valor={metricas.inactivos}
              variante="secondary"
              icono="🚫"
              descripcion="ocultos de la tienda"
            />
            <MetricCard
              titulo="Destacados"
              valor={metricas.destacados}
              variante="warning"
              icono="⭐"
              descripcion="en sección Home"
            />
          </div>
        )}
      </section>

      {/* ── Accesos rápidos ── */}
      <section className="mb-5" aria-label="Accesos rápidos">
        <h2 className="h6 text-muted text-uppercase fw-semibold mb-3">
          Accesos rápidos
        </h2>

        <div className="row g-3">
          <AccesoRapido
            icono="📋"
            titulo="Ver productos"
            descripcion="Listado completo con filtros"
            variante="outline-primary"
            to="/admin/productos"
          />
          <AccesoRapido
            icono="➕"
            titulo="Nuevo producto"
            descripcion="Agregar al catálogo"
            variante="outline-success"
            to="/admin/productos/nuevo"
          />
          <AccesoRapido
            icono="🛍️"
            titulo="Ver tienda"
            descripcion="Como la ve un cliente"
            variante="outline-secondary"
            to="/productos"
          />
          <AccesoRapido
            icono="🚪"
            titulo="Cerrar sesión"
            descripcion="Salir del panel"
            variante="outline-danger"
            onClick={handleCerrarSesion}
          />
        </div>
      </section>

      {/* ── Sección placeholder: futuras features ── */}
      {/*
        TODO: Secciones planificadas para futuras versiones

        ── Pedidos recientes ──────────────────────────────────────────────────
        Cuando haya un OrdersContext, mostrar acá los últimos N pedidos
        con estado (pendiente, confirmado, enviado) y acceso rápido.

        ── Gestión de usuarios ────────────────────────────────────────────────
        Si se agregan roles (admin, empleado), mostrar usuarios activos
        y acceso a la gestión de permisos.

        ── Analytics básicos ─────────────────────────────────────────────────
        Productos más vistos, búsquedas frecuentes, horarios de tráfico.
        Se puede integrar con un servicio externo o Firebase Analytics.

        ── Alertas de stock ──────────────────────────────────────────────────
        Lista de productos con stock <= umbral configurable.
        Ya tenemos el campo `stock` en el modelo — solo falta la UI.
      */}

      {/* Vista previa: productos con stock bajo (disponible cuando el catálogo tenga datos de stock) */}
      {!cargando && (() => {
        const conStockBajo = productos.filter(
          p => p.activo !== false && p.stock !== null && p.stock !== undefined && p.stock <= 5
        );

        if (conStockBajo.length === 0) return null;

        return (
          <section aria-label="Alertas de stock">
            <h2 className="h6 text-muted text-uppercase fw-semibold mb-3">
              ⚠️ Stock bajo
            </h2>
            <div className="card border-warning">
              <div className="card-body p-0">
                <table className="table table-sm mb-0 align-middle">
                  <thead className="table-warning">
                    <tr>
                      <th className="ps-3">Producto</th>
                      <th>Stock actual</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {conStockBajo.map(p => (
                      <tr key={p.id}>
                        <td className="ps-3">{p.nombre}</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {p.stock === 0 ? 'Sin stock' : `${p.stock} unidades`}
                          </span>
                        </td>
                        <td className="pe-3 text-end">
                          <Link
                            to={`/admin/productos/${p.id}/editar`}
                            className="btn btn-sm btn-outline-warning"
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      })()}

    </div>
  );
}