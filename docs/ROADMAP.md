# Furvo — Roadmap de Producto

> Actualizado: Abril 2026.  
> Basado en análisis de competidores: SuperBru (2.6M usuarios), Prodefy, Porraza, TusPorras, Predicteroo, Quiniela PRO.

---

## Estado actual — Base v1.0

| Módulo | Estado |
|---|---|
| Ligas privadas con `invite_code` | ✅ |
| Predicciones 1/X/2 por partido | ✅ |
| Marcador exacto (+3 pts) | ✅ |
| Sistema de puntos (trigger SQL automático) | ✅ |
| Clasificación en tiempo real | ✅ |
| Navegador de jornadas | ✅ |
| Vista de grupos (fase de grupos) | ✅ |
| Historial de resultados y predicciones | ✅ |
| Perfil básico (nombre, handle, avatar color) | ✅ |
| Simulación del torneo (scripts `scripts/sim/`) | 🔄 En desarrollo |

---

## Por qué este roadmap

### Análisis competitivo resumido

| App | Usuarios | Lo que hacen bien | Lo que les falta |
|---|---|---|---|
| **SuperBru** | 2.6M | Múltiples ligas, premium, premios globales | Experiencia genérica, no es para grupos pequeños |
| **Prodefy** | Regional | Chat en vivo con GIFs, branding corporativo, notificaciones | Diseño mediocre, UX complicada |
| **TusPorras** | España | Apps nativas, cubre 104 partidos, completamente gratis | Nada diferenciador, sin social |
| **Porraza** | España | Simple, €1.99/persona elimina free-riders | Sin social, sin gamificación |
| **Quiniela PRO** | 200k+ | Reglas custom, modos simple/exacto | Interfaz anticuada, sin diseño |

### Datos clave de retención (industria)
- Usuarios que completan **1 logro el primer día**: retención D30 = **25%** vs **4%** sin logros (Trophy.so)
- Chat en tiempo real durante partidos = **principal driver de sesiones** en Prodefy
- Notificaciones de resultado = **mayor fuente de re-engagement** en apps de predicciones

### Ventaja diferencial de Furvo
Furvo ocupa una posición única: **diseño premium + mercado hispanohablante + foco en grupos pequeños**. Los competidores tienen usuarios masivos pero experiencias genéricas. Furvo puede ganar en **calidad de experiencia**, no en volumen.

---

## Fase 1 — Retención básica
**Plazo sugerido: Primeras 4 semanas post-lanzamiento**  
*Máximo impacto con mínimo desarrollo. Sin esto, los usuarios se van.*

---

### F1.1 — Notificaciones Push (PWA)
**Impacto: 🔴 Crítico · Complejidad: M**

El re-engagement más efectivo en todos los competidores. Sin notificaciones, el usuario solo vuelve si se acuerda.

**Eventos a notificar:**
- ⚽ Partido a punto de empezar (30 min antes) — *"México - Arabia Saudí comienza en 30 min. ¿Has predicho?"*
- 🔔 Resultado disponible — *"¡México 2-0! Revisa tus puntos"*
- 📊 Clasificación actualizada — *"El Cuñado te ha adelantado. Solo 2 pts de diferencia"*
- ⏰ Cierre de predicciones inminente (1h antes del primer partido de la jornada)

**Implementación:**
```
lib/push/
  ├── subscribe.ts        # Supabase tabla push_subscriptions
  ├── send.ts             # Web Push API (VAPID keys)
  └── triggers.ts         # Edge Functions en Supabase
```

**Stack:** Web Push API + Supabase Edge Functions + VAPID keys. 100% gratis hasta ~50k notificaciones/mes.

---

### F1.2 — Realtime en vivo (Supabase Realtime)
**Impacto: 🔴 Crítico · Complejidad: S**

Ya está en la arquitectura pendiente. Cuando un partido está `live` o pasa a `finished`, la clasificación y el marcador se actualizan sin recargar la página.

**Qué actualizar en tiempo real:**
- Marcador del partido en `/jornada`
- Puntos del usuario al terminar un partido
- Posición en la clasificación

