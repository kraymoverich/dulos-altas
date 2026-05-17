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
type Bloqueo = { descripcion: string; cantidad: string };
type Codigo = {
  codigo: string;
  tipo: "porcentaje" | "monto";
  valor: string;
  vigencia: string;
};

const CATEGORIAS = [
  "Teatro",
  "Música",
  "Comedia",
  "Danza",
  "Festival",
  "Otro",
] as const;

const METODOS_PAGO_DEFAULT = ["OXXO", "VISA", "Mastercard", "AMEX", "PayPal"];

const TOC = [
  { id: "productor", label: "Productor", num: "01" },
  { id: "venue", label: "Venue", num: "02" },
  { id: "evento", label: "Evento", num: "03" },
  { id: "fechas", label: "Fechas", num: "04" },
  { id: "zonas", label: "Zonas y precios", num: "05" },
  { id: "logistica", label: "Logística", num: "06" },
  { id: "promocion", label: "Promoción", num: "07" },
  { id: "payout", label: "Payout", num: "08" },
  { id: "notas", label: "Notas", num: "09" },
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
    useState<(typeof CATEGORIAS)[number]>("Música");
  const [eventoSubgenero, setEventoSubgenero] = useState("");
  const [eventoDuracion, setEventoDuracion] = useState("");
  const [eventoIdioma, setEventoIdioma] = useState<
    "Español" | "Inglés" | "Sin diálogo" | "Otro"
  >("Español");
  const [eventoAperturaPuertas, setEventoAperturaPuertas] = useState("30");
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

  // Bloqueos (asientos no a la venta)
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);

  // Logística
  const [edadMinima, setEdadMinima] = useState<
    "Todas las edades" | "12+" | "15+" | "18+"
  >("Todas las edades");
  const [accesibilidad, setAccesibilidad] = useState<string[]>([]);
  const [restricciones, setRestricciones] = useState("");
  const [politicaCancelacion, setPoliticaCancelacion] = useState("");
  const [metodosPago, setMetodosPago] =
    useState<string[]>(METODOS_PAGO_DEFAULT);
  const [factura, setFactura] = useState<
    "Sí, productor" | "Sí, venue" | "No"
  >("No");

  // Promoción
  const [redInstagram, setRedInstagram] = useState("");
  const [redFacebook, setRedFacebook] = useState("");
  const [redWeb, setRedWeb] = useState("");
  const [codigos, setCodigos] = useState<Codigo[]>([]);

  // Payout (datos bancarios)
  const [payoutTitular, setPayoutTitular] = useState("");
  const [payoutBanco, setPayoutBanco] = useState("");
  const [payoutClabe, setPayoutClabe] = useState("");
  const [payoutCuenta, setPayoutCuenta] = useState("");
  const [payoutRfc, setPayoutRfc] = useState("");

  // Notas
  const [notas, setNotas] = useState("");

  // Helpers
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

  const addBloqueo = () =>
    setBloqueos((b) => [...b, { descripcion: "", cantidad: "" }]);
  const removeBloqueo = (i: number) =>
    setBloqueos((b) => b.filter((_, idx) => idx !== i));
  const updateBloqueo = (i: number, patch: Partial<Bloqueo>) =>
    setBloqueos((b) =>
      b.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );

  const addCodigo = () =>
    setCodigos((c) => [
      ...c,
      { codigo: "", tipo: "porcentaje", valor: "", vigencia: "" },
    ]);
  const removeCodigo = (i: number) =>
    setCodigos((c) => c.filter((_, idx) => idx !== i));
  const updateCodigo = (i: number, patch: Partial<Codigo>) =>
    setCodigos((c) =>
      c.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );

  const toggleAccesibilidad = (val: string) =>
    setAccesibilidad((arr) =>
      arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
    );
  const togglePago = (val: string) =>
    setMetodosPago((arr) =>
      arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
    );

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
        subgenero: eventoSubgenero,
        duracion: eventoDuracion,
        idioma: eventoIdioma,
        aperturaPuertas: eventoAperturaPuertas,
        imagen: eventoImagen,
        galeria: eventoGaleria,
      },
      fechas: { tipo: tipoFechas, funciones },
      zonas,
      bloqueos,
      logistica: {
        edadMinima,
        accesibilidad,
        restricciones,
        politicaCancelacion,
        metodosPago,
        factura,
      },
      promocion: {
        redes: {
          instagram: redInstagram,
          facebook: redFacebook,
          web: redWeb,
        },
        codigos,
      },
      payout: {
        titular: payoutTitular,
        banco: payoutBanco,
        clabe: payoutClabe,
        cuenta: payoutCuenta,
        rfc: payoutRfc,
      },
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
          padding: 56px 24px 140px;
        }

        .layout {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 64px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 1024px) {
          .layout { grid-template-columns: 220px 1fr; }
        }

        /* TOC lateral */
        .toc {
          display: none;
        }

        @media (min-width: 1024px) {
          .toc {
            display: block;
            position: sticky;
            top: 56px;
            align-self: start;
            padding-top: 72px;
          }
          .toc-label {
            font-size: 0.66rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: var(--ink-3);
            font-weight: 500;
            margin-bottom: 18px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--hairline);
          }
          .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .toc-item a {
            display: flex;
            align-items: baseline;
            gap: 12px;
            padding: 9px 0;
            color: var(--ink-3);
            text-decoration: none;
            font-size: 0.86rem;
            font-weight: 500;
            transition: color 0.15s ease;
            border-left: 2px solid transparent;
            padding-left: 14px;
            margin-left: -16px;
          }
          .toc-item a:hover {
            color: var(--crimson);
            border-left-color: var(--crimson);
          }
          .toc-item-num {
            font-size: 0.66rem;
            letter-spacing: 0.18em;
            color: var(--ink-4);
            font-variant-numeric: tabular-nums;
          }
        }

        .container {
          max-width: 760px;
        }

        .brand {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 64px;
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
          font-size: clamp(2.1rem, 4.4vw, 3rem);
          font-weight: 600;
          line-height: 1.04;
          letter-spacing: -0.025em;
          margin: 0 0 18px;
          color: var(--ink);
        }

        .lead {
          font-size: 1.04rem;
          line-height: 1.62;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0 0 64px;
          font-weight: 400;
        }

        .section {
          background: var(--bg-card);
          border: 1px solid var(--hairline);
          border-radius: 18px;
          padding: 40px;
          margin-bottom: 28px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
          scroll-margin-top: 32px;
        }

        @media (max-width: 640px) {
          .section { padding: 28px 22px; border-radius: 14px; }
        }

        .section-head {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--hairline);
        }
        .section-num {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--crimson);
          font-variant-numeric: tabular-nums;
        }
        .section-title {
          font-size: 1.22rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 0;
        }
        .section-subtitle {
          font-size: 0.86rem;
          color: var(--ink-3);
          margin: 8px 0 0;
          line-height: 1.5;
          max-width: 52ch;
        }

        .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
        .field-row { display: grid; gap: 18px; margin-bottom: 22px; }
        .field-row.cols-2 { grid-template-columns: 1fr 1fr; }
        .field-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .field-row.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

        @media (max-width: 640px) {
          .field-row.cols-2, .field-row.cols-3, .field-row.cols-4 {
            grid-template-columns: 1fr;
          }
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
          transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          outline: none;
        }
        .input:hover, .textarea:hover, .select:hover {
          background: #EFEFEF;
        }
        .input:focus, .textarea:focus, .select:focus {
          background: #FFF;
          border-color: var(--crimson);
          box-shadow: 0 0 0 4px var(--field-focus);
        }
        .textarea { resize: vertical; min-height: 120px; line-height: 1.55; }

        .help {
          font-size: 0.72rem;
          color: var(--ink-3);
          margin-top: 2px;
          line-height: 1.5;
        }

        .radio-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .radio-pill {
          flex: 1;
          min-width: 110px;
          padding: 12px 16px;
          background: var(--field-bg);
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--ink-2);
          transition: all 0.18s ease;
          text-align: center;
          font-weight: 500;
        }
        .radio-pill:hover { background: #EFEFEF; }
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
          transition: background 0.18s ease;
        }
        .checkbox-row:hover { background: #EFEFEF; }
        .checkbox-row input { width: 18px; height: 18px; accent-color: var(--crimson); cursor: pointer; }
        .checkbox-row label { cursor: pointer; font-size: 0.92rem; flex: 1; }

        .check-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 8px;
        }

        .repeat-item {
          background: var(--field-bg);
          border-radius: 12px;
          padding: 22px;
          margin-bottom: 12px;
          position: relative;
          animation: slide-in 0.32s cubic-bezier(.2,.7,.2,1) both;
        }
        .repeat-num {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--ink-3);
          margin-bottom: 16px;
          font-variant-numeric: tabular-nums;
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
          padding: 6px 10px;
          border-radius: 6px;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .repeat-remove:hover { color: var(--crimson); background: rgba(179, 58, 53, 0.08); }

        .repeat-item .field-row { margin-bottom: 12px; }
        .repeat-item .field-row:last-child { margin-bottom: 0; }
        .repeat-item .field:last-child { margin-bottom: 0; }
        .repeat-item .input,
        .repeat-item .select,
        .repeat-item .textarea { background: #FFF; }
        .repeat-item .input:hover,
        .repeat-item .select:hover,
        .repeat-item .textarea:hover { background: #FAFAFA; }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px dashed var(--hairline-strong);
          border-radius: 10px;
          padding: 13px 22px;
          color: var(--ink-2);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          margin-top: 8px;
        }
        .btn-add:hover {
          border-color: var(--crimson);
          color: var(--crimson);
          background: var(--crimson-soft);
          border-style: solid;
        }

        .empty-state {
          padding: 18px 22px;
          background: var(--field-bg);
          border-radius: 10px;
          font-size: 0.85rem;
          color: var(--ink-3);
          line-height: 1.55;
          margin-bottom: 10px;
        }
        .empty-state strong { color: var(--ink-2); font-weight: 500; }

        .submit-bar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 44px;
        }

        .btn-submit {
          width: 100%;
          background: var(--crimson);
          color: #FFF;
          border: none;
          border-radius: 999px;
          padding: 22px 32px;
          font-family: inherit;
          font-weight: 600;
          font-size: 1.04rem;
          letter-spacing: 0.005em;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 12px 32px rgba(179, 58, 53, 0.25);
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--crimson-hover);
          transform: translateY(-1px);
          box-shadow: 0 16px 40px rgba(179, 58, 53, 0.35);
        }
        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 8px 24px rgba(179, 58, 53, 0.30);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .submit-help {
          font-size: 0.78rem;
          color: var(--ink-3);
          text-align: center;
          line-height: 1.5;
        }
      `}</style>

      <div className="layout">
        {/* TOC sticky lateral (desktop only) */}
        <aside className="toc">
          <div className="toc-label">Secciones</div>
          <ul className="toc-list">
            {TOC.map((t) => (
              <li key={t.id} className="toc-item">
                <a href={`#${t.id}`}>
                  <span className="toc-item-num">{t.num}</span>
                  <span>{t.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="container">
          <div className="brand">
            <span className="brand-mark">dulos</span>
            <span className="brand-divider">/</span>
            <span className="brand-label">Alta de evento</span>
          </div>

          <h1 className="h1">Registra tu evento</h1>
          <p className="lead">
            Llena los datos del evento que quieres dar de alta en Dulos. Nuestro
            equipo revisa la información y te contacta en menos de 24 horas para
            confirmar publicación, comisiones y fechas.
          </p>

          <form onSubmit={onSubmit}>
            {/* 01 — Productor */}
            <section id="productor" className="section">
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
            <section id="venue" className="section">
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
                  placeholder="Teatro, foro, sala, carpa, etc."
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
                  Sube el plano a Drive o Dropbox y pega el link público.
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
                        onChange={(e) =>
                          setVenueButacasPorFila(e.target.value)
                        }
                        placeholder="25 (o variable 20-30)"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 03 — Evento */}
            <section id="evento" className="section">
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
                  placeholder="Nombre tal como debe aparecer publicado"
                />
              </div>

              <div className="field">
                <label className="label">Descripción</label>
                <textarea
                  className="textarea"
                  required
                  value={eventoDescripcion}
                  onChange={(e) => setEventoDescripcion(e.target.value)}
                  placeholder="Qué va a ver el público — 2-4 párrafos editoriales. Sin marketing genérico."
                />
              </div>

              <div className="field-row cols-2">
                <div className="field">
                  <label className="label">Categoría principal</label>
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
                    Subgénero / etiqueta{" "}
                    <span className="label-hint">opcional</span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    value={eventoSubgenero}
                    onChange={(e) => setEventoSubgenero(e.target.value)}
                    placeholder="Música barroca · Standup · Drama"
                  />
                </div>
              </div>

              <div className="field-row cols-3">
                <div className="field">
                  <label className="label">
                    Duración <span className="label-hint">min</span>
                  </label>
                  <input
                    className="input tabular"
                    type="number"
                    min={1}
                    required
                    value={eventoDuracion}
                    onChange={(e) => setEventoDuracion(e.target.value)}
                    placeholder="90"
                  />
                </div>
                <div className="field">
                  <label className="label">Idioma</label>
                  <select
                    className="select"
                    value={eventoIdioma}
                    onChange={(e) =>
                      setEventoIdioma(e.target.value as typeof eventoIdioma)
                    }
                  >
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Sin diálogo">Sin diálogo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">
                    Apertura de puertas{" "}
                    <span className="label-hint">min antes</span>
                  </label>
                  <input
                    className="input tabular"
                    type="number"
                    min={0}
                    value={eventoAperturaPuertas}
                    onChange={(e) =>
                      setEventoAperturaPuertas(e.target.value)
                    }
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="field-row cols-2">
                <div className="field">
                  <label className="label">
                    Imagen principal{" "}
                    <span className="label-hint">link Drive · vertical 4:5 ideal</span>
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
                <div className="field">
                  <label className="label">
                    Galería de fotos{" "}
                    <span className="label-hint">opcional · carpeta Drive</span>
                  </label>
                  <input
                    className="input"
                    type="url"
                    value={eventoGaleria}
                    onChange={(e) => setEventoGaleria(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>
              </div>
            </section>

            {/* 04 — Fechas */}
            <section id="fechas" className="section">
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
                  <div className="repeat-num">
                    FUNCIÓN {String(i + 1).padStart(2, "0")}
                  </div>
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
                      <label className="label">
                        Hora fin <span className="label-hint">opcional</span>
                      </label>
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

            {/* 05 — Zonas, precios y bloqueos */}
            <section id="zonas" className="section">
              <div className="section-head">
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="section-num">05</span>
                    <h2 className="section-title">Zonas y precios</h2>
                  </div>
                  <p className="section-subtitle">
                    Define una zona por cada categoría de boleto. Si reservas
                    asientos para cortesías, prensa o productor, declóralos
                    abajo en "Asientos bloqueados".
                  </p>
                </div>
              </div>

              {zonas.map((z, i) => (
                <div key={i} className="repeat-item">
                  <div className="repeat-num">
                    ZONA {String(i + 1).padStart(2, "0")}
                  </div>
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
                        placeholder="Oro · Platino · VIP · Diamante"
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
                        <option value="Asiento asignado">
                          Asiento asignado
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="field-row cols-3">
                    <div className="field">
                      <label className="label">
                        Precio <span className="label-hint">MXN</span>
                      </label>
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
                      <label className="label">Capacidad</label>
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
                    <div className="field" style={{ marginBottom: 0 }}>
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
                        placeholder="A-E centro · filas 1-5 · butacas 12-20"
                      />
                    </div>
                  )}
                </div>
              ))}

              <button type="button" className="btn-add" onClick={addZona}>
                + Agregar zona
              </button>

              {/* Sub-feature: asientos bloqueados */}
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 28,
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <div style={{ marginBottom: 18 }}>
                  <h3
                    style={{
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--ink-2)",
                      margin: 0,
                    }}
                  >
                    Asientos bloqueados
                  </h3>
                  <p
                    style={{
                      fontSize: "0.86rem",
                      color: "var(--ink-3)",
                      marginTop: 6,
                      lineHeight: 1.55,
                      maxWidth: "52ch",
                    }}
                  >
                    Asientos que <strong>no se ofrecen al público</strong>:
                    cortesías, prensa, invitados del productor, equipo técnico.
                  </p>
                </div>

                {bloqueos.length === 0 && (
                  <div className="empty-state">
                    Si no necesitas reservar asientos, deja esto vacío.{" "}
                    <strong>+ Agregar bloqueo</strong> para declarar uno.
                  </div>
                )}

                {bloqueos.map((b, i) => (
                  <div key={i} className="repeat-item">
                    <div className="repeat-num">
                      BLOQUEO {String(i + 1).padStart(2, "0")}
                    </div>
                    <button
                      type="button"
                      className="repeat-remove"
                      onClick={() => removeBloqueo(i)}
                    >
                      Quitar
                    </button>
                    <div className="field-row cols-2">
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">Descripción / asientos</label>
                        <input
                          className="input"
                          type="text"
                          value={b.descripcion}
                          onChange={(e) =>
                            updateBloqueo(i, { descripcion: e.target.value })
                          }
                          placeholder="Fila A 1-6 · cortesías productor"
                        />
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">Cantidad de asientos</label>
                        <input
                          className="input tabular"
                          type="number"
                          min={1}
                          value={b.cantidad}
                          onChange={(e) =>
                            updateBloqueo(i, { cantidad: e.target.value })
                          }
                          placeholder="6"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="btn-add" onClick={addBloqueo}>
                  + Agregar bloqueo
                </button>
              </div>
            </section>

            {/* 06 — Logística */}
            <section id="logistica" className="section">
              <div className="section-head">
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="section-num">06</span>
                    <h2 className="section-title">Logística y políticas</h2>
                  </div>
                  <p className="section-subtitle">
                    Lo que el público necesita saber antes de comprar. Las
                    políticas por default de Dulos aplican si dejas el campo
                    vacío.
                  </p>
                </div>
              </div>

              <div className="field">
                <label className="label">Edad mínima</label>
                <div className="radio-row">
                  {(
                    ["Todas las edades", "12+", "15+", "18+"] as const
                  ).map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={`radio-pill ${
                        edadMinima === o ? "active" : ""
                      }`}
                      onClick={() => setEdadMinima(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label">
                  Accesibilidad <span className="label-hint">marca todas las que apliquen</span>
                </label>
                <div className="check-grid">
                  {[
                    "Acceso silla de ruedas",
                    "Acompañante sin costo",
                    "Apto baja audición",
                    "Apto baja visión",
                  ].map((opt) => (
                    <label key={opt} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={accesibilidad.includes(opt)}
                        onChange={() => toggleAccesibilidad(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label">
                  Restricciones del recinto{" "}
                  <span className="label-hint">opcional</span>
                </label>
                <textarea
                  className="textarea"
                  value={restricciones}
                  onChange={(e) => setRestricciones(e.target.value)}
                  placeholder="Sin cámaras profesionales · Sin alimentos del exterior · No se permite reingreso · Etc."
                  style={{ minHeight: 90 }}
                />
              </div>

              <div className="field">
                <label className="label">
                  Política de cancelación específica{" "}
                  <span className="label-hint">opcional · sobreescribe default</span>
                </label>
                <textarea
                  className="textarea"
                  value={politicaCancelacion}
                  onChange={(e) => setPoliticaCancelacion(e.target.value)}
                  placeholder="Default Dulos: sin preguntas hasta 48h antes. Reembolso completo 72h a tarjeta original. Déjalo vacío si aplica el default."
                  style={{ minHeight: 90 }}
                />
              </div>

              <div className="field">
                <label className="label">
                  Métodos de pago a habilitar
                </label>
                <div className="check-grid">
                  {METODOS_PAGO_DEFAULT.map((m) => (
                    <label key={m} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={metodosPago.includes(m)}
                        onChange={() => togglePago(m)}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
                <p className="help">
                  Todos habilitados por default. Desmarca si no quieres alguno
                  (raro).
                </p>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">¿Se emite factura?</label>
                <div className="radio-row">
                  {(
                    ["Sí, productor", "Sí, venue", "No"] as const
                  ).map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={`radio-pill ${
                        factura === o ? "active" : ""
                      }`}
                      onClick={() => setFactura(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 07 — Promoción */}
            <section id="promocion" className="section">
              <div className="section-head">
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="section-num">07</span>
                    <h2 className="section-title">Promoción</h2>
                  </div>
                  <p className="section-subtitle">
                    Redes del productor y códigos de descuento para campañas.
                    Todo es opcional.
                  </p>
                </div>
              </div>

              <div className="field-row cols-3">
                <div className="field">
                  <label className="label">
                    Instagram <span className="label-hint">@usuario o URL</span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    value={redInstagram}
                    onChange={(e) => setRedInstagram(e.target.value)}
                    placeholder="@productora"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Facebook <span className="label-hint">URL</span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    value={redFacebook}
                    onChange={(e) => setRedFacebook(e.target.value)}
                    placeholder="facebook.com/productora"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Sitio web <span className="label-hint">URL</span>
                  </label>
                  <input
                    className="input"
                    type="url"
                    value={redWeb}
                    onChange={(e) => setRedWeb(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--ink-2)",
                      margin: 0,
                    }}
                  >
                    Códigos de descuento
                  </h3>
                  <p
                    style={{
                      fontSize: "0.86rem",
                      color: "var(--ink-3)",
                      marginTop: 6,
                      lineHeight: 1.55,
                    }}
                  >
                    Códigos que quieres habilitar para campañas, prensa o
                    influencers.
                  </p>
                </div>

                {codigos.length === 0 && (
                  <div className="empty-state">
                    Sin códigos por ahora.{" "}
                    <strong>+ Agregar código</strong> si necesitas.
                  </div>
                )}

                {codigos.map((c, i) => (
                  <div key={i} className="repeat-item">
                    <div className="repeat-num">
                      CÓDIGO {String(i + 1).padStart(2, "0")}
                    </div>
                    <button
                      type="button"
                      className="repeat-remove"
                      onClick={() => removeCodigo(i)}
                    >
                      Quitar
                    </button>
                    <div className="field-row cols-4">
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">Código</label>
                        <input
                          className="input"
                          type="text"
                          value={c.codigo}
                          onChange={(e) =>
                            updateCodigo(i, {
                              codigo: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="PRENSA20"
                        />
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">Tipo</label>
                        <select
                          className="select"
                          value={c.tipo}
                          onChange={(e) =>
                            updateCodigo(i, {
                              tipo: e.target.value as Codigo["tipo"],
                            })
                          }
                        >
                          <option value="porcentaje">%</option>
                          <option value="monto">MXN</option>
                        </select>
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">Valor</label>
                        <input
                          className="input tabular"
                          type="number"
                          min={0}
                          value={c.valor}
                          onChange={(e) =>
                            updateCodigo(i, { valor: e.target.value })
                          }
                          placeholder="20"
                        />
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label className="label">
                          Vigencia <span className="label-hint">hasta</span>
                        </label>
                        <input
                          className="input tabular"
                          type="date"
                          value={c.vigencia}
                          onChange={(e) =>
                            updateCodigo(i, { vigencia: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="btn-add" onClick={addCodigo}>
                  + Agregar código
                </button>
              </div>
            </section>

            {/* 08 — Payout */}
            <section id="payout" className="section">
              <div className="section-head">
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="section-num">08</span>
                    <h2 className="section-title">Datos para payout</h2>
                  </div>
                  <p className="section-subtitle">
                    Cuenta donde Dulos te transferirá las ventas. Solo el
                    equipo administrativo de Dulos ve esta información.
                  </p>
                </div>
              </div>

              <div className="field">
                <label className="label">Titular de la cuenta</label>
                <input
                  className="input"
                  type="text"
                  required
                  value={payoutTitular}
                  onChange={(e) => setPayoutTitular(e.target.value)}
                  placeholder="Nombre completo o razón social como aparece en el banco"
                />
              </div>

              <div className="field-row cols-2">
                <div className="field">
                  <label className="label">Banco</label>
                  <input
                    className="input"
                    type="text"
                    required
                    value={payoutBanco}
                    onChange={(e) => setPayoutBanco(e.target.value)}
                    placeholder="BBVA · Santander · Banorte · etc."
                  />
                </div>
                <div className="field">
                  <label className="label">
                    RFC del titular{" "}
                    <span className="label-hint">opcional · para factura</span>
                  </label>
                  <input
                    className="input tabular"
                    type="text"
                    value={payoutRfc}
                    onChange={(e) =>
                      setPayoutRfc(e.target.value.toUpperCase())
                    }
                    placeholder="XAXX010101000"
                    maxLength={13}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">
                  CLABE interbancaria{" "}
                  <span className="label-hint">18 dígitos</span>
                </label>
                <input
                  className="input tabular"
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="\d{18}"
                  maxLength={18}
                  value={payoutClabe}
                  onChange={(e) =>
                    setPayoutClabe(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="012345678901234567"
                />
                <p className="help">
                  Necesaria para SPEI. La encuentras en tu app del banco
                  → Cuenta → CLABE. Solo dígitos, sin espacios.
                </p>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">
                  Número de cuenta o tarjeta{" "}
                  <span className="label-hint">opcional</span>
                </label>
                <input
                  className="input tabular"
                  type="text"
                  value={payoutCuenta}
                  onChange={(e) =>
                    setPayoutCuenta(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Solo si tu banco lo pide además de CLABE"
                />
              </div>
            </section>

            {/* 09 — Notas */}
            <section id="notas" className="section">
              <div className="section-head">
                <span className="section-num">09</span>
                <h2 className="section-title">Comentarios adicionales</h2>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">
                  ¿Algo más que el equipo Dulos deba saber?{" "}
                  <span className="label-hint">opcional</span>
                </label>
                <textarea
                  className="textarea"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Acuerdos previos, requerimientos técnicos del venue, presupuesto de pauta sugerido, etc."
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
                El equipo de Dulos revisará el registro y te contactará por
                WhatsApp o email en menos de 24 h.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
