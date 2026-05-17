"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Funcion = { fecha: string; horaInicio: string; horaFin: string };
type Zona = {
  nombre: string;
  tipo: "GA" | "Asiento asignado";
  precio: string;
  precioPromo: string;
  capacidad: string;
  filas: string;
};

const CATEGORIAS = [
  "Concierto",
  "Teatro",
  "Festival",
  "Comedia",
  "Otro",
] as const;

export default function Home() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Productor
  const [productorNombre, setProductorNombre] = useState("");
  const [productorEmail, setProductorEmail] = useState("");
  const [productorWhatsapp, setProductorWhatsapp] = useState("");

  // Venue
  const [venueNombre, setVenueNombre] = useState("");
  const [venueDireccion, setVenueDireccion] = useState("");
  const [venueCiudad, setVenueCiudad] = useState("");
  const [venueCapacidad, setVenueCapacidad] = useState("");
  const [venueMapa, setVenueMapa] = useState("");
  const [venueAsientosNumerados, setVenueAsientosNumerados] = useState(false);
  const [venueFilas, setVenueFilas] = useState("");
  const [venueSecciones, setVenueSecciones] = useState("");
  const [venueButacasPorFila, setVenueButacasPorFila] = useState("");

  // Evento
  const [eventoNombre, setEventoNombre] = useState("");
  const [eventoDescripcion, setEventoDescripcion] = useState("");
  const [eventoCategoria, setEventoCategoria] =
    useState<(typeof CATEGORIAS)[number]>("Concierto");
  const [eventoImagen, setEventoImagen] = useState("");
  const [eventoGaleria, setEventoGaleria] = useState("");

  // Fechas
  const [tipoFechas, setTipoFechas] = useState<
    "una" | "varias" | "multiday"
  >("una");
  const [funciones, setFunciones] = useState<Funcion[]>([
    { fecha: "", horaInicio: "", horaFin: "" },
  ]);

  // Zonas
  const [zonas, setZonas] = useState<Zona[]>([
    {
      nombre: "",
      tipo: "GA",
      precio: "",
      precioPromo: "",
      capacidad: "",
      filas: "",
    },
  ]);

  // Notas
  const [notas, setNotas] = useState("");

  const addFuncion = () =>
    setFunciones((f) => [...f, { fecha: "", horaInicio: "", horaFin: "" }]);
  const removeFuncion = (i: number) =>
    setFunciones((f) => f.filter((_, idx) => idx !== i));
  const updateFuncion = (i: number, patch: Partial<Funcion>) =>
    setFunciones((f) =>
      f.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );

  const addZona = () =>
    setZonas((z) => [
      ...z,
      {
        nombre: "",
        tipo: "GA",
        precio: "",
        precioPromo: "",
        capacidad: "",
        filas: "",
      },
    ]);
  const removeZona = (i: number) =>
    setZonas((z) => z.filter((_, idx) => idx !== i));
  const updateZona = (i: number, patch: Partial<Zona>) =>
    setZonas((z) => z.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      productor: {
        nombre: productorNombre,
        email: productorEmail,
        whatsapp: productorWhatsapp,
      },
      venue: {
        nombre: venueNombre,
        direccion: venueDireccion,
        ciudad: venueCiudad,
        capacidad: venueCapacidad,
        mapa: venueMapa,
        asientosNumerados: venueAsientosNumerados,
        filas: venueAsientosNumerados ? venueFilas : null,
        secciones: venueAsientosNumerados ? venueSecciones : null,
        butacasPorFila: venueAsientosNumerados ? venueButacasPorFila : null,
      },
      evento: {
        nombre: eventoNombre,
        descripcion: eventoDescripcion,
        categoria: eventoCategoria,
        imagen: eventoImagen,
        galeria: eventoGaleria,
      },
      fechas: { tipo: tipoFechas, funciones },
      zonas,
      notas,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit fallido");
      router.push("/gracias");
    } catch (err) {
      console.error(err);
      alert("Hubo un error. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100svh;
          padding: 48px 24px 120px;
        }

        .container {
          max-width: 760px;
          margin: 0 auto;
        }

        .brand {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 56px;
        }
        .brand-mark {
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.04em;
          color: var(--crimson);
        }
        .brand-divider { color: var(--ink-4); }
        .brand-label {
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-weight: 500;
        }

        .h1 {
          font-size: clamp(2rem, 4.4vw, 3rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          color: var(--ink);
        }

        .lead {
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0 0 56px;
        }

        .section {
          background: var(--bg-card);
          border: 1px solid var(--hairline);
          border-radius: 16px;
          padding: 36px;
          margin-bottom: 24px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }

        .section-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--hairline);
        }
        .section-num {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--crimson);
          font-variant-numeric: tabular-nums;
        }
        .section-title {
          font-size: 1.18rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 0;
        }

        .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .field-row { display: grid; gap: 16px; margin-bottom: 20px; }
        .field-row.cols-2 { grid-template-columns: 1fr 1fr; }
        .field-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

        @media (max-width: 640px) {
          .field-row.cols-2, .field-row.cols-3 { grid-template-columns: 1fr; }
        }

        .label {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink-2);
          letter-spacing: 0.005em;
        }
        .label-hint {
          font-weight: 400;
          color: var(--ink-3);
          font-size: 0.72rem;
          margin-left: 6px;
        }

        .input, .textarea, .select {
          width: 100%;
          background: var(--field-bg);
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 13px 16px;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--ink);
          transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .input:focus, .textarea:focus, .select:focus {
          background: #FFF;
          border-color: var(--crimson);
          box-shadow: 0 0 0 4px var(--field-focus);
        }
        .textarea { resize: vertical; min-height: 110px; line-height: 1.55; }

        .help {
          font-size: 0.72rem;
          color: var(--ink-3);
          margin-top: 2px;
        }

        .radio-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .radio-pill {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          background: var(--field-bg);
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.92rem;
          color: var(--ink-2);
          transition: all 0.15s ease;
          text-align: center;
          font-weight: 500;
        }
        .radio-pill.active {
          background: #FFF;
          border-color: var(--crimson);
          color: var(--crimson);
          box-shadow: 0 0 0 3px var(--field-focus);
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--field-bg);
          border-radius: 10px;
          cursor: pointer;
        }
        .checkbox-row input { width: 18px; height: 18px; accent-color: var(--crimson); cursor: pointer; }
        .checkbox-row label { cursor: pointer; font-size: 0.92rem; }

        .repeat-item {
          background: var(--field-bg);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 12px;
          position: relative;
        }
        .repeat-num {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--ink-3);
          margin-bottom: 14px;
        }
        .repeat-remove {
          position: absolute;
          top: 18px;
          right: 18px;
          background: transparent;
          border: none;
          color: var(--ink-3);
          font-size: 0.78rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .repeat-remove:hover { color: var(--crimson); background: rgba(179, 58, 53, 0.08); }

        .repeat-item .field-row { margin-bottom: 12px; }
        .repeat-item .field-row:last-child { margin-bottom: 0; }
        .repeat-item .input,
        .repeat-item .select { background: #FFF; }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px dashed var(--hairline-strong);
          border-radius: 10px;
          padding: 12px 20px;
          color: var(--ink-2);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 6px;
        }
        .btn-add:hover {
          border-color: var(--crimson);
          color: var(--crimson);
          background: var(--crimson-soft);
        }

        .submit-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 36px;
        }

        .btn-submit {
          width: 100%;
          background: var(--crimson);
          color: #FFF;
          border: none;
          border-radius: 999px;
          padding: 20px 32px;
          font-family: inherit;
          font-weight: 600;
          font-size: 1.02rem;
          letter-spacing: 0.005em;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 30px rgba(179, 58, 53, 0.25);
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--crimson-hover);
          transform: translateY(-1px);
          box-shadow: 0 14px 36px rgba(179, 58, 53, 0.35);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .submit-help {
          font-size: 0.78rem;
          color: var(--ink-3);
          text-align: center;
        }
      `}</style>

      <div className="container">
        <div className="brand">
          <span className="brand-mark">dulos</span>
          <span className="brand-divider">/</span>
          <span className="brand-label">Alta de evento</span>
        </div>

        <h1 className="h1">Registra tu evento</h1>
        <p className="lead">
          Llena los datos del evento que quieres dar de alta en Dulos. Nuestro
          equipo revisará la información y te contactará en menos de 24 horas
          para confirmar publicación, comisiones y fechas.
        </p>

        <form onSubmit={onSubmit}>
          {/* 01 — Productor */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">01</span>
              <h2 className="section-title">Datos del productor</h2>
            </div>

            <div className="field-row cols-2">
              <div className="field">
                <label className="label">Nombre completo o empresa</label>
                <input
                  className="input"
                  type="text"
                  required
                  value={productorNombre}
                  onChange={(e) => setProductorNombre(e.target.value)}
                  placeholder="Tu nombre o el de la productora"
                />
              </div>
              <div className="field">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  required
                  value={productorEmail}
                  onChange={(e) => setProductorEmail(e.target.value)}
                  placeholder="hola@productora.com"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">
                WhatsApp <span className="label-hint">con clave país</span>
              </label>
              <input
                className="input"
                type="tel"
                required
                value={productorWhatsapp}
                onChange={(e) => setProductorWhatsapp(e.target.value)}
                placeholder="+52 55 0000 0000"
              />
            </div>
          </section>

          {/* 02 — Venue */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">02</span>
              <h2 className="section-title">Venue</h2>
            </div>

            <div className="field">
              <label className="label">Nombre del venue</label>
              <input
                className="input"
                type="text"
                required
                value={venueNombre}
                onChange={(e) => setVenueNombre(e.target.value)}
                placeholder="Teatro, foro, sala, etc."
              />
            </div>

            <div className="field">
              <label className="label">Dirección completa</label>
              <input
                className="input"
                type="text"
                required
                value={venueDireccion}
                onChange={(e) => setVenueDireccion(e.target.value)}
                placeholder="Calle y número, colonia, CP"
              />
            </div>

            <div className="field-row cols-2">
              <div className="field">
                <label className="label">Ciudad / Estado</label>
                <input
                  className="input"
                  type="text"
                  required
                  value={venueCiudad}
                  onChange={(e) => setVenueCiudad(e.target.value)}
                  placeholder="Ciudad de México, CDMX"
                />
              </div>
              <div className="field">
                <label className="label">Capacidad total</label>
                <input
                  className="input tabular"
                  type="number"
                  required
                  min={1}
                  value={venueCapacidad}
                  onChange={(e) => setVenueCapacidad(e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">
                Mapa / plano del venue{" "}
                <span className="label-hint">link de Drive (silueta mínima)</span>
              </label>
              <input
                className="input"
                type="url"
                required
                value={venueMapa}
                onChange={(e) => setVenueMapa(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
              <p className="help">
                Sube el plano a Google Drive (o Dropbox) y pega el link público.
                Si no tienes plano formal, una silueta a mano sirve.
              </p>
            </div>

            <div className="checkbox-row">
              <input
                id="asientos"
                type="checkbox"
                checked={venueAsientosNumerados}
                onChange={(e) => setVenueAsientosNumerados(e.target.checked)}
              />
              <label htmlFor="asientos">
                El venue tiene <strong>asientos numerados</strong>
              </label>
            </div>

            {venueAsientosNumerados && (
              <div style={{ marginTop: 18 }}>
                <div className="field-row cols-3">
                  <div className="field">
                    <label className="label">Cantidad de filas</label>
                    <input
                      className="input tabular"
                      type="number"
                      min={1}
                      value={venueFilas}
                      onChange={(e) => setVenueFilas(e.target.value)}
                      placeholder="20"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Cantidad de secciones</label>
                    <input
                      className="input tabular"
                      type="number"
                      min={1}
                      value={venueSecciones}
                      onChange={(e) => setVenueSecciones(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Butacas por fila</label>
                    <input
                      className="input"
                      type="text"
                      value={venueButacasPorFila}
                      onChange={(e) => setVenueButacasPorFila(e.target.value)}
                      placeholder="25 (o variable: 20-30)"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 03 — Evento */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">03</span>
              <h2 className="section-title">Datos del evento</h2>
            </div>

            <div className="field">
              <label className="label">Nombre del evento</label>
              <input
                className="input"
                type="text"
                required
                value={eventoNombre}
                onChange={(e) => setEventoNombre(e.target.value)}
                placeholder="Nombre completo como debe aparecer publicado"
              />
            </div>

            <div className="field">
              <label className="label">Descripción</label>
              <textarea
                className="textarea"
                required
                value={eventoDescripcion}
                onChange={(e) => setEventoDescripcion(e.target.value)}
                placeholder="Cuéntale al público qué va a ver. 2-4 párrafos. Lo que dirías en pauta."
              />
            </div>

            <div className="field-row cols-2">
              <div className="field">
                <label className="label">Categoría</label>
                <select
                  className="select"
                  value={eventoCategoria}
                  onChange={(e) =>
                    setEventoCategoria(
                      e.target.value as (typeof CATEGORIAS)[number]
                    )
                  }
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">
                  Imagen principal{" "}
                  <span className="label-hint">link Drive</span>
                </label>
                <input
                  className="input"
                  type="url"
                  required
                  value={eventoImagen}
                  onChange={(e) => setEventoImagen(e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="field">
              <label className="label">
                Galería de fotos{" "}
                <span className="label-hint">opcional · link a carpeta Drive</span>
              </label>
              <input
                className="input"
                type="url"
                value={eventoGaleria}
                onChange={(e) => setEventoGaleria(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
              />
            </div>
          </section>

          {/* 04 — Fechas */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">04</span>
              <h2 className="section-title">Fechas y funciones</h2>
            </div>

            <div className="field">
              <label className="label">Tipo de calendario</label>
              <div className="radio-row">
                {[
                  { id: "una", label: "Una sola fecha" },
                  { id: "varias", label: "Varias funciones" },
                  { id: "multiday", label: "Multiday / festival" },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`radio-pill ${
                      tipoFechas === o.id ? "active" : ""
                    }`}
                    onClick={() => setTipoFechas(o.id as typeof tipoFechas)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {funciones.map((f, i) => (
              <div key={i} className="repeat-item">
                <div className="repeat-num">FUNCIÓN {String(i + 1).padStart(2, "0")}</div>
                {funciones.length > 1 && (
                  <button
                    type="button"
                    className="repeat-remove"
                    onClick={() => removeFuncion(i)}
                  >
                    Quitar
                  </button>
                )}
                <div className="field-row cols-3">
                  <div className="field">
                    <label className="label">Fecha</label>
                    <input
                      className="input tabular"
                      type="date"
                      required
                      value={f.fecha}
                      onChange={(e) =>
                        updateFuncion(i, { fecha: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="label">Hora inicio</label>
                    <input
                      className="input tabular"
                      type="time"
                      required
                      value={f.horaInicio}
                      onChange={(e) =>
                        updateFuncion(i, { horaInicio: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="label">Hora fin</label>
                    <input
                      className="input tabular"
                      type="time"
                      value={f.horaFin}
                      onChange={(e) =>
                        updateFuncion(i, { horaFin: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={addFuncion}>
              + Agregar función
            </button>
          </section>

          {/* 05 — Zonas y precios */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">05</span>
              <h2 className="section-title">Zonas y precios</h2>
            </div>

            {zonas.map((z, i) => (
              <div key={i} className="repeat-item">
                <div className="repeat-num">ZONA {String(i + 1).padStart(2, "0")}</div>
                {zonas.length > 1 && (
                  <button
                    type="button"
                    className="repeat-remove"
                    onClick={() => removeZona(i)}
                  >
                    Quitar
                  </button>
                )}

                <div className="field-row cols-2">
                  <div className="field">
                    <label className="label">Nombre de la zona</label>
                    <input
                      className="input"
                      type="text"
                      required
                      value={z.nombre}
                      onChange={(e) =>
                        updateZona(i, { nombre: e.target.value })
                      }
                      placeholder="Oro, Platino, VIP, etc."
                    />
                  </div>
                  <div className="field">
                    <label className="label">Tipo</label>
                    <select
                      className="select"
                      value={z.tipo}
                      onChange={(e) =>
                        updateZona(i, { tipo: e.target.value as Zona["tipo"] })
                      }
                    >
                      <option value="GA">General (GA)</option>
                      <option value="Asiento asignado">Asiento asignado</option>
                    </select>
                  </div>
                </div>

                <div className="field-row cols-3">
                  <div className="field">
                    <label className="label">Precio</label>
                    <input
                      className="input tabular"
                      type="number"
                      required
                      min={0}
                      value={z.precio}
                      onChange={(e) =>
                        updateZona(i, { precio: e.target.value })
                      }
                      placeholder="499"
                    />
                  </div>
                  <div className="field">
                    <label className="label">
                      Precio promo{" "}
                      <span className="label-hint">opcional</span>
                    </label>
                    <input
                      className="input tabular"
                      type="number"
                      min={0}
                      value={z.precioPromo}
                      onChange={(e) =>
                        updateZona(i, { precioPromo: e.target.value })
                      }
                      placeholder="399"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Capacidad de la zona</label>
                    <input
                      className="input tabular"
                      type="number"
                      required
                      min={1}
                      value={z.capacidad}
                      onChange={(e) =>
                        updateZona(i, { capacidad: e.target.value })
                      }
                      placeholder="100"
                    />
                  </div>
                </div>

                {z.tipo === "Asiento asignado" && (
                  <div className="field">
                    <label className="label">
                      Qué filas componen esta zona
                    </label>
                    <input
                      className="input"
                      type="text"
                      value={z.filas}
                      onChange={(e) =>
                        updateZona(i, { filas: e.target.value })
                      }
                      placeholder="A-E (centro), o filas 1-5"
                    />
                  </div>
                )}
              </div>
            ))}

            <button type="button" className="btn-add" onClick={addZona}>
              + Agregar zona
            </button>
          </section>

          {/* Notas */}
          <section className="section">
            <div className="section-head">
              <span className="section-num">06</span>
              <h2 className="section-title">Notas adicionales</h2>
            </div>
            <div className="field">
              <label className="label">
                ¿Algo más que el equipo de Dulos deba saber?{" "}
                <span className="label-hint">opcional</span>
              </label>
              <textarea
                className="textarea"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Política de reembolso, acuerdos previos, restricciones de edad, accesibilidad, etc."
              />
            </div>
          </section>

          <div className="submit-bar">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? "Enviando…" : "Enviar registro"}
            </button>
            <p className="submit-help">
              El equipo de Dulos revisará el registro y te contactará para
              confirmar publicación en menos de 24 h.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
