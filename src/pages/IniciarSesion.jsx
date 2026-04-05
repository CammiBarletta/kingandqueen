import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useAppContext } from "../context/AppContext";

export default function IniciarSesion() {
  const { setIsAuthenticated, setUsuario } = useAppContext();
  const navigate = useNavigate();
  const ubicacion = useLocation(); //  capturamos desde dónde vino el usuario

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.password) {
      setError("Por favor completá todos los campos.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("El email no es válido.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsAuthenticated(true);
    setUsuario({ nombre: form.nombre, email: form.email });

    // ✅ Si vino de alguna página, lo devuelve ahí. Si no, va al inicio
    const destino = ubicacion.state?.desde || "/";
    navigate(destino);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="mb-4 text-center">Iniciar Sesión</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <button type="submit" className="btn w-100 mb-2" style={{ backgroundColor: "#4DB8C8", color: "white" }}>
          Ingresar
        </button>

        {/*  botón cancelar, vuelve a donde estaba */}
        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={() => navigate(ubicacion.state?.desde || "/")}
        >
          Cancelar
        </button>

      </form>
    </div>
  );
}