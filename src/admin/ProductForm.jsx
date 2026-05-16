// src/admin/pages/ProductForm.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProducts } from "../context/ProductsContext";
import { CATEGORIAS } from "../constants/categories";
// ─── Estado inicial vacío ──────────────────────────────────────────────────────
// Definido fuera del componente para que no se recree en cada render.
// Todos los campos del modelo de producto, con sus defaults de formulario.
// Nota: stock y precioAnterior son string vacío ('') en el form porque
// vienen de inputs de texto. Los convertimos a número (o null) al guardar.
const FORM_INICIAL = {
  nombre: '',
  precio: '',
  precioAnterior: '',
  categoria: '',
  descripcion: '',
  stock: '',
  avatar: '',
  activo: true,
  destacado: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = Boolean(id);

  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    validar,
  } = useProducts();

  // ─── Estado del formulario ───────────────────────────────────────────────────
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  // ─── Buscar el producto en el contexto (modo edición) ───────────────────────
  // useMemo: solo recalcula si cambia `productos` o `id`.
  // No hace fetch — el producto ya está en memoria desde el contexto.
  const productoExistente = useMemo(
    () => (esEdicion ? productos.find(p => p.id === id) : null),
    [productos, id, esEdicion]
  );

  // ─── Pre-cargar el formulario en modo edición ────────────────────────────────
  // useEffect se ejecuta cuando productoExistente cambia.
  // Si el contexto aún está cargando, productoExistente es undefined → esperamos.
  // Cuando los productos lleguen, el efecto vuelve a correr y pre-carga el form.
  useEffect(() => {
    if (!esEdicion) return;
    if (!productoExistente) return; // todavía cargando o no existe

    setForm({
      nombre:         productoExistente.nombre       ?? '',
      precio:         productoExistente.precio       ?? '',
      // Convertimos null a '' para que el input no muestre "null"
      precioAnterior: productoExistente.precioAnterior ?? '',
      categoria:      productoExistente.categoria    ?? '',
      descripcion:    productoExistente.descripcion  ?? '',
      stock:          productoExistente.stock        ?? '',
      avatar:         productoExistente.avatar       ?? '',
      activo:         productoExistente.activo       !== false, // default true
      destacado:      productoExistente.destacado    === true,  // default false
    });
  }, [productoExistente, esEdicion]);

  // ─── Redirigir a 404 si el producto no existe ────────────────────────────────
  // Solo lo hacemos DESPUÉS de que los productos terminaron de cargar.
  // Si lo hiciéramos antes, redirige siempre (los productos aún no llegaron).
  useEffect(() => {
    if (esEdicion && !cargando && !productoExistente) {
      navigate('/404', { replace: true });
    }
  }, [esEdicion, cargando, productoExistente, navigate]);

  // ─── Handler genérico para todos los inputs ──────────────────────────────────
  // Funciona con: text, number, textarea, select, checkbox.
  // Si el campo tenía un error y el usuario lo corrige, borramos el error
  // de ese campo inmediatamente — sin esperar a que vuelva a hacer submit.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construimos el objeto a validar y guardar.
    // Convertimos los campos opcionales: '' → null, string → número.
    const productoAGuardar = {
      ...form,
      precio:         Number(form.precio),
      // Si precioAnterior está vacío, guardamos null (sin descuento)
      precioAnterior: form.precioAnterior !== '' ? Number(form.precioAnterior) : null,
      // Si stock está vacío, guardamos null (sin control de stock)
      stock:          form.stock !== ''          ? Number(form.stock)          : null,
    };

    // Usamos la función validar() del contexto, que conoce todas las reglas.
    const { esValido, errores: erroresValidacion } = validar(productoAGuardar);

    if (!esValido) {
      setErrores(erroresValidacion);
      // Hacemos scroll al primer error para que el dueño lo vea sin buscar.
      const primerCampoConError = document.querySelector('.is-invalid');
      primerCampoConError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setGuardando(true);

    try {
      if (esEdicion) {
        // En edición, mandamos el id del producto existente.
        await editarProducto({ ...productoAGuardar, id });
        toast.success('Producto actualizado ✓');
      } else {
        await agregarProducto(productoAGuardar);
        toast.success('Producto creado ✓');
      }
      // Éxito → volvemos al listado.
      navigate('/admin/productos');
    } catch {
      toast.error('No se pudo guardar el producto. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────────────────────
  // Mientras los productos cargan en modo edición, mostramos un spinner.
  // En modo nuevo no hay nada que esperar.
  if (esEdicion && cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
      </div>
    );
  }
const handleImagenChange = async (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  // Validación básica
  if (archivo.size > 5 * 1024 * 1024) {
    toast.error('La imagen no puede superar 5MB');
    return;
  }

  setSubiendoImagen(true);

  try {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'productos'); // carpeta en Cloudinary

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();

    if (data.secure_url) {
      // Guardamos la URL en el campo avatar del form
      setForm(prev => ({ ...prev, avatar: data.secure_url }));
      toast.success('Imagen subida ✓');
    } else {
      throw new Error('No se recibió URL');
    }
  } catch {
    toast.error('Error al subir la imagen. Intentá de nuevo.');
  } finally {
    setSubiendoImagen(false);
  }
};
  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="container py-4" style={{ maxWidth: '680px' }}>

      {/* Encabezado — el título cambia según el modo */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-semibold mb-1">
            {esEdicion ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-muted small mb-0">
            {esEdicion
              ? `Editando: ${productoExistente?.nombre}`
              : 'Completá los datos del nuevo producto'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/admin/productos')}
        >
          ← Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Sección: Información principal ── */}
        <fieldset className="border rounded-3 p-3 mb-4">
          <legend className="float-none w-auto px-2 small text-muted fw-semibold">
            Información principal
          </legend>

          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label fw-medium">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Alimento Premium para Perros"
              maxLength={100}
            />
            {errores.nombre && (
              <div className="invalid-feedback">{errores.nombre}</div>
            )}
          </div>

          {/* Categoría */}
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label fw-medium">
              Categoría <span className="text-danger">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccioná una categoría</option>
              {CATEGORIAS.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errores.categoria && (
              <div className="invalid-feedback">{errores.categoria}</div>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-0">
            <label htmlFor="descripcion" className="form-label fw-medium">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Describí el producto (mínimo 10 caracteres)"
            />
            {/* Contador de caracteres — útil para el dueño */}
            <div className="d-flex justify-content-between">
              {errores.descripcion
                ? <div className="invalid-feedback d-block">{errores.descripcion}</div>
                : <span />
              }
              <small className="text-muted mt-1">
                {form.descripcion.length} caracteres
              </small>
            </div>
          </div>
        </fieldset>

        {/* ── Sección: Precios ── */}
        <fieldset className="border rounded-3 p-3 mb-4">
          <legend className="float-none w-auto px-2 small text-muted fw-semibold">
            Precios
          </legend>

          <div className="row g-3">
            {/* Precio actual */}
            <div className="col-6">
              <label htmlFor="precio" className="form-label fw-medium">
                Precio actual <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="4500"
                />
                {errores.precio && (
                  <div className="invalid-feedback">{errores.precio}</div>
                )}
              </div>
            </div>

            {/* Precio anterior (opcional — para mostrar descuentos) */}
            <div className="col-6">
              <label htmlFor="precioAnterior" className="form-label fw-medium">
                Precio anterior
                <span className="text-muted fw-normal ms-1 small">(opcional)</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="precioAnterior"
                  name="precioAnterior"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-control ${errores.precioAnterior ? 'is-invalid' : ''}`}
                  value={form.precioAnterior}
                  onChange={handleChange}
                  placeholder="5500"
                />
                {errores.precioAnterior && (
                  <div className="invalid-feedback">{errores.precioAnterior}</div>
                )}
              </div>
              <div className="form-text">
                Si tiene valor, se muestra el precio tachado en la tienda.
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── Sección: Inventario ── */}
        <fieldset className="border rounded-3 p-3 mb-4">
          <legend className="float-none w-auto px-2 small text-muted fw-semibold">
            Inventario
          </legend>

          <label htmlFor="stock" className="form-label fw-medium">
            Stock
            <span className="text-muted fw-normal ms-1 small">(opcional)</span>
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className={`form-control ${errores.stock ? 'is-invalid' : ''}`}
            value={form.stock}
            onChange={handleChange}
            placeholder="Ej: 20"
          />
          {errores.stock
            ? <div className="invalid-feedback">{errores.stock}</div>
            : <div className="form-text">
                Dejalo vacío si no querés controlar el stock de este producto.
              </div>
          }
        </fieldset>
{/* ── Sección: Imagen ── */}
<fieldset className="border rounded-3 p-3 mb-4">
  <legend className="float-none w-auto px-2 small text-muted fw-semibold">
    Imagen
  </legend>

  {/* Selector de archivo */}
  <label htmlFor="imagenArchivo" className="form-label fw-medium">
    Subir imagen
    <span className="text-muted fw-normal ms-1 small">(jpg, png, webp)</span>
  </label>
  <input
    id="imagenArchivo"
    type="file"
    accept="image/*"
    className="form-control mb-2"
    onChange={handleImagenChange}
    disabled={subiendoImagen}
  />

  {/* Barra de progreso mientras sube */}
  {subiendoImagen && (
    <div className="d-flex align-items-center gap-2 mb-2">
      <div className="spinner-border spinner-border-sm text-primary" />
      <small className="text-muted">Subiendo imagen a Cloudinary...</small>
    </div>
  )}

  {/* O pegar URL manual como fallback */}
  <div className="mt-3">
    <label htmlFor="avatar" className="form-label fw-medium small text-muted">
      O pegá una URL directamente
    </label>
    <input
      id="avatar"
      name="avatar"
      type="url"
      className="form-control form-control-sm"
      value={form.avatar}
      onChange={handleChange}
      placeholder="https://..."
      disabled={subiendoImagen}
    />
  </div>

  {/* Preview — aparece con cualquiera de los dos métodos */}
  {form.avatar && (
    <div className="mt-3 d-flex align-items-center gap-3">
      <img
        src={form.avatar}
        alt="Preview del producto"
        style={{
          height: '100px',
          width: '100px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
        onError={e => { e.target.style.display = 'none'; }}
        onLoad={e  => { e.target.style.display = 'block'; }}
      />
      <div>
        <small className="text-success fw-semibold d-block">✓ Imagen cargada</small>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger mt-1"
          onClick={() => setForm(prev => ({ ...prev, avatar: '' }))}
        >
          Quitar imagen
        </button>
      </div>
    </div>
  )}
</fieldset>
       
    
        {/* ── Sección: Visibilidad ── */}
        <fieldset className="border rounded-3 p-3 mb-4">
          <legend className="float-none w-auto px-2 small text-muted fw-semibold">
            Visibilidad
          </legend>

          {/* Checkboxes — usan checked, no value */}
          <div className="form-check mb-2">
            <input
              id="activo"
              name="activo"
              type="checkbox"
              className="form-check-input"
              checked={form.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo" className="form-check-label">
              Producto activo
              <span className="text-muted fw-normal ms-1 small">
                — visible en la tienda
              </span>
            </label>
          </div>

          <div className="form-check">
            <input
              id="destacado"
              name="destacado"
              type="checkbox"
              className="form-check-input"
              checked={form.destacado}
              onChange={handleChange}
            />
            <label htmlFor="destacado" className="form-check-label">
              Producto destacado
              <span className="text-muted fw-normal ms-1 small">
                — aparece en la sección destacados del Home
              </span>
            </label>
          </div>
        </fieldset>

        {/* ── Botones de acción ── */}
        <div className="d-flex gap-2 justify-content-end pt-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/admin/productos')}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={guardando}
          >
            {guardando
              ? (<>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Guardando...
                </>)
              : esEdicion ? 'Guardar cambios' : 'Crear producto'
            }
          </button>
        </div>

      </form>
    </div>
  );
}