# Dulos — Alta de evento

Formulario web para que productores externos registren un evento que quieren dar de alta en [Dulos](https://dulos.io). El formulario guarda cada submission en un archivo JSON local (`data/submissions.json`) — desde ahí el equipo de Dulos lo conecta a Notion, Sheets, Supabase o donde prefiera.

Hecho por [@kraymoverich](https://github.com/kraymoverich) como cortesía para el equipo Dulos.

---

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- Sin dependencias externas de pago. Storage local en JSON.

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Ver las submissions

Dos formas:

1. **API JSON**: `GET http://localhost:3000/api/submit` devuelve todas las submissions.
2. **Archivo directo**: `data/submissions.json` (se crea automáticamente al primer envío).

> El archivo `data/submissions.json` está en `.gitignore` — no se commiteará al repo.

## Estructura de los datos

Cada submission tiene este shape:

```jsonc
{
  "id": "uuid-generado",
  "timestamp": "2026-05-17T...Z",
  "productor": { "nombre": "...", "email": "...", "whatsapp": "..." },
  "venue": {
    "nombre": "...", "direccion": "...", "ciudad": "...",
    "capacidad": "525", "mapa": "https://...",
    "asientosNumerados": true,
    "filas": "20", "secciones": "3", "butacasPorFila": "25"
  },
  "evento": {
    "nombre": "...", "descripcion": "...",
    "categoria": "Concierto | Teatro | Festival | Comedia | Otro",
    "imagen": "https://...", "galeria": "https://..."
  },
  "fechas": {
    "tipo": "una | varias | multiday",
    "funciones": [{ "fecha": "2026-06-13", "horaInicio": "20:00", "horaFin": "21:30" }]
  },
  "zonas": [
    {
      "nombre": "Diamante", "tipo": "GA | Asiento asignado",
      "precio": "799", "precioPromo": "", "capacidad": "80",
      "filas": "A-D (centro)"
    }
  ],
  "notas": "..."
}
```

## Conectar a storage externo

El endpoint `POST /api/submit` está en `app/api/submit/route.ts`. Es trivial cambiar el `fs.writeFile` por:

- **Notion**: `notion-client` → crear page en una database.
- **Google Sheets**: Apps Script webhook o `googleapis`.
- **Supabase**: `supabase.from('events').insert(...)`.
- **Email**: Resend / Postmark con `resend.emails.send(...)`.

Todas las opciones requieren variables de entorno en `.env.local`.

## Deploy

Sin requerimientos especiales. Funciona en cualquier host que corra Node (Vercel, Netlify, Railway, VPS propio).

> Nota: el archivo local `data/submissions.json` no persiste en serverless. Para producción real, conectar a una DB externa.

## Branding

Paleta:
- Rojo Dulos: `#B33A35`
- Cream bg: `#FAFAFA`
- Ink: `#0A0A0A`

Tipografía: Inter (Google Fonts, cargada vía `next/font`).

## Licencia

Uso libre interno para Dulos.
