import { useRef, useState } from "react";

// ── Datos del local ───────────────────────────────────────────────────────────
const LOCAL = {
  nombre:       "King and Queen Pet Shop",
  direccion:    "Sánchez de Bustamante 1661, CABA",
  telefono:     "+54 9 11 2871-4704",
  telefonoHref: "tel:+5491128714704",
  email:        "kingandqueenpetshop@email.com",
  emailHref:    "mailto:kingandqueenpetshop@email.com",
  whatsapp:     "https://wa.me/5491128714704",
  instagram:    "https://instagram.com/kingandqueenpetshop",
  mapaSrc:      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.4876535421704!2d-58.4101234238398!3d-34.59182835711403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca846af7b6d5%3A0xb701b260e26daf3b!2sKing%20%26%20Queen%20Pet%20Shop!5e0!3m2!1ses-419!2sar!4v1778901561452!5m2!1ses-419!2sar",
  horarios: [
    { dia: "Lunes a viernes", hora: "08:00 – 20:00" },
    { dia: "Sábado",          hora: "08:00 – 18:00" },
    { dia: "Domingo",         hora: "Cerrado" },
  ],
};

const ASUNTOS = [
  "Consulta sobre productos",
  "Peluquería canina — reservar turno",
  "Disponibilidad de stock",
  "Envíos y entregas",
  "Otro",
];

