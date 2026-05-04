import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function IniciarSesion() {
  const { iniciarSesion } = useAuthContext();
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const desde = ubicacion.state?.desde || "/";

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpia el error del campo cuando empieza a escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) 
      nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.email.trim()) 
      nuevosErrores.email = "El email es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nuevosErrores.email = "El email no es válido.";
    if (!form.password) 
      nuevosErrores.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6)
      nuevosErrores.password = "Mínimo 6 caracteres.";
    return nuevosErrores;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const nuevosErrores = validar();

  if (Object.keys(nuevosErrores).length > 0) {
    setErrores(nuevosErrores);
    return;
  }

  setCargando(true);
  try {
    await iniciarSesion(form.nombre, form.email);
    navigate(desde, { replace: true });
  } catch (error) {
    setErrores({ general: "Hubo un error al iniciar sesión." });
  } finally {
    setCargando(false);
  }
};
  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 style={{ color: "#2C2C2C", fontWeight: "700" }}>Bienvenido </h2>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          Ingresá para continuar con tu compra
        </p>
      </div>

      {/* Error general */}
      {errores.general && (
        <div className="alert alert-danger py-2">{errores.general}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          {errores.nombre && (
            <div className="invalid-feedback">{errores.nombre}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errores.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          {errores.email && (
            <div className="invalid-feedback">{errores.email}</div>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errores.password ? "is-invalid" : ""}`}
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            autoComplete="current-password"
          />
          {errores.password && (
            <div className="invalid-feedback">{errores.password}</div>
          )}
        </div>

        {/* Botones */}
        <button
          type="submit"
          className="btn w-100 mb-2"
          style={{ backgroundColor: "#4DB8C8", color: "white", borderRadius: "8px" }}
          disabled={cargando}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary w-100"
         onClick={() => navigate(desde, { replace: true })}
          disabled={cargando}
        >
          Cancelar
        </button>

      </form>

      {/* Nota aclaratoria */}
      <p className="text-center text-muted mt-4" style={{ fontSize: "0.78rem" }}>
        Este es un sistema de autenticación de práctica.
        <br />No uses contraseñas reales.
      </p>

    </div>
  );
}