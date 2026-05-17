import Link from "next/link";

export default function Gracias() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <style>{`
        .g-wrap { max-width: 480px; margin: 0 auto; }
        .g-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--crimson);
          font-weight: 600;
          margin-bottom: 20px;
          display: block;
        }
        .g-title {
          font-size: clamp(2rem, 4.6vw, 3rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0 0 18px;
        }
        .g-lead {
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--ink-2);
          margin: 0 0 32px;
        }
        .g-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--ink-2);
          text-decoration: none;
          padding: 12px 24px;
          border: 1px solid var(--hairline-strong);
          border-radius: 999px;
          transition: all 0.2s ease;
        }
        .g-back:hover {
          color: var(--crimson);
          border-color: var(--crimson);
          background: var(--crimson-soft);
        }
      `}</style>

      <div className="g-wrap">
        <span className="g-eyebrow">Registro recibido</span>
        <h1 className="g-title">Gracias por tu registro.</h1>
        <p className="g-lead">
          El equipo de Dulos lo revisará en menos de 24 horas y te contactará por
          el WhatsApp o email que dejaste para confirmar la publicación.
        </p>
        <Link href="/" className="g-back">
          ← Registrar otro evento
        </Link>
      </div>
    </main>
  );
}