**Implementación:** `supabase.channel('matches').on('UPDATE', ...)` en `jornada-client.tsx` y `clasificacion/[id]/page.tsx`.

---

### F1.3 — PWA con App Icon instalable
**Impacto: 🟠 Alto · Complejidad: XS**

Next.js genera el manifest automáticamente. Con un `manifest.json` y los iconos, Furvo aparece en "Añadir a pantalla de inicio" en iOS/Android. Los usuarios que instalan la PWA tienen retención **3x mayor** que los que usan el browser.

```json
// public/manifest.json
{
  "name": "Furvo · Mundial '26",
  "short_name": "Furvo",
  "theme_color": "#0a1a12",
  "background_color": "#0d1f14",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

---

### F1.4 — Compartir resultado por WhatsApp/copy
**Impacto: 🟠 Alto · Complejidad: XS**

Después de cada jornada, botón de share que genera un texto con los puntos del usuario y su posición:

```
⚽ Furvo · Jornada 1
📊 Los Pichi FC — 3er lugar
🎯 4 pts esta jornada (2 aciertos)
🔗 furvo.com/liga/ABC123
```

El usuario lo manda por WhatsApp → sus amigos que no estaban en la liga se apuntan. **Adquisición viral gratuita.**

---

## Fase 2 — Social y Enganche
**Plazo sugerido: 1-2 meses**  
*Convierte el uso individual en hábito de grupo.*

---

### F2.1 — Reactions por partido
**Impacto: 🟠 Alto · Complejidad: M**

Sin llegar a un chat completo (costoso de moderar), reactions rápidas en cada partido terminado. Los usuarios de la liga pueden reaccionar al resultado:

```
México 3-0 Arabia Saudí
😂 × 4   🔥 × 2   💀 × 1
```

**Schema:**
```sql
CREATE TABLE match_reactions (
  match_id  uuid REFERENCES matches,
  league_id uuid REFERENCES leagues,
  user_id   uuid REFERENCES profiles,
  emoji     text CHECK (emoji IN ('🔥','😂','💀','😤','🎉','👏')),
  PRIMARY KEY (match_id, league_id, user_id)
);
```

Esto genera actividad en el feed de la liga incluso cuando no hay predicciones abiertas.

---

### F2.2 — Logros y rachas
**Impacto: 🟠 Alto · Complejidad: M**

Datos del sector: usuarios con **1 logro el primer día** retienen al 25% en D30 vs 4% sin logros. Es la feature de retención con mejor ROI documentado.

**Logros propuestos:**

| Logro | Condición | Icono |
|---|---|---|
| Primera sangre | Primer acierto | 🎯 |
| Adivino | Marcador exacto | ⭐ |
| Perfecto | Jornada completa sin fallos | 🏆 |
| Racha × 3 | 3 aciertos seguidos | 🔥 |
| Racha × 7 | 7 aciertos seguidos | 💫 |
| Oráculo | 5 marcadores exactos en el torneo | 🔮 |
| Leal | Predice las 3 jornadas de grupos | 💪 |
| Campeón | 1er lugar al final del torneo | 👑 |

Los logros se muestran en el perfil como badges y generan notificación al desbloquearse.

---

### F2.3 — Head-to-Head (tú vs un amigo)
**Impacto: 🟡 Medio · Complejidad: M**

Vista que compara directamente dos jugadores de la misma liga: puntos por jornada, aciertos, rachas. Accesible desde la clasificación tocando el nombre de otro jugador.

```
Tú vs El Cuñado
⚽ J1: Tú +6 · Cuñado +4  →  Tú +2
⚽ J2: Tú +2 · Cuñado +8  →  Cuñado +6
⚽ J3: ...
Total: Tú 8 · Cuñado 12  💀
```

---

### F2.4 — Joker (apuesta doble)
**Impacto: 🟡 Medio · Complejidad: M**

Un partido "joker" por jornada donde el usuario puede doblar sus puntos. Si falla: 0 puntos (versión conservadora) o -1 (versión agresiva). Ya mencionado en decisiones pendientes de arquitectura.

SuperBru usa esta mecánica con gran éxito. Añade tensión táctica sin cambiar el juego base.

**Schema mínimo:** campo `is_joker boolean` en `predictions`. El trigger de puntos aplica multiplicador ×2.

---

### F2.5 — Chat de jornada (ligero)
**Impacto: 🟠 Alto · Complejidad: L**

Chat básico dentro de cada liga, agrupado por jornada. Sin GIFs ni moderación compleja — solo texto + emojis, con 280 chars máximo. Prodefy considera esto su feature de mayor retención.

**Schema:**
```sql
CREATE TABLE messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id  uuid REFERENCES leagues NOT NULL,
  user_id    uuid REFERENCES profiles NOT NULL,
  jornada    int,
  body       text CHECK (char_length(body) <= 280),
  created_at timestamptz DEFAULT now()
);
```

Realtime via Supabase para entrega inmediata. Accesible desde la tab de Liga.

---

## Fase 3 — Expansión competitiva
**Plazo sugerido: 2-4 meses**  
*Abrir el producto a más casos de uso y más torneos.*

---

### F3.1 — Múltiples ligas simultáneas
**Impacto: 🔴 Crítico · Complejidad: M**

Actualmente el usuario es redirigido a su primera liga. Muchos usuarios querrán estar en la liga de la familia Y la del trabajo. El perfil ya muestra múltiples ligas — solo falta optimizar el switcher y la lógica de nav.

SuperBru permite hasta 10 ligas. Prodefy tiene producto específico para **empresas** con branding corporativo.

**Features relacionados:**
- Liga "Empresa" con logo personalizable
- Ranking global entre todas las ligas del usuario
- Badge "Mejor en ambas ligas"

---

### F3.2 — Bracket visual del torneo
**Impacto: 🟠 Alto · Complejidad: L**

Una vez en eliminatorias, mostrar el cuadro visual del torneo con los equipos clasificados y los enfrentamientos. Clickable para predecir desde el propio bracket.

Diferenciador fuerte vs competidores que solo muestran listas de partidos.

---

### F3.3 — Predicciones de torneo (antes de empezar)
**Impacto: 🟡 Medio · Complejidad: M**

Antes del primer partido, permitir predicciones "macro": quién llega a cuartos, semifinalistas, finalistas, campeón. Puntos bonus que se suman al total. Genera engagement desde el día 0 antes de que empiecen los partidos.

**Puntuación sugerida:**

| Predicción correcta | Puntos |
|---|---|
| Campeón acertado | +15 |
| Finalista acertado | +8 |
| Semifinalista acertado | +4 |
| Cuartofinalista acertado | +2 |

---

### F3.4 — Liga pública global Furvo
**Impacto: 🟡 Medio · Complejidad: S**

Una liga especial `invite_code = 'FURVO26'` donde cualquier usuario registrado entra automáticamente. Ranking global de todos los usuarios. Trofeo virtual para el top 10 al final del torneo.

Genera comunidad y hace que compartir el link de Furvo tenga sentido aunque no tengas amigos en la app.

---

### F3.5 — Estadísticas avanzadas del perfil
**Impacto: 🟡 Medio · Complejidad: M**

Página de perfil con historial completo: tasa de acierto por fase (¿eres mejor en grupos o eliminatorias?), equipos que mejor aciertas, racha más larga, jornada más puntuada.

```sql
-- Acierto por fase
SELECT m.phase,
  COUNT(*) FILTER (WHERE p.points > 0)::float / COUNT(*) as hit_rate
FROM predictions p JOIN matches m ON m.id = p.match_id
WHERE p.user_id = $1
GROUP BY m.phase;
```

---

## Fase 4 — Escala y monetización
**Plazo sugerido: 4+ meses / post-Mundial**

---

### F4.1 — App nativa (React Native / Expo)
**Impacto: 🟠 Alto · Complejidad: XL**

La PWA cubre el 80% del caso de uso, pero los competidores con mejor retención tienen app nativa. Expo permite compartir lógica de negocio con Next.js. Push notifications nativas son más fiables que Web Push en iOS.

**Decisión:** Evaluar tras el Mundial según métricas reales de uso de PWA.

---

### F4.2 — Furvo para empresas
**Impacto: 🟠 Alto · Complejidad: M**

Porraza cobra €1.99/persona. Prodefy tiene un producto corporativo. El segmento empresa es el que más paga y menos se queja.

**Features diferenciales del plan empresa:**
- Logo de la empresa en la liga
- Color brand personalizable
- Exportación CSV de resultados (para el organizador)
- Sin límite de participantes

**Modelo de precio sugerido:** €29 flat por empresa para el torneo completo (ilimitados jugadores).

---

### F4.3 — Torneos adicionales
**Impacto: 🔴 Crítico para largo plazo · Complejidad: L**

El Mundial dura 6 semanas. Para que Furvo sobreviva después necesita más torneos: UEFA Nations League (septiembre 2026), Copa América 2027, Champions 2026-27, Eurocopa 2028.

La arquitectura ya soporta múltiples torneos — solo faltan los partidos en DB y una pantalla de selección de torneo en onboarding.

---

### F4.4 — Predicciones de minuto (live)
**Impacto: 🟡 Medio · Complejidad: XL**

Durante un partido en vivo, predicciones en tiempo real: próximo en marcar, resultado al descanso, penaltis. Alta complejidad operativa (necesita feed de datos en tiempo real externo). **Solo evaluar con patrocinador o modelo freemium.**

---

## Resumen de prioridades

```
AHORA (semana 1-4)
  F1.1 Notificaciones push         🔴 Crítico
  F1.2 Supabase Realtime           🔴 Crítico
  F1.3 PWA instalable              🟠 Alto
  F1.4 Share por WhatsApp          🟠 Alto

