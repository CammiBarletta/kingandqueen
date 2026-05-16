import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function IniciarSesion() {
  const { iniciarSesion, registrar, loginConGoogle, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const desde = ubicacion.state?.desde || "/";

  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
   if (isAuthenticated) return <Navigate to={desde} replace />;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: "" }));
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setForm({ nombre: "", email: "", password: "" });
    setErrores({});
  };

  const validar = () => {
    const e = {};
    if (modo === "registro" && !form.nombre.trim())
      e.nombre = "El nombre es obligatorio.";
    if (!form.email.trim())
      e.email = "El email es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "El email no es válido.";
    if (!form.password)
      e.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6)
      e.password = "Mínimo 6 caracteres.";
    return e;
  };

  // Traduce los errores de Firebase a español
  const traducirError = (codigo) => {
    const erroresFirebase = {
      "auth/user-not-found":      "No existe una cuenta con ese email.",
      "auth/wrong-password":      "Contraseña incorrecta.",
      "auth/email-already-in-use":"Ese email ya está registrado.",
      "auth/too-many-requests":   "Demasiados intentos. Esperá unos minutos.",
      "auth/invalid-email":        "El formato del email no es válido.",
      "auth/network-request-failed": "Error de conexión. Revisá tu internet.",
      "auth/invalid-credential":  "Email o contraseña incorrectos.",
        "auth/weak-password":        "La contraseña es muy débil. Mínimo 6 caracteres.",
       "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar."
        
    };
    return erroresFirebase[codigo] || "Ocurrió un error. Intentá de nuevo.";
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
      if (modo === "login") {
        await iniciarSesion(form.email, form.password);
      } else {
        await registrar(form.nombre, form.email, form.password);
      }
      navigate(desde, { replace: true });
    } catch (error) {
      setErrores({ general: traducirError(error.code) });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-5 mb-5 pb-3" style={{ maxWidth: "420px" }}>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 style={{ color: "#2C2C2C", fontWeight: "700" }}>
          {modo === "login" ? "Bienvenido" : "Crear cuenta"}
        </h2>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          {modo === "login"
            ? "Ingresá para continuar con tu compra"
            : "Registrate para poder comprar"}
        </p>
      </div>

      {/* Toggle Login / Registro */}
      <div className="d-flex mb-4" style={{ borderBottom: "2px solid #eee" }}>
        {["login", "registro"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => cambiarModo(m)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              paddingBottom: "10px",
              fontWeight: modo === m ? "700" : "400",
              color: modo === m ? "#4DB8C8" : "#999",
              borderBottom: modo === m ? "2px solid #4DB8C8" : "none",
              marginBottom: "-2px",
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {m === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>
        ))}
      </div>

      {/* Error general */}
      {errores.general && (
        <div className="alert alert-danger py-2">{errores.general}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Nombre — solo en registro */}
        {modo === "registro" && (
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
        )}

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
            autoComplete={modo === "login" ? "current-password" : "new-password"}
          />
          {errores.password && (
            <div className="invalid-feedback">{errores.password}</div>
          )}
        </div>

        {/* Botón principal */}
        <button
          type="submit"
          className="btn w-100 mb-2"
          style={{
            backgroundColor: "#4DB8C8",
            color: "white",
            borderRadius: "8px",
            opacity: cargando ? 0.7 : 1,
          }}
          disabled={cargando}
        >
          {cargando
            ? "Procesando..."
            : modo === "login" ? "Ingresar" : "Crear cuenta"}
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

      <div className="text-center my-3 text-muted" style={{ fontSize: "0.85rem" }}>
        — o continuá con —
      </div>

      <button
        type="button"
        className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
        onClick={async () => {
          setCargando(true);
          try {
            await loginConGoogle();
            navigate(desde, { replace: true });
          } catch (error) {
  if (error.code !== "auth/popup-closed-by-user") {
    setErrores({ general: traducirError(error.code) });
  }
            } finally {
            setCargando(false);
          }
        }}
        disabled={cargando}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          width="20"
        />
        Continuar con Google
      </button>
    </div>
  );
}


  