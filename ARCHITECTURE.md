# Furvo — Architecture & Tech Stack

> Documento de referencia para el equipo de desarrollo. Última actualización: Abril 2026.

---

## Visión general

Furvo es una **PWA mobile-first** de quinielas para el Mundial de Fútbol 2026. Los usuarios crean ligas privadas, predicen resultados de partidos y compiten en clasificaciones en tiempo real.

El stack prioriza **velocidad de entrega** (todo el proyecto en un único repositorio), **coste operativo bajo** (Supabase free tier hasta ~50k usuarios activos), y **DX excelente** (TypeScript estricto, Server Components sin boilerplate de fetch).

---

## Stack tecnológico

| Capa | Tecnología | Versión | Rol |
|---|---|---|---|
| Framework | **Next.js** | 14 (App Router) | Routing, SSR, Server Components |
| UI | **React** | 18.3 | Componentes cliente con estado |
| Lenguaje | **TypeScript** | 5.6 | Tipado end-to-end |
| BaaS | **Supabase** | — | PostgreSQL + Auth + RLS + Realtime |
| Auth | **Supabase Auth** | — | Email/password + sesión por cookies |
| ORM | `@supabase/ssr` + `@supabase/supabase-js` | 0.10 / 2.104 | Clientes tipados SSR/client |
| Estilos | **CSS-in-JS inline** + `globals.css` | — | Design tokens oklch, sin librerías |
| Fuentes | **Google Fonts** (CDN) | — | Instrument Serif, Inter Tight, JetBrains Mono |
| Despliegue | **Vercel** (recomendado) | — | Edge functions, ISR automático |

---

## Estructura del proyecto

```
furvo-nextjs/
├── app/                        # App Router — cada carpeta = una ruta
│   ├── layout.tsx              # Root layout: fuentes + SidebarShell
│   ├── page.tsx                # Raíz: redirige a /liga/:code o /onboarding
│   ├── login/page.tsx          # Auth: sign-in + sign-up con Supabase Auth
│   ├── onboarding/page.tsx     # Crear liga o unirse con código
│   ├── reglas/page.tsx         # Reglas del juego (primera visita + desde perfil)
│   ├── liga/[id]/page.tsx      # Dashboard de liga (server component)
│   ├── jornada/[id]/
│   │   ├── page.tsx            # Server: fetches + resolución de jornada activa
│   │   └── jornada-client.tsx  # Client: predicciones interactivas
│   ├── clasificacion/[id]/page.tsx
│   ├── grupos/[id]/page.tsx    # Tabla de grupos del Mundial
│   ├── resultados/[id]/page.tsx
│   └── perfil/page.tsx        # Perfil de usuario (client component)
│
├── components/
│   ├── primitives.tsx          # Design system: FurvoMark, FurvoWordmark,
│   │                           # FurvoLogo, MatchCard, PickToggle,
│   │                           # ExactScoreInput, Avatar, GlassCard, EyebrowLabel
│   ├── tab-bar.tsx             # Navegación inferior (mobile) con scroll-hide
│   ├── sidebar.tsx             # Navegación lateral (desktop ≥ 768px)
│   ├── copy-code.tsx           # Botón para copiar código de invitación
│   └── rules-check.tsx         # Guard de primera visita (localStorage)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # createClient() para Server Components y Route Handlers
│   │   └── client.ts           # createClient() para Client Components
│   └── database.types.ts       # Tipos generados por supabase CLI
│
├── supabase/
│   ├── schema.sql              # DDL completo: tablas, índices, triggers, RLS, RPCs
│   ├── seed.sql                # Datos de prueba (usuarios mock, ligas)
│   └── seed_mundial.sql        # 48 equipos + 72 partidos de fase de grupos 2026
│
└── app/globals.css             # Tokens de diseño, animaciones, utilidades responsive
```

---

## Arquitectura de datos (Supabase / PostgreSQL)

### Diagrama entidad-relación

```
auth.users (Supabase)
    │
    ▼
profiles ──────────────────────────────────────┐
    │                                           │
    ├──< league_members >── leagues             │
    │         │                  │              │
    │         │                  └── owner_id ──┘
    │         │
    └──< predictions >── matches >── teams
                              │
                          notifications
```

### Tablas

#### `teams`
```sql
code        text PK          -- "ESP", "BRA", ...
name        text             -- "España"
flag        text             -- emoji "🇪🇸"
group_letter text            -- "A" .. "L"
```

#### `matches`
```sql
id           text PK         -- "ESP-BRA-G1"
jornada_number int           -- 1, 2, 3 (grupos) o 4+ (elim.)
phase        text            -- 'grupos' | 'r32' | 'r16' | 'qf' | 'sf' | 'final'
home_team    text FK→teams
away_team    text FK→teams
kickoff_at   timestamptz
status       text            -- 'scheduled' | 'live' | 'finished'
special      text            -- NULL | 'double' | 'exact'
home_score   int             -- NULL hasta finalizar
away_score   int
```

#### `profiles`
```sql
id           uuid PK FK→auth.users
handle       text UNIQUE     -- @nombre, a-z0-9_
name         text
avatar_color text            -- 'green' | 'yellow' | ...
```

#### `leagues`
```sql
id           uuid PK
name         text
invite_code  text UNIQUE     -- 6 chars uppercase (usada como URL slug)
owner_id     uuid FK→profiles
```

> ⚠️ El `invite_code` es el identificador público de la liga en URLs (`/liga/ABC123`). El UUID se usa únicamente para foreign keys internas.

#### `league_members`
```sql
league_id   uuid FK→leagues  ]
user_id     uuid FK→profiles ] PK compuesto
```

#### `predictions`
```sql
id           uuid PK
user_id      uuid FK→profiles
league_id    uuid FK→leagues
match_id     text FK→matches
pick         text            -- '1' | 'X' | '2'
exact_home   int             -- solo en special='exact'
exact_away   int
points       int             -- calculado por trigger
UNIQUE (user_id, league_id, match_id)
```

---

## Lógica de negocio en base de datos

Toda la lógica crítica vive en PostgreSQL para garantizar consistencia independientemente del cliente.

### Triggers

| Trigger | Evento | Función |
|---|---|---|
| `on_auth_user_created` | `INSERT` en `auth.users` | Auto-crea `profiles` con handle generado |
| `auto_join_owner` | `INSERT` en `leagues` | Añade al creador como miembro automáticamente |
| `no_late_predictions` | `INSERT/UPDATE` en `predictions` | Lanza excepción si `kickoff_at <= now()` |
| `on_match_result` | `UPDATE` de `home_score/away_score/status` | Recalcula `points` para todas las predicciones del partido |

### Sistema de puntos (en trigger `recalc_points_for_match`)

| Tipo de partido | Resultado | Puntos |
|---|---|---|
| Normal | Aciertas 1/X/2 | **+1** |
| Normal | Fallas | 0 |
| `special = 'exact'` | Aciertas marcador exacto | **+3** |
| `special = 'exact'` | Aciertas 1X2 pero fallas marcador | **+1** |
| `special = 'exact'` | Fallas todo | 0 |
| `special = 'double'` | Aciertas | **+2** |
| `special = 'double'` | Fallas | **−1** |

### RPCs (llamadas desde cliente)

```typescript
// Crear liga — security definer para saltarse RLS en INSERT
supabase.rpc('create_league', { league_name: 'Mi Liga' })  // → uuid

// Unirse por código
supabase.rpc('join_league_by_code', { code: 'ABC123' })     // → uuid

// Clasificación completa de una liga
supabase.rpc('get_standings', { league_uuid: '...' })
// → { user_id, handle, name, avatar_color, total_points, hits, predictions_count }[]
```

---

## Row Level Security (RLS)

```
teams / matches          →  lectura pública (sin auth)
profiles                 →  lectura pública · escritura solo el propio usuario
leagues                  →  solo miembros de la liga
league_members           →  solo miembros de la liga
predictions              →  escritura: solo el autor
                            lectura: cualquier miembro DESPUÉS del kickoff
notifications            →  solo el destinatario
```

> La función helper `is_league_member(league_id)` usa `security definer` para evitar recursión infinita en las políticas de `leagues`.

---

## Patrones de componentes

### Server Component con datos

```tsx
// app/liga/[id]/page.tsx
export default async function LigaPage({ params }) {
  const supabase = createClient(); // server client (cookies)
  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('invite_code', params.id)  // params.id = invite_code, no UUID
    .single();

  // Usa league.id (UUID) para FK queries
  const { data: standings } = await supabase
    .rpc('get_standings', { league_uuid: league.id });

  return <LigaView league={league} standings={standings} />;
}
```

### Client Component con mutaciones

```tsx
// app/jornada/[id]/jornada-client.tsx
'use client';
async function updatePick(matchId: string, pick: '1'|'X'|'2') {
  const supabase = createClient(); // browser client
  await supabase.from('predictions').upsert({
    user_id: user.id,
    league_id: leagueId,   // UUID recibido como prop del server component
    match_id: matchId,
    pick,
  }, { onConflict: 'user_id,league_id,match_id' });
}
```

### Separación Server / Client

```
Server Component              Client Component
─────────────────             ────────────────────────
Auth check                    Estado local (useState)
DB queries                    Mutaciones (upsert, update)
Redirects                     Navegación programática
Static HTML                   Animaciones, scroll
RLS enforcement               Interacción de usuario
```

---

## Routing y URLs

```
/                             → redirect a /liga/:code o /onboarding
/login                        → auth (email + password / signup)
/onboarding                   → crear o unirse a liga
/reglas                       → reglas del juego (acepta ?next=)
/liga/:code                   → dashboard de liga
/jornada/:code?j=N            → porra de jornada N (URL param para SSR)
/clasificacion/:code          → clasificación completa
/grupos/:code                 → tabla de grupos del mundial
/resultados/:code             → historial de predicciones del usuario
/perfil                       → perfil y ajustes
```

> El parámetro `:code` es siempre el `invite_code` de 6 caracteres (ej: `ABC123`), no el UUID interno.

---

## Design system

### Tokens de color (oklch)

```css
/* globals.css */
--fv-bg:          oklch(0.09  0.010 150)   /* negro estadio */
--fv-surface:     oklch(0.13  0.013 150)   /* tarjeta */
--fv-surface-2:   oklch(0.18  0.016 150)   /* tarjeta elevada */
--fv-line:        oklch(0.26  0.018 150)   /* bordes */
--fv-ink:         oklch(0.97  0.008 130)   /* texto principal */
--fv-muted:       oklch(0.58  0.016 140)   /* texto secundario */
--fv-accent:      oklch(0.76  0.19  148)   /* verde Furvo */
--fv-flash:       oklch(0.88  0.20  105)   /* amarillo highlight */
--fv-live:        oklch(0.65  0.22   28)   /* rojo live */
```

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `--fv-serif` | Instrument Serif | Headings, logo, nombres de liga |
| `--fv-sans` | Inter Tight | Cuerpo, botones, etiquetas |
| `--fv-mono` | JetBrains Mono | Códigos, marcadores, badges |

### Clases de layout responsive

```css
.fv-page          /* padding-left: sidebar-width en desktop */
.fv-page-header   /* sticky glass header con blur */
.fv-tabbar        /* oculto en ≥768px (sustituido por sidebar) */
.fv-mobile-only   /* oculto en ≥768px */
.fv-desktop-only  /* oculto en <768px */
.fv-liga-grid     /* 1col mobile → 3fr 2fr desktop */
.fv-match-grid    /* 1col mobile → 2col desktop */
.fv-groups-grid   /* 1col mobile → 3col desktop */
```

---

## Variables de entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

> Solo estas dos variables son necesarias. La `anon key` es pública por diseño — la seguridad la proveen las políticas RLS.

---

## Setup local

```bash
# 1. Clonar e instalar
git clone <repo>
cd furvo-nextjs
npm install

# 2. Variables de entorno
cp .env.example .env.local
# Rellenar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Inicializar base de datos
# Pegar supabase/schema.sql en el SQL Editor de tu proyecto Supabase

# 4. Cargar datos del Mundial
# Pegar supabase/seed_mundial.sql (48 equipos, 72 partidos)

# 5. Generar tipos TypeScript (opcional pero recomendado)
npm run types:gen  # requiere supabase CLI y project ID

# 6. Arrancar
npm run dev        # → http://localhost:3000
```

---

## Decisiones de arquitectura relevantes

### ¿Por qué no Prisma / Drizzle?

El BaaS de Supabase incluye autogeneración de tipos desde el schema, cliente JS tipado y RLS enforcement. Añadir un ORM duplicaría la capa de acceso a datos sin aportar valor real en un proyecto de este tamaño.

### ¿Por qué CSS inline en vez de Tailwind?

Los tokens de diseño son todos `oklch` — una paleta de color que Tailwind no soporta bien sin configuración extensa. El CSS inline + custom properties da control total sobre el design system sin overhead de configuración.

### ¿Por qué la lógica de puntos en triggers y no en el servidor?

Centralizar el cálculo en PostgreSQL garantiza consistencia: no importa qué cliente actualice el resultado (admin, script, webhook), los puntos se recalculan siempre igual. Elimina también race conditions.

### ¿Por qué `invite_code` como slug de URL?

Los UUIDs (`b4acdd17-88dc-48de-b925-7ed79830ccc8`) son URLs ilegibles. El `invite_code` (6 chars, ya único) produce URLs amigables (`/liga/ABC123`) sin necesidad de una tabla de slugs separada.

---

## Realtime (en desarrollo)

Las tablas `predictions` y `matches` están publicadas en `supabase_realtime`. Para activar actualizaciones en vivo:

```tsx
useEffect(() => {
  const channel = supabase
    .channel('match-updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'matches',
    }, (payload) => {
      // actualizar estado local
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}, []);
```

---

## Próximos pasos técnicos

- [ ] Activar Realtime en `jornada-client.tsx` para marcadores en vivo
- [ ] Webhook o cron job para actualizar resultados desde una API de fútbol
- [ ] PWA manifest + service worker para instalación en home screen
- [ ] Rate limiting en RPCs para prevenir predicciones masivas automatizadas
- [ ] `supabase/migrations/` con versionado de schema (actualmente un único `schema.sql`)