CORTO PLAZO (mes 1-2)
  F2.2 Logros y rachas             🟠 Alto  ← mejor ROI de retención
  F2.1 Reactions por partido       🟠 Alto
  F2.4 Joker mechanic              🟡 Medio
  F2.3 Head-to-Head                🟡 Medio
  F2.5 Chat de jornada             🟠 Alto  ← diferenciador social

MEDIO PLAZO (mes 2-4)
  F3.1 Múltiples ligas             🔴 Crítico (crecimiento)
  F3.2 Bracket visual              🟠 Alto
  F3.3 Predicciones de torneo      🟡 Medio
  F3.4 Liga pública Furvo          🟡 Medio

LARGO PLAZO (post-Mundial)
  F4.2 Furvo empresas              🟠 Alto  ← monetización
  F4.3 Torneos adicionales         🔴 Crítico (supervivencia)
  F4.1 App nativa                  🟠 Alto  (evaluar métricas PWA)
  F4.4 Predicciones live           🟡 Bajo  (complejidad alta)
```

---

## Lo que Furvo NO debería hacer

Estos caminos tienen precedente negativo en competidores:

- ❌ **Apuestas con dinero real** — cambia la regulación, el tono y la audiencia
- ❌ **Anuncios intersticiales** — destruye la experiencia que nos diferencia
- ❌ **Forzar registro antes de ver la liga** — barrera innecesaria para el invitado nuevo
- ❌ **Copiar el modelo de Fantasy** (fichajes, plantillas) — ya está muy saturado y es otra app
- ❌ **Notificaciones spam** — degradan el canal; máximo 2 por jornada

---

## Métricas de éxito

| Métrica | Objetivo v1 (Mundial) | Objetivo v2 (post-Mundial) |
|---|---|---|
| DAU durante partidos | > 60% de usuarios activos | > 70% |
| Predicciones por jornada (% completitud) | > 75% | > 80% |
| Retención D7 | > 40% | > 50% |
| Retención D30 | > 20% | > 30% |
| Ligas por usuario | 1 | > 1.5 |
| NPS (encuesta in-app) | > 40 | > 60 |

---

*Furvo · Roadmap vivo — actualizar con métricas reales tras cada jornada simulada.*
