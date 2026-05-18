"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
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

const DRAFT_KEY = "dulos-altas-draft-v2";

// — Iconos inline (sin librería)
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconCheck = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 7h15M11 1l5 6-5 6" />
  </svg>
);
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// — Validators
const isEmailValid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const isWhatsappValid = (s: string) => s.replace(/\D/g, "").length >= 10;
const isUrlValid = (s: string) =>
  !s ? false : /^https?:\/\/.+\..+/.test(s.trim());
const isRfcValid = (s: string) =>
  !s ? true : /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(s.trim());
const isClabeValid = (s: string) => /^\d{18}$/.test(s);

export default function Home() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // — Estado del form
  const [productorNombre, setProductorNombre] = useState("");
  const [productorEmail, setProductorEmail] = useState("");
  const [productorWhatsapp, setProductorWhatsapp] = useState("");

  const [venueNombre, setVenueNombre] = useState("");
  const [venueDireccion, setVenueDireccion] = useState("");
  const [venueCiudad, setVenueCiudad] = useState("Ciudad de México, CDMX");
  const [venueCapacidad, setVenueCapacidad] = useState("");
  const [venueMapa, setVenueMapa] = useState("");
  const [venueAsientosNumerados, setVenueAsientosNumerados] = useState(false);
  const [venueFilas, setVenueFilas] = useState("");
  const [venueSecciones, setVenueSecciones] = useState("");
  const [venueButacasPorFila, setVenueButacasPorFila] = useState("");

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
  const [eventoVideos, setEventoVideos] = useState("");

  const [tipoFechas, setTipoFechas] = useState<
    "una" | "varias" | "multiday"
  >("una");
  const [funciones, setFunciones] = useState<Funcion[]>([
    { fecha: "", horaInicio: "", horaFin: "" },
  ]);

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
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);

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

  const [redInstagram, setRedInstagram] = useState("");
  const [redFacebook, setRedFacebook] = useState("");
  const [redWeb, setRedWeb] = useState("");
  const [codigos, setCodigos] = useState<Codigo[]>([]);

  const [payoutTitular, setPayoutTitular] = useState("");
  const [payoutBanco, setPayoutBanco] = useState("");
  const [payoutClabe, setPayoutClabe] = useState("");
  const [payoutCuenta, setPayoutCuenta] = useState("");
  const [payoutRfc, setPayoutRfc] = useState("");

  const [notas, setNotas] = useState("");

  // — UX states
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("productor");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStickySubmit, setShowStickySubmit] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // — Payload (memo)
  const payload = useMemo(
    () => ({
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
        videos: eventoVideos,
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
    }),
    [
      productorNombre, productorEmail, productorWhatsapp,
      venueNombre, venueDireccion, venueCiudad, venueCapacidad, venueMapa,
      venueAsientosNumerados, venueFilas, venueSecciones, venueButacasPorFila,
      eventoNombre, eventoDescripcion, eventoCategoria, eventoSubgenero,
      eventoDuracion, eventoIdioma, eventoAperturaPuertas, eventoImagen,
      eventoGaleria, eventoVideos,
      tipoFechas, funciones,
      zonas, bloqueos,
      edadMinima, accesibilidad, restricciones, politicaCancelacion,
      metodosPago, factura,
      redInstagram, redFacebook, redWeb, codigos,
      payoutTitular, payoutBanco, payoutClabe, payoutCuenta, payoutRfc,
      notas,
    ]
  );

  // — Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        // hidratar — solo si el campo existe en draft, evita errores
        setProductorNombre(d.productor?.nombre || "");
        setProductorEmail(d.productor?.email || "");
        setProductorWhatsapp(d.productor?.whatsapp || "");
        setVenueNombre(d.venue?.nombre || "");
        setVenueDireccion(d.venue?.direccion || "");
        setVenueCiudad(d.venue?.ciudad || "Ciudad de México, CDMX");
        setVenueCapacidad(d.venue?.capacidad || "");
        setVenueMapa(d.venue?.mapa || "");
        setVenueAsientosNumerados(!!d.venue?.asientosNumerados);
        setVenueFilas(d.venue?.filas || "");
        setVenueSecciones(d.venue?.secciones || "");
        setVenueButacasPorFila(d.venue?.butacasPorFila || "");
        setEventoNombre(d.evento?.nombre || "");
        setEventoDescripcion(d.evento?.descripcion || "");
        setEventoCategoria(d.evento?.categoria || "Música");
        setEventoSubgenero(d.evento?.subgenero || "");
        setEventoDuracion(d.evento?.duracion || "");
        setEventoIdioma(d.evento?.idioma || "Español");
        setEventoAperturaPuertas(d.evento?.aperturaPuertas || "30");
        setEventoImagen(d.evento?.imagen || "");
        setEventoGaleria(d.evento?.galeria || "");
        setEventoVideos(d.evento?.videos || "");
        setTipoFechas(d.fechas?.tipo || "una");
        if (d.fechas?.funciones?.length)
          setFunciones(d.fechas.funciones);
        if (d.zonas?.length) setZonas(d.zonas);
        if (d.bloqueos?.length) setBloqueos(d.bloqueos);
        setEdadMinima(d.logistica?.edadMinima || "Todas las edades");
        setAccesibilidad(d.logistica?.accesibilidad || []);
        setRestricciones(d.logistica?.restricciones || "");
        setPoliticaCancelacion(d.logistica?.politicaCancelacion || "");
        setMetodosPago(d.logistica?.metodosPago || METODOS_PAGO_DEFAULT);
        setFactura(d.logistica?.factura || "No");
        setRedInstagram(d.promocion?.redes?.instagram || "");
        setRedFacebook(d.promocion?.redes?.facebook || "");
        setRedWeb(d.promocion?.redes?.web || "");
        setCodigos(d.promocion?.codigos || []);
        setPayoutTitular(d.payout?.titular || "");
        setPayoutBanco(d.payout?.banco || "");
        setPayoutClabe(d.payout?.clabe || "");
        setPayoutCuenta(d.payout?.cuenta || "");
        setPayoutRfc(d.payout?.rfc || "");
        setNotas(d.notas || "");
      }
    } catch (e) {
      console.warn("draft restore failed", e);
    }
    setLoaded(true);
  }, []);

  // — Autosave (debounced)
  useEffect(() => {
    if (!loaded) return;
    setIsSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        setIsSaving(false);
        setSavedAt(Date.now());
      } catch (e) {
        console.warn("draft save failed", e);
        setIsSaving(false);
      }
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [payload, loaded]);

  // — Scroll-spy
  useEffect(() => {
    const sections = TOC.map((t) => document.getElementById(t.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // — Sticky submit visible solo después de scroll
  useEffect(() => {
    const onScroll = () => setShowStickySubmit(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // — Helpers
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
    setZonas((z) =>
      z.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );

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

  // — Section completeness
  // Required: deben tener todos sus campos válidos
  // Opcional: palomita solo si el usuario llenó algo (no por default)
  const sectionsComplete = useMemo(() => {
    const c: Record<string, boolean> = {};
    c.productor =
      !!productorNombre &&
      isEmailValid(productorEmail) &&
      isWhatsappValid(productorWhatsapp);
    c.venue =
      !!venueNombre &&
      !!venueDireccion &&
      !!venueCiudad &&
      !!venueCapacidad &&
      isUrlValid(venueMapa);
    c.evento =
      !!eventoNombre &&
      !!eventoDescripcion &&
      !!eventoDuracion &&
      isUrlValid(eventoImagen);
    c.fechas = funciones.every((f) => f.fecha && f.horaInicio);
    c.zonas = zonas.every((z) => z.nombre && z.precio && z.capacidad);
    c.payout =
      !!payoutTitular &&
      !!payoutBanco &&
      isClabeValid(payoutClabe) &&
      isRfcValid(payoutRfc);

    // Opcionales: completas solo si hay datos no-default
    const metodosPagoTocado =
      metodosPago.length !== METODOS_PAGO_DEFAULT.length ||
      !METODOS_PAGO_DEFAULT.every((m) => metodosPago.includes(m));
    c.logistica =
      edadMinima !== "Todas las edades" ||
      accesibilidad.length > 0 ||
      restricciones.trim() !== "" ||
      politicaCancelacion.trim() !== "" ||
      metodosPagoTocado ||
      factura !== "No";
    c.promocion =
      redInstagram.trim() !== "" ||
      redFacebook.trim() !== "" ||
      redWeb.trim() !== "" ||
      codigos.length > 0;
    c.notas = notas.trim() !== "";

    return c;
  }, [
    productorNombre, productorEmail, productorWhatsapp,
    venueNombre, venueDireccion, venueCiudad, venueCapacidad, venueMapa,
    eventoNombre, eventoDescripcion, eventoDuracion, eventoImagen,
    funciones, zonas,
    payoutTitular, payoutBanco, payoutClabe, payoutRfc,
    edadMinima, accesibilidad, restricciones, politicaCancelacion,
    metodosPago, factura,
    redInstagram, redFacebook, redWeb, codigos,
    notas,
  ]);

  // Secciones obligatorias para enviar el form
  const REQUIRED_SECTIONS = [
    "productor",
    "venue",
    "evento",
    "fechas",
    "zonas",
    "payout",
  ] as const;

  // Progress se mide solo sobre las required (las opcionales son bonus)
  const progress = useMemo(() => {
    const total = REQUIRED_SECTIONS.length;
    const done = REQUIRED_SECTIONS.filter((id) => sectionsComplete[id]).length;
    return Math.round((done / total) * 100);
  }, [sectionsComplete]);

  const allComplete = useMemo(
    () => REQUIRED_SECTIONS.every((id) => sectionsComplete[id]),
    [sectionsComplete]
  );

  // — Submit
  const onPreSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const onConfirmSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Submit fallido");
      // Limpiar borrador al enviar exitoso
      localStorage.removeItem(DRAFT_KEY);
      router.push("/gracias");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  const clearDraft = () => {
    if (!confirm("¿Borrar todos los datos del formulario? No se puede deshacer."))
      return;
    localStorage.removeItem(DRAFT_KEY);
    location.reload();
  };

  // — Modal summary
  const totalCapacidad = zonas.reduce(
    (a, z) => a + (parseInt(z.capacidad || "0", 10) || 0),
    0
  );
  const rangoPrecios = (() => {
    const ps = zonas
      .map((z) => parseInt(z.precio || "0", 10))
      .filter((n) => n > 0);
    if (!ps.length) return "—";
    const min = Math.min(...ps);
    const max = Math.max(...ps);
    return min === max ? `$${min}` : `$${min} – $${max}`;
  })();
  const fechaPrimera = funciones[0]?.fecha
    ? new Date(funciones[0].fecha + "T00:00:00").toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100svh;
          padding: 56px 24px 140px;
        }
        @media (max-width: 768px) {
          .page { padding: 40px 16px 120px; }
        }

        .layout {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 64px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 1024px) {
          .layout { grid-template-columns: 240px 1fr; gap: 56px; }
        }

        .toc { display: none; }

        @media (min-width: 1024px) {
          .toc {
            display: block;
            position: sticky;
            top: 56px;
            align-self: start;
            padding-top: 72px;
            max-height: calc(100svh - 80px);
            overflow-y: auto;
          }
          .toc-label {
            font-size: 0.66rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: var(--ink-3);
            font-weight: 600;
            margin-bottom: 18px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--hairline);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .toc-progress {
            font-variant-numeric: tabular-nums;
            color: var(--ink-2);
            letter-spacing: 0.04em;
          }
          .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .toc-item a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px 10px 14px;
            color: var(--ink-3);
            text-decoration: none;
            font-size: 0.86rem;
            font-weight: 500;
            border-left: 2px solid transparent;
            margin-left: -16px;
          }
          .toc-item a:hover {
            color: var(--ink-2);
          }
          .toc-item-num {
            font-size: 0.66rem;
            letter-spacing: 0.18em;
            color: var(--ink-4);
            font-variant-numeric: tabular-nums;
            min-width: 18px;
          }
        }

        .container { max-width: 760px; }

        .brand {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 56px;
        }
        .brand-left {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
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
          font-size: clamp(2.2rem, 4.6vw, 3.2rem);
          font-weight: 600;
          line-height: 1.02;
          letter-spacing: -0.028em;
          margin: 0 0 22px;
          color: var(--ink);
        }
        .h1 em {
          font-style: italic;
          color: var(--ink-2);
          font-weight: 500;
        }

        .lead {
          font-size: 1.06rem;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 54ch;
          margin: 0 0 56px;
          font-weight: 400;
        }

        .section {
          background: var(--bg-card);
          border: 1px solid var(--hairline);
          border-radius: 18px;
          padding: 40px;
          margin-bottom: 28px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
          scroll-margin-top: 24px;
        }
        @media (max-width: 640px) {
          .section { padding: 26px 20px; border-radius: 14px; margin-bottom: 18px; }
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
          flex-shrink: 0;
        }
        .section-title {
          font-size: 1.24rem;
          font-weight: 600;
          letter-spacing: -0.012em;
          color: var(--ink);
          margin: 0;
        }
        .section-subtitle {
          font-size: 0.86rem;
          color: var(--ink-3);
          margin: 8px 0 0;
          line-height: 1.55;
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
            gap: 14px;
          }
        }

        .label {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink-2);
          letter-spacing: 0.005em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .label-hint {
          font-weight: 400;
          color: var(--ink-3);
          font-size: 0.72rem;
        }

        .help {
          font-size: 0.74rem;
          color: var(--ink-3);
          margin-top: 2px;
          line-height: 1.5;
        }
        .help.is-error { color: var(--crimson); }

        .radio-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .radio-pill {
          flex: 1;
          min-width: 110px;
          padding: 13px 16px;
          background: var(--field-bg);
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--ink-2);
          transition: all 0.18s ease;
          text-align: center;
          font-weight: 500;
          font-family: inherit;
        }
        .radio-pill:hover { background: var(--field-hover); }
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
        .checkbox-row:hover { background: var(--field-hover); }
        .checkbox-row input {
          width: 18px;
          height: 18px;
          accent-color: var(--crimson);
          cursor: pointer;
          flex-shrink: 0;
        }
        .checkbox-row label, .checkbox-row span {
          cursor: pointer;
          font-size: 0.92rem;
          flex: 1;
        }

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
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: var(--ink-3);
          font-size: 0.74rem;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 5px;
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

        .sub-block {
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid var(--hairline);
        }
        .sub-block-head {
          margin-bottom: 18px;
        }
        .sub-block-title {
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-2);
          margin: 0;
        }
        .sub-block-desc {
          font-size: 0.86rem;
          color: var(--ink-3);
          margin-top: 6px;
          line-height: 1.55;
          max-width: 52ch;
        }

        .section-head-with-sub {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .submit-bar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 44px;
        }
        .submit-help {
          font-size: 0.78rem;
          color: var(--ink-3);
          text-align: center;
          line-height: 1.55;
        }

        @media (max-width: 768px) {
          .submit-bar { margin-bottom: 80px; }
        }
      `}</style>

      {/* Progress bar */}
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Toast guardado */}
      {loaded && savedAt && (
        <div className={`toast ${isSaving ? "is-saving" : ""}`}>
          <span className="toast-dot" />
          <span>{isSaving ? "Guardando…" : "Borrador guardado"}</span>
        </div>
      )}

      <div className="layout">
        <aside className="toc">
          <div className="toc-label">
            <span>Secciones</span>
            <span className="toc-progress">{progress}%</span>
          </div>
          <ul className="toc-list">
            {TOC.map((t) => (
              <li
                key={t.id}
                className={`toc-item ${
                  activeSection === t.id ? "is-active" : ""
                } ${sectionsComplete[t.id] ? "is-complete" : ""}`}
              >
                <a href={`#${t.id}`}>
                  <span className="toc-item-num">{t.num}</span>
                  <span>{t.label}</span>
                  <span className="toc-item-check">
                    <IconCheck size={9} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="container">
          <div className="brand">
            <div className="brand-left">
              <span className="brand-mark">dulos</span>
              <span className="brand-divider">/</span>
              <span className="brand-label">Alta de evento</span>
            </div>
            {loaded && savedAt && (
              <button
                type="button"
                className="btn-ghost"
                onClick={clearDraft}
                title="Borrar todos los datos guardados"
              >
                Limpiar formulario
              </button>
            )}
          </div>

          <h1 className="h1">
            Registra tu evento.
          </h1>
          <p className="lead">
            Llena estos datos, revisamos en menos de 24&nbsp;h, y publicamos.
            Tu progreso se guarda automáticamente — puedes cerrar la pestaña y
            volver luego sin perder nada.
          </p>

          <form onSubmit={onPreSubmit}>
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
                    className={`input ${
                      productorEmail && isEmailValid(productorEmail)
                        ? "is-valid"
                        : ""
                    }`}
                    type="email"
                    required
                    value={productorEmail}
                    onChange={(e) => setProductorEmail(e.target.value)}
                    placeholder="hola@productora.com"
                  />
                  {productorEmail && !isEmailValid(productorEmail) && (
                    <p className="help is-error">
                      Email no parece válido. Revisa el formato.
                    </p>
                  )}
                </div>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">WhatsApp</label>
                <div className="input-prefixed">
                  <span className="input-prefix">🇲🇽 +52</span>
                  <input
                    className="input tabular"
                    type="tel"
                    required
                    value={productorWhatsapp}
                    onChange={(e) =>
                      setProductorWhatsapp(
                        e.target.value.replace(/[^\d\s]/g, "")
                      )
                    }
                    placeholder="55 0000 0000"
                  />
                </div>
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
                  placeholder="Teatro, foro, sala, carpa…"
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
                  <span className="label-hint">link de Drive</span>
                </label>
                <input
                  className={`input ${
                    venueMapa && isUrlValid(venueMapa) ? "is-valid" : ""
                  }`}
                  type="url"
                  required
                  value={venueMapa}
                  onChange={(e) => setVenueMapa(e.target.value)}
                  placeholder="https://drive.google.com/…"
                />
                <p className="help">
                  Sube el plano a Drive o Dropbox y pega el link público. Si
                  no tienes plano formal, una silueta a mano sirve.
                </p>
              </div>

              <div
                className="checkbox-row"
                style={{ marginBottom: venueAsientosNumerados ? 18 : 0 }}
              >
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
                <div className="field-row cols-3" style={{ marginBottom: 0 }}>
                  <div className="field">
                    <label className="label">Filas</label>
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
                    <label className="label">Secciones</label>
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
                  placeholder="Como debe aparecer publicado"
                />
              </div>

              <div className="field">
                <label className="label">Sinopsis</label>
                <textarea
                  className="textarea"
                  required
                  value={eventoDescripcion}
                  onChange={(e) => setEventoDescripcion(e.target.value)}
                  placeholder="Descripción / sinopsis de tu evento."
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
                    Subgénero{" "}
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
                    Puertas abren antes{" "}
                    <span className="label-hint">minutos</span>
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
                  <p className="help">
                    Cuántos min antes del inicio se abre el recinto.
                  </p>
                </div>
              </div>

              <div className="field">
                <label className="label">
                  Imagen principal{" "}
                  <span className="label-hint">link Drive · vertical 4:5 ideal</span>
                </label>
                <input
                  className={`input ${
                    eventoImagen && isUrlValid(eventoImagen) ? "is-valid" : ""
                  }`}
                  type="url"
                  required
                  value={eventoImagen}
                  onChange={(e) => setEventoImagen(e.target.value)}
                  placeholder="https://drive.google.com/…"
                />
              </div>

              <div className="field-row cols-2" style={{ marginBottom: 0 }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label">
                    Galería de fotos{" "}
                    <span className="label-hint">opcional · carpeta Drive</span>
                  </label>
                  <input
                    className="input"
                    type="url"
                    value={eventoGaleria}
                    onChange={(e) => setEventoGaleria(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/…"
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="label">
                    Galería de videos{" "}
                    <span className="label-hint">opcional · carpeta Drive</span>
                  </label>
                  <input
                    className="input"
                    type="url"
                    value={eventoVideos}
                    onChange={(e) => setEventoVideos(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/…"
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
                      <IconX /> Quitar
                    </button>
                  )}
                  <div className="field-row cols-3">
                    <div className="field">
                      <label className="label">
                        Fecha{" "}
                        <span className="label-hint">día / mes / año</span>
                      </label>
                      <input
                        className="input tabular"
                        type="date"
                        required
                        value={f.fecha}
                        onChange={(e) =>
                          updateFuncion(i, { fecha: e.target.value })
                        }
                      />
                      {f.fecha && (
                        <p className="help">
                          {new Date(
                            f.fecha + "T00:00:00"
                          ).toLocaleDateString("es-MX", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
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
                <IconPlus /> Agregar función
              </button>
            </section>

            {/* 05 — Zonas, precios y bloqueos */}
            <section id="zonas" className="section">
              <div className="section-head section-head-with-sub">
                <span className="section-num">05</span>
                <div>
                  <h2 className="section-title">Zonas y precios</h2>
                  <p className="section-subtitle">
                    Una zona por cada categoría de boleto. Reserva asientos
                    aparte si necesitas cortesías o prensa.
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
                      <IconX /> Quitar
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
                          updateZona(i, {
                            tipo: e.target.value as Zona["tipo"],
                          })
                        }
                      >
                        <option value="GA">General (GA) — entrada libre</option>
                        <option value="Asiento asignado">
                          Asiento asignado — fila + número
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
                <IconPlus /> Agregar zona
              </button>

              {/* Sub-feature: asientos bloqueados */}
              <div className="sub-block">
                <div className="sub-block-head">
                  <h3 className="sub-block-title">Asientos bloqueados</h3>
                  <p className="sub-block-desc">
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
                      <IconX /> Quitar
                    </button>
                    <div className="field-row cols-2" style={{ marginBottom: 0 }}>
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
                  <IconPlus /> Agregar bloqueo
                </button>
              </div>
            </section>

            {/* 06 — Logística */}
            <section id="logistica" className="section">
              <div className="section-head section-head-with-sub">
                <span className="section-num">06</span>
                <div>
                  <h2 className="section-title">Logística y políticas</h2>
                  <p className="section-subtitle">
                    Lo que el público necesita saber antes de comprar. Las
                    políticas por default de Dulos aplican si dejas algún campo
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
                <label className="label">Accesibilidad</label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={accesibilidad.includes("Acceso silla de ruedas")}
                    onChange={() =>
                      toggleAccesibilidad("Acceso silla de ruedas")
                    }
                  />
                  <span>El recinto tiene acceso para silla de ruedas</span>
                </label>
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
                  placeholder="Sin cámaras profesionales · Sin alimentos del exterior · No se permite reingreso…"
                  style={{ minHeight: 90 }}
                />
              </div>

              <div className="field">
                <label className="label">
                  Política de cancelación específica{" "}
                  <span className="label-hint">opcional · sobrescribe default</span>
                </label>
                <textarea
                  className="textarea"
                  value={politicaCancelacion}
                  onChange={(e) => setPoliticaCancelacion(e.target.value)}
                  placeholder="Default Dulos: sin preguntas hasta 48 h antes. Reembolso completo en 72 h a tarjeta original."
                  style={{ minHeight: 90 }}
                />
              </div>

              <div className="field">
                <label className="label">Métodos de pago a habilitar</label>
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
                  Todos habilitados por default. Desmarca solo si no quieres
                  alguno.
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
              <div className="section-head section-head-with-sub">
                <span className="section-num">07</span>
                <div>
                  <h2 className="section-title">Promoción</h2>
                  <p className="section-subtitle">
                    Redes del productor y códigos de descuento para campañas.
                    Todo opcional.
                  </p>
                </div>
              </div>

              <div className="field-row cols-3">
                <div className="field">
                  <label className="label">
                    Instagram{" "}
                    <span className="label-hint">@usuario o URL</span>
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
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="sub-block">
                <div className="sub-block-head">
                  <h3 className="sub-block-title">Códigos de descuento</h3>
                  <p className="sub-block-desc">
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
                      <IconX /> Quitar
                    </button>
                    <div
                      className="field-row cols-4"
                      style={{ marginBottom: 0 }}
                    >
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
                  <IconPlus /> Agregar código
                </button>
              </div>
            </section>

            {/* 08 — Payout */}
            <section id="payout" className="section">
              <div className="section-head section-head-with-sub">
                <span className="section-num">08</span>
                <div>
                  <h2 className="section-title">Datos para payout</h2>
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
                    placeholder="BBVA · Santander · Banorte…"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    RFC del titular{" "}
                    <span className="label-hint">opcional · para factura</span>
                  </label>
                  <input
                    className={`input tabular ${
                      payoutRfc && isRfcValid(payoutRfc) ? "is-valid" : ""
                    }`}
                    type="text"
                    value={payoutRfc}
                    onChange={(e) =>
                      setPayoutRfc(e.target.value.toUpperCase())
                    }
                    placeholder="XAXX010101000"
                    maxLength={13}
                  />
                  {payoutRfc && !isRfcValid(payoutRfc) && (
                    <p className="help is-error">
                      Formato RFC no parece válido.
                    </p>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="label">
                  CLABE interbancaria{" "}
                  <span className="label-hint">18 dígitos</span>
                </label>
                <div className="input-with-suffix">
                  <input
                    className={`input tabular ${
                      isClabeValid(payoutClabe) ? "is-valid" : ""
                    }`}
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
                  {isClabeValid(payoutClabe) && (
                    <span className="input-suffix">
                      <span className="icon icon-check-success">
                        <IconCheck size={12} />
                      </span>
                    </span>
                  )}
                </div>
                <p className="help">
                  {payoutClabe.length > 0 && payoutClabe.length < 18
                    ? `${payoutClabe.length} de 18 dígitos.`
                    : "Necesaria para SPEI. La encuentras en tu app del banco → Cuenta → CLABE."}
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
                  placeholder="Acuerdos previos, requerimientos técnicos del venue, contexto del evento…"
                />
              </div>
            </section>

            <div className="submit-bar">
              <button
                type="submit"
                className="btn-primary btn-lg btn-block"
                disabled={submitting || !allComplete}
              >
                {submitting
                  ? "Enviando…"
                  : allComplete
                  ? "Revisar y enviar"
                  : `Completa el formulario (${progress}%)`}
                {!submitting && allComplete && <IconArrow />}
              </button>
              <p className="submit-help">
                Vamos a revisar el resumen antes de enviar. Nada se manda hasta
                que confirmes.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Sticky submit (mobile) */}
      <div
        className={`submit-sticky ${
          showStickySubmit && allComplete ? "is-visible" : ""
        }`}
        aria-hidden={!showStickySubmit || !allComplete}
      >
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowConfirm(true)}
          disabled={submitting}
        >
          Revisar y enviar <IconArrow />
        </button>
      </div>

      {/* Modal pre-submit */}
      {showConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-eyebrow">Confirmar envío</span>
            <h2 className="modal-title">¿Enviar este registro a Dulos?</h2>
            <div className="modal-summary">
              <div className="modal-row">
                <span className="modal-row-label">Evento</span>
                <span className="modal-row-value">
                  {eventoNombre || "—"}
                </span>
              </div>
              <div className="modal-row">
                <span className="modal-row-label">Venue</span>
                <span className="modal-row-value">{venueNombre || "—"}</span>
              </div>
              <div className="modal-row">
                <span className="modal-row-label">Primera función</span>
                <span className="modal-row-value">{fechaPrimera}</span>
              </div>
              <div className="modal-row">
                <span className="modal-row-label">Zonas</span>
                <span className="modal-row-value">
                  {zonas.length} · {rangoPrecios}
                </span>
              </div>
              <div className="modal-row">
                <span className="modal-row-label">Capacidad total</span>
                <span className="modal-row-value">
                  {totalCapacidad > 0 ? totalCapacidad : "—"}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                Volver a editar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={onConfirmSubmit}
                disabled={submitting}
              >
                {submitting ? "Enviando…" : "Enviar a Dulos"}
                {!submitting && <IconArrow />}
              </button>
            </div>
            <p className="modal-help">
              Al enviar, el equipo de Dulos recibirá los datos y te contactará
              por WhatsApp o email en menos de 24 h.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
