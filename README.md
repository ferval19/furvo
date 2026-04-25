# Furvo ⚽

> *La porra del Mundial '26. Para que tus amigos te guarden rencor los próximos cuatro años.*

---

**Furvo** es una quiniela privada para el Mundial de Fútbol 2026. Creas una liga con tus amigos, predices resultados antes de cada partido, y la tabla de clasificación hace el trabajo sucio de recordarles quién sabe más de fútbol.

Sin dinero de por medio (eso te lo dejamos a ti). Sin algoritmos raros. Sin publicidad. Solo tú, tus contactos del WhatsApp y las predicciones que vas a defender a muerte aunque estés claramente equivocado.

---

## ¿Qué hace esto exactamente?

- **Ligas privadas** — Creas una liga, le pones un nombre épico, y compartes el código de 6 letras con quien quieras invitar. Solo ellos pueden ver la clasificación.
- **Predicciones antes del pitido** — Antes de que empiece cada partido, dices quién gana (o empate). Después del pitido ya no hay cambios. Sin excusas del tipo "yo lo iba a cambiar".
- **Puntos en tiempo real** — Cuando se actualiza un resultado, los puntos se calculan solos. Nadie tiene que hacer cuentas a mano a las 2 de la mañana.
- **Clasificación de la liga** — Cada liga tiene su propia tabla. Tu cuñado en la posición 7 no puede culpar a nadie más que a sí mismo.
- **Grupos del Mundial** — Puedes ver cómo va la tabla de grupos del torneo, por si quieres contexto para tus predicciones o simplemente sufrir más.

---

## Sistema de puntos

Simple. Justo. Despiadado.

| Lo que pasa | Puntos |
|---|---|
| Aciertas el resultado (1 / X / 2) | **+1** |
| Aciertas el marcador exacto *(partidos especiales)* | **+3** |
| Aciertas 1X2 en un partido especial pero fallas el marcador | **+1** |
| Fallas todo | 0 |
| No predices antes del kickoff | 0, y sin derecho a queja |

Los partidos especiales de **marcador exacto** no tienen el toggle 1/X/2 — escribes el score directamente y el sistema deduce quién gana. Así todos predicen lo mismo. Igualdad de condiciones, no hay trampas.

---

## Estructura del torneo

```
Fase de grupos  →  Jornada 1, 2, 3 (48 partidos en total)
     ↓
Ronda de 32  →  Octavos  →  Cuartos  →  Semifinales  →  Final
```

El Mundial 2026 es el primero con 48 selecciones y 12 grupos de 4. Sí, hay más partidos. Sí, hay más predicciones. Sí, hay más oportunidades de fallar.

---

## Cómo arrancarlo en local

Necesitas Node 18+ y una cuenta de Supabase (el plan gratuito funciona perfectamente).

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Abre .env.local y rellena NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Crear la base de datos
# Ve al SQL Editor de tu proyecto Supabase y ejecuta:
#   supabase/schema.sql   ← tablas, reglas, triggers
#   supabase/seed_mundial.sql  ← 48 equipos y 72 partidos

# 4. Arrancar
npm run dev
# → http://localhost:3000
```

Si todo va bien, en 5 minutos tienes una liga funcionando. Si no va bien, revisa que las variables de entorno estén bien copiadas — el 90% de los problemas son eso.

---

## Filosofía del proyecto

### "Funciona antes de ser bonito"

Cuando hay una duda entre añadir una feature nueva y mejorar algo que ya existe, ganará lo que ya existe. Un flujo roto de predicciones vale más arreglarlo que añadir notificaciones push.

### "El backend no confía en el frontend"

Toda la lógica de negocio crítica (quién puede predecir, cómo se calculan los puntos, cuándo se cierra la predicción) vive en la base de datos como triggers y políticas RLS. El frontend puede mentir; PostgreSQL, no.

### "Una liga, un código, sin fricción"

El código de invitación de 6 letras es también la URL de la liga (`/liga/ABC123`). Sin registros previos para unirse, sin formularios innecesarios. Le mandas el link a alguien, se registra, y en 2 clicks ya está en tu liga.

### "Mobile-first, desktop-friendly"

La mayoría de los usuarios verán el marcador en el móvil en el descanso del partido. El tab bar inferior, el scroll-hide y los tamaños de tap targets están diseñados para eso. El desktop tiene su propia navegación lateral, pero nunca a costa del móvil.

### "Sin estado global artificial"

No hay Redux, Zustand ni Context para datos del servidor. Los Server Components de Next.js hacen el fetch directamente. El estado de las predicciones vive solo donde importa: en la base de datos y en el componente de jornada.

---

## Lo que no hace (intencionadamente)

- **No gestiona dinero.** Si tu liga tiene apuesta económica, eso es cosa vuestra.
- **No tiene chat.** Para eso ya tienes WhatsApp y ya sabemos cómo acaban esas conversaciones.
- **No envía notificaciones push.** *Por ahora.* El sistema de notificaciones está en la base de datos, pero no hay implementación de push todavía.
- **No tiene modo "espectador"** para gente que no está en una liga. O juegas, o no estás.

---

## Convenciones de código

### Nomenclatura de archivos y rutas

- Los parámetros de ruta dinámica son `[id]` en el filesystem de Next.js, pero el valor siempre es el `invite_code` de 6 letras de la liga — nunca un UUID.
- Los Server Components son `page.tsx`. Los Client Components que necesitan interacción tienen el sufijo `-client.tsx` o viven en `/components`.

### Componentes

- El design system completo está en `components/primitives.tsx`. Antes de crear un nuevo componente visual, mira si ya existe algo parecido ahí.
- Los estilos son CSS inline con variables CSS del design system (`var(--fv-accent)`, etc.). No se usa Tailwind.

### Base de datos

- Nunca hagas `SELECT *` en producción si solo necesitas 3 columnas.
- Usa siempre el server client (`lib/supabase/server.ts`) en Server Components y Route Handlers. El browser client (`lib/supabase/client.ts`) solo en Client Components.
- Cualquier cambio de schema va a `supabase/schema.sql`. Mientras no haya migraciones versionadas, ese archivo es la fuente de verdad.

### Commits

No hay reglas rígidas, pero el historial debería poder leerlo alguien que no estuvo en la conversación. "fix bug" no es un commit válido. "fix: predicciones se enviaban después del kickoff en iOS Safari" sí lo es.

---

## Estructura de carpetas resumida

```
app/              Rutas (Next.js App Router)
components/       Componentes compartidos y design system
lib/supabase/     Clientes de Supabase (server y browser)
supabase/         Schema SQL, seeds y futura carpeta de migraciones
```

Para el detalle técnico completo — schema de base de datos, RLS, triggers, patrones de componentes, tokens de diseño — consulta [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Tecnologías usadas

**[Next.js 14](https://nextjs.org)** · **[React 18](https://react.dev)** · **[TypeScript 5](https://typescriptlang.org)** · **[Supabase](https://supabase.com)** · **[Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)** · **[Inter Tight](https://fonts.google.com/specimen/Inter+Tight)** · **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)**

---

*Hecho con ❤️ y mucho pique. Mundial 2026 — que gane el mejor.*