// ── Iconos SVG ────────────────────────────────────────────────────────────────
const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function Contacto() {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", asunto: "", mensaje: "",
  });
  const [errores, setErrores]   = useState({});
  const [enviado, setEnviado]   = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre  = "El nombre es obligatorio.";
    if (!form.email.trim())    e.email   = "El email es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email no válido.";
    if (!form.asunto)          e.asunto  = "Seleccioná un asunto.";
    if (!form.mensaje.trim())  e.mensaje = "Escribí tu mensaje.";
    else if (form.mensaje.length < 10) e.mensaje = "Mínimo 10 caracteres.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200)); // reemplazá por EmailJS / Formspree
    setEnviando(false);
    setEnviado(true);
    setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
  };

  const scrollAlForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{`
        .cto { --verde:#1a3a2a; --teal:#4DB8C8; --crema:#faf9f6; --borde:#e4e2dc; --txt:#1c1c1a; --gris:#6b6b63; --err:#c0392b; font-family:system-ui,sans-serif; color:var(--txt); overflow-x:hidden; }

        /* HERO — sin margen, pegado al navbar */
        .cto-hero { position:relative; height:88vh; min-height:560px; overflow:hidden; margin-top:0; }

        /* Mapa interactivo — ocupa todo */
        .cto-hero__mapa { position:absolute; inset:0; width:100%; height:100%; border:none; display:block; }

        /* Degradado suave solo arriba — se disuelve gradualmente */
        .cto-hero__overlay {
          position:absolute; top:0; left:0; right:0; height:48%;
          background:linear-gradient(
            to bottom,
            rgba(26,58,42,0.78) 0%,
            rgba(26,58,42,0.38) 55%,
            transparent 100%
          );
          pointer-events:none;
          z-index:1;
        }

        /* Texto en la parte superior sobre el degradado */
        .cto-hero__body {
          position:absolute; top:0; left:0; right:0; z-index:2;
          display:flex; flex-direction:column; align-items:center; text-align:center;
          padding:36px 24px 32px;
          pointer-events:none;
        }
        .cto-hero__body * { pointer-events:auto; }

        .cto-hero__eye { font-size:11px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--teal); margin:0 0 8px; }
        .cto-hero__h1 { font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.9rem,3.5vw,3rem); font-weight:700; color:#fff; margin:0 0 8px; line-height:1.15; text-shadow:0 2px 12px rgba(0,0,0,.2); }
        .cto-hero__sub { font-size:clamp(.88rem,1.4vw,1rem); color:rgba(255,255,255,.82); line-height:1.6; margin:0 0 18px; text-shadow:0 1px 6px rgba(0,0,0,.15); }
        .cto-hero__btn { display:inline-flex; align-items:center; gap:8px; background:#fff; color:var(--verde); font-size:13px; font-weight:700; padding:10px 22px; border-radius:50px; border:none; cursor:pointer; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 20px rgba(0,0,0,.15); }
        .cto-hero__btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.22); }

        /* CUERPO */
        .cto-body { max-width:1200px; margin:0 auto; padding:80px 24px 100px; display:grid; grid-template-columns:1fr 1.35fr; gap:64px; align-items:start; }
        @media(max-width:860px){ .cto-body { grid-template-columns:1fr; gap:48px; padding:60px 20px 80px; } }

        /* INFO */
        .cto-eye { font-size:11px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--teal); margin:0 0 10px; }
        .cto-h2  { font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.6rem,2.5vw,2.2rem); font-weight:700; color:var(--txt); margin:0 0 8px; }
        .cto-div { width:44px; height:3px; background:var(--verde); border-radius:2px; margin-bottom:24px; }
        .cto-desc { font-size:15px; line-height:1.75; color:var(--gris); margin:0 0 32px; }

        .cto-list { list-style:none; margin:0 0 32px; padding:0; display:flex; flex-direction:column; gap:16px; }
        .cto-item { display:flex; align-items:flex-start; gap:13px; }
        .cto-item__icon { width:38px; height:38px; background:var(--crema); border:1px solid var(--borde); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--verde); flex-shrink:0; }
        .cto-item__text { display:flex; flex-direction:column; gap:2px; padding-top:3px; }
        .cto-item__label { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--gris); }
        .cto-item__value { font-size:14px; color:var(--txt); }
        .cto-item__value a { color:var(--txt); text-decoration:none; }
        .cto-item__value a:hover { color:var(--verde); text-decoration:underline; }

        .cto-hours { margin-bottom:32px; }
        .cto-hours__row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--borde); font-size:14px; }
        .cto-hours__row:last-child { border-bottom:none; }
        .cto-hours__closed { color:var(--gris); }

        .cto-redes { display:flex; gap:12px; }
        .cto-redes a { width:42px; height:42px; border-radius:50%; border:1.5px solid var(--borde); background:#fff; display:flex; align-items:center; justify-content:center; color:var(--verde); text-decoration:none; transition:background .2s,border-color .2s,color .2s; }
        .cto-redes a:hover { background:var(--verde); border-color:var(--verde); color:#fff; }
        .cto-redes a.wa:hover { background:#25D366; border-color:#25D366; }

        /* FORMULARIO */
        .cto-card { background:#fff; border:1px solid var(--borde); border-radius:20px; padding:48px 44px; box-shadow:0 8px 40px rgba(0,0,0,.06); }
        @media(max-width:500px){ .cto-card { padding:32px 22px; } }
        .cto-form__h2  { font-family:'Playfair Display',Georgia,serif; font-size:1.6rem; font-weight:700; color:var(--txt); margin:0 0 6px; }
        .cto-form__sub { font-size:14px; color:var(--gris); margin:0 0 32px; }

        .cto-field { display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
        .cto-field label { font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--gris); }
        .cto-opt { font-weight:400; text-transform:none; letter-spacing:0; color:#aaa; }
        .cto-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:500px){ .cto-row { grid-template-columns:1fr; } }

        .cto-input, .cto-select, .cto-textarea {
          width:100%; padding:12px 16px; font-size:14px; color:var(--txt);
          background:var(--crema); border:1.5px solid var(--borde); border-radius:10px;
          outline:none; transition:border-color .2s,box-shadow .2s;
          font-family:inherit; box-sizing:border-box; appearance:none;
        }
        .cto-input:focus, .cto-select:focus, .cto-textarea:focus {
          border-color:var(--verde); box-shadow:0 0 0 3px rgba(26,58,42,.08); background:#fff;
        }
        .cto-input.err, .cto-select.err, .cto-textarea.err { border-color:var(--err); }
        .cto-textarea { min-height:130px; resize:vertical; line-height:1.6; }
        .cto-select { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b63' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:38px; }
        .cto-errmsg { font-size:12px; color:var(--err); }

        .cto-submit { width:100%; padding:14px; background:var(--verde); color:#fff; font-size:15px; font-weight:700; border:none; border-radius:10px; cursor:pointer; transition:background .2s,transform .15s; margin-top:8px; }
        .cto-submit:hover:not(:disabled) { background:#2d6a4f; transform:translateY(-1px); }
        .cto-submit:disabled { opacity:.65; cursor:not-allowed; }

        /* ÉXITO */
        .cto-ok { text-align:center; padding:48px 24px; }
        .cto-ok__icon { width:64px; height:64px; background:#e8f5ee; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--verde); }
        .cto-ok__h3  { font-family:'Playfair Display',Georgia,serif; font-size:1.5rem; font-weight:700; margin:0 0 10px; }
        .cto-ok__p   { font-size:14px; color:var(--gris); line-height:1.7; margin:0 0 24px; }
        .cto-ok__btn { display:inline-flex; padding:11px 24px; background:var(--verde); color:#fff; border:none; border-radius:50px; font-size:14px; font-weight:600; cursor:pointer; transition:background .2s; }
        .cto-ok__btn:hover { background:#2d6a4f; }
      `}</style>

      <main className="cto" style={{ marginTop: 0, paddingTop: 0 }}>

        {/* ── 1. HERO CON MAPA ── */}
        <header className="cto-hero">
          <iframe
            className="cto-hero__mapa"
            src={LOCAL.mapaSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Ubicación de ${LOCAL.nombre} en Google Maps`}
          />
          <div className="cto-hero__overlay" aria-hidden="true" />
          <div className="cto-hero__body">
            <h1 className="cto-hero__h1">Visitanos</h1>
            <p className="cto-hero__sub">
              Estamos esperándote con todo lo que tu mascota necesita.<br />
              Alimentos, accesorios, juguetes y peluquería canina.
            </p>
            <button className="cto-hero__btn" onClick={scrollAlForm} aria-label="Ir al formulario de contacto">
              Escribinos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── 2. INFO + FORMULARIO ── */}
        <div className="cto-body">

          {/* Columna izquierda */}
          <article aria-label="Información de contacto">
            <p className="cto-eye">Dónde encontrarnos</p>
            <h2 className="cto-h2">{LOCAL.nombre}</h2>
            <div className="cto-div" aria-hidden="true" />
            <p className="cto-desc">
              Somos un pet shop donde cada mascota recibe la atención que merece.
              Vení a conocernos y encontrá todo lo que necesitás para el bienestar de tu compañero.
            </p>

            <ul className="cto-list">
              <li className="cto-item">
                <div className="cto-item__icon" aria-hidden="true"><IconPin /></div>
                <div className="cto-item__text">
                  <span className="cto-item__label">Dirección</span>
                  <span className="cto-item__value">{LOCAL.direccion}</span>
                </div>
              </li>
              <li className="cto-item">
                <div className="cto-item__icon" aria-hidden="true"><IconPhone /></div>
                <div className="cto-item__text">
                  <span className="cto-item__label">Teléfono</span>
                  <span className="cto-item__value">
                    <a href={LOCAL.telefonoHref}>{LOCAL.telefono}</a>
                  </span>
                </div>
              </li>
              <li className="cto-item">
                <div className="cto-item__icon" aria-hidden="true"><IconMail /></div>
                <div className="cto-item__text">
                  <span className="cto-item__label">Email</span>
                  <span className="cto-item__value">
                    <a href={LOCAL.emailHref}>{LOCAL.email}</a>
                  </span>
                </div>
              </li>
              <li className="cto-item">
                <div className="cto-item__icon" aria-hidden="true"><IconClock /></div>
                <div className="cto-item__text">
                  <span className="cto-item__label">Horarios</span>
                </div>
              </li>
            </ul>

            <div className="cto-hours" role="table" aria-label="Horarios de atención">
              {LOCAL.horarios.map(({ dia, hora }) => (
                <div key={dia} className="cto-hours__row" role="row">
                  <span role="cell">{dia}</span>
                  <span role="cell" className={hora === "Cerrado" ? "cto-hours__closed" : ""}>{hora}</span>
                </div>
              ))}
            </div>

            <nav aria-label="Redes sociales">
              <div className="cto-redes">
                <a href={LOCAL.whatsapp} target="_blank" rel="noopener noreferrer" className="wa" aria-label="WhatsApp">
                  <IconWhatsApp />
                </a>
                <a href={LOCAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <IconInstagram />
                </a>
              </div>
            </nav>
          </article>

          {/* Columna derecha — formulario */}
          <section ref={formRef} aria-labelledby="form-titulo">
            <div className="cto-card">
              {enviado ? (
                <div className="cto-ok" role="alert">
                  <div className="cto-ok__icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="cto-ok__h3">¡Mensaje enviado!</h3>
                  <p className="cto-ok__p">
                    Gracias por escribirnos. Te respondemos a la brevedad,<br />
                    generalmente dentro de las 24 horas.
                  </p>
                  <button className="cto-ok__btn" onClick={() => setEnviado(false)}>
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 id="form-titulo" className="cto-form__h2">Escribinos</h2>
                  <p className="cto-form__sub">Respondemos a la brevedad por email o WhatsApp.</p>

                  <div className="cto-row">
                    <div className="cto-field">
                      <label htmlFor="nombre">Nombre</label>
                      <input id="nombre" name="nombre" type="text"
                        className={`cto-input${errores.nombre ? " err" : ""}`}
                        placeholder="Tu nombre" value={form.nombre}
                        onChange={handleChange} autoComplete="name"
                        aria-invalid={!!errores.nombre}
                      />
                      {errores.nombre && <span className="cto-errmsg" role="alert">{errores.nombre}</span>}
                    </div>
                    <div className="cto-field">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email"
                        className={`cto-input${errores.email ? " err" : ""}`}
                        placeholder="tu@email.com" value={form.email}
                        onChange={handleChange} autoComplete="email"
                        aria-invalid={!!errores.email}
                      />
                      {errores.email && <span className="cto-errmsg" role="alert">{errores.email}</span>}
                    </div>
                  </div>

                  <div className="cto-field">
                    <label htmlFor="telefono">Teléfono <span className="cto-opt">(opcional)</span></label>
                    <input id="telefono" name="telefono" type="tel"
                      className="cto-input" placeholder="+54 9 11 XXXX-XXXX"
                      value={form.telefono} onChange={handleChange} autoComplete="tel"
                    />
                  </div>

                  <div className="cto-field">
                    <label htmlFor="asunto">Asunto</label>
                    <select id="asunto" name="asunto"
                      className={`cto-select${errores.asunto ? " err" : ""}`}
                      value={form.asunto} onChange={handleChange}
                      aria-invalid={!!errores.asunto}
                    >
                      <option value="">Seleccioná un asunto…</option>
                      {ASUNTOS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {errores.asunto && <span className="cto-errmsg" role="alert">{errores.asunto}</span>}
                  </div>

                  <div className="cto-field">
                    <label htmlFor="mensaje">Mensaje</label>
                    <textarea id="mensaje" name="mensaje"
                      className={`cto-textarea${errores.mensaje ? " err" : ""}`}
                      placeholder="Contanos en qué podemos ayudarte…"
                      value={form.mensaje} onChange={handleChange}
                      aria-invalid={!!errores.mensaje}
                    />
                    {errores.mensaje && <span className="cto-errmsg" role="alert">{errores.mensaje}</span>}
                  </div>

                  <button type="submit" className="cto-submit" disabled={enviando}>
                    {enviando ? "Enviando…" : "Enviar mensaje"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}