# Furvo — Plan de Simulación del Mundial 2026

> Documento de referencia para el equipo. Actualizado: Abril 2026.  
> **No ejecutar ninguna fase sin leer primero la sección de Seguridad y Rollback.**

---

## Objetivo

Simular el Mundial 2026 completo en el entorno de **producción real** de Furvo, con usuarios reales haciendo predicciones, para validar el sistema end-to-end antes del torneo oficial. La simulación comprime el tiempo del torneo (originalmente ~40 días) en una secuencia controlada de sesiones de test.

---

## Resumen ejecutivo

| Dimensión | Dato |
|---|---|
| Partidos grupo | 72 (J1–J3, ya en DB) |
| Partidos eliminatorias | 32 (J4–J8, se generan dinámicamente) |
| Total partidos | 104 |
| Equipos | 48 (12 grupos de 4) |
| Fases | 8 jornadas (J1 → J8) |
| Entorno | Producción (Supabase + Vercel) |
| Datos de usuario | Reales — **no se tocan** |
| Rollback disponible | Sí — script `reset.ts` |

---

## Arquitectura de la simulación

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN (tú, local)                                       │
│                                                          │
│  scripts/sim/                                            │
│   ├── status.ts          → estado actual de la simulación│
│   ├── open-window.ts     → abre ventana de predicciones  │
│   ├── run-jornada.ts     → ejecuta una jornada completa  │
│   ├── generate-knockout.ts → genera partidos eliminat.   │
│   └── reset.ts           → reversa total de resultados   │
│                                                          │
│  Conecta via SUPABASE_SERVICE_ROLE_KEY (nunca anon)      │
└─────────────────┬───────────────────────────────────────┘
                  │ UPDATE matches SET status, scores
                  ▼
┌─────────────────────────────────────────────────────────┐
│  SUPABASE (producción)                                   │
│                                                          │
│  trigger: on_match_result                                │
│    → recalcula points en predictions                     │
│    → automático, sin intervención manual                 │
└─────────────────┬───────────────────────────────────────┘
                  │ clasificación en tiempo real
                  ▼
┌─────────────────────────────────────────────────────────┐
│  USUARIOS REALES                                         │
│  Ven resultados, puntos y clasificación actualizados     │
└─────────────────────────────────────────────────────────┘
```

---

## Agentes recomendados

Se proponen **4 agentes especializados** para las distintas fases de la simulación. Cada uno tiene un rol acotado y no interfiere con los demás.

### Agente 1 — Score Generator (`claude-code`)
**Cuándo:** Antes de ejecutar cualquier jornada.  
**Qué hace:** Genera marcadores realistas para todos los partidos de una jornada usando pesos basados en el ranking FIFA implícito de cada grupo. Produce un fichero `fixtures/jornada-N.json` con los scores, revisable antes de aplicar.  
**Por qué un agente:** La generación de 24 marcadores coherentes (que respeten la lógica de grupos — los favoritos deben ganar más, los empates deben existir) es un trabajo de razonamiento, no solo de SQL.

### Agente 2 — DB Executor (`general-purpose` con Bash)
**Cuándo:** Cuando el admin aprueba el fixture JSON de una jornada.  
**Qué hace:** Lee el JSON, construye los UPDATE SQL y los aplica contra Supabase usando `service_role_key`. Verifica que el número de filas actualizadas coincide con lo esperado.  
**Por qué un agente:** Separa la generación de datos de su aplicación. Si el executor falla a mitad, puede reintentarse sin regenerar los scores.

### Agente 3 — Integrity Validator (`Explore`)
**Cuándo:** Después de cada jornada completada.  
**Qué hace:** Consulta la DB y verifica: ¿todos los partidos tienen score? ¿la suma de puntos de cada usuario es matemáticamente correcta? ¿hay predicciones huérfanas? ¿las clasificaciones tienen los mismos usuarios que `league_members`?  
**Por qué un agente:** La validación requiere múltiples queries cruzadas. Un agente puede razonar sobre inconsistencias que un script simple no detectaría.

### Agente 4 — Knockout Bracket Generator (`general-purpose`)
**Cuándo:** Tras completar J3 (última jornada de grupos).  
**Qué hace:** Lee los standings de cada grupo, determina los 24 clasificados (top 2 de cada grupo + 8 mejores terceros según reglas FIFA), genera los 16 enfrentamientos de R32 con el orden correcto del bracket oficial, e inserta los partidos en `matches` con status `scheduled`.  
**Por qué un agente:** La lógica de clasificación de "mejores terceros" del Mundial 2026 es compleja (depende de los grupos comparados). Un agente puede razonar sobre esta lógica mejor que un script hard-coded.

---

## Cronograma de ejecución

### Modelo de tiempo comprimido

Cada **sesión de simulación** representa una jornada completa. Entre sesiones hay una **ventana de predicciones** donde los usuarios pueden predecir. Sugerencia:

```
Día 0  (hoy)          → Setup + comunicar a usuarios
Día 1  (mañana 9h)    → Abrir ventana J1 → cerrar 14h → ejecutar J1
Día 2  (9h)           → Abrir ventana J2 → cerrar 14h → ejecutar J2
Día 3  (9h)           → Abrir ventana J3 → cerrar 14h → ejecutar J3
Día 3  (16h)          → Generar bracket R32 (Agente 4)
Día 4  (9h)           → Abrir ventana J4 (R32) → cerrar 14h → ejecutar J4
...
Día 8  (tarde)        → Final simulada — análisis de resultados
```

> El timing es completamente flexible. Se puede comprimir más (horas) o expandir (días). Lo importante es que los usuarios tengan un tiempo razonable para predecir antes de cada cierre.

---

## Fases técnicas detalladas

### Fase 0 — Setup y seguridad

```bash
# 1. Añadir variable de entorno LOCAL (nunca commitear)
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Settings → API → service_role

# 2. Instalar dependencias del script
npm install @supabase/supabase-js tsx dotenv --save-dev

# 3. Verificar estado actual de la simulación
npx tsx scripts/sim/status.ts
```

**Checklist antes de empezar:**
- [ ] `service_role_key` configurada localmente (no en .env.local del proyecto)
- [ ] Backup manual de la tabla `predictions` exportado desde Supabase
- [ ] Al menos 2 usuarios reales registrados en la liga de prueba
- [ ] Todos los partidos J1–J3 tienen `status = 'scheduled'`
- [ ] Script `reset.ts` probado en un partido aislado

---

### Fase 1 — Grupo de control (1 partido)

**Propósito:** Verificar que el pipeline completo funciona antes de ejecutar una jornada entera.

```bash
# Simular solo 1 partido de J1
npx tsx scripts/sim/run-jornada.ts --match MEX-RSA-G1 --home 2 --away 0
```

**Validaciones esperadas:**
- El partido aparece como `finished` en la UI
- Los usuarios que predijeron 1 (México gana) tienen +1 punto
- Los usuarios que predijeron X o 2 tienen 0 puntos
- La clasificación de la liga se actualiza en tiempo real

---

### Fase 2 — Jornadas de grupo (J1, J2, J3)

```
Por cada jornada:
  1. Agente 1 genera fixtures/jornada-N.json con 24 scores
  2. Admin revisa y aprueba (o modifica) el JSON
  3. Agente 2 aplica los updates → trigger recalcula puntos
  4. Agente 3 valida integridad de datos
  5. Esperar siguiente sesión
```

**Estructura del fixture JSON:**
```json
{
  "jornada": 1,
  "generated_at": "2026-04-25T10:00:00Z",
  "matches": [
    {
      "id": "MEX-RSA-G1",
      "home_score": 2,
      "away_score": 0,
      "rationale": "México favorito en casa, Sudáfrica débil en grupos"
    }
  ]
}
```

---

### Fase 3 — Bracket eliminatorias (post J3)

**Reglas de clasificación FIFA 2026:**
- Top 2 de cada grupo (12 grupos × 2 = 24 clasificados)
- 8 mejores terceros de los 12 grupos (según puntos, GD, GF)
- Total: 32 equipos en R32

```bash
# Agente 4 genera el bracket y lo inserta en DB
npx tsx scripts/sim/generate-knockout.ts --phase r32
```

Los partidos generados tendrán:
- `status = 'scheduled'`
- `jornada_number = 4`
- `phase = 'r32'`
- `kickoff_at` en el futuro inmediato (ventana de predicciones)

---

### Fase 4 — Eliminatorias (J4–J8)

Mismo flujo que la fase de grupos pero con progresión automática del bracket:

```
J4 (R32, 16 partidos)  → ganadores avanzan a R16
J5 (R16,  8 partidos)  → ganadores avanzan a QF
J6 (QF,   4 partidos)  → ganadores avanzan a SF
J7 (SF,   2 partidos)  → ganadores a Final, perdedores a 3er puesto
J8 (Final + 3º, 2)     → campeón determinado
```

> En eliminatorias no puede haber empate. Si el score generado es empate, se añade el campo `extra_time_winner` para determinar el clasificado sin cambiar el marcador oficial. *(Esta lógica se añade en la Fase de desarrollo.)*

---

### Fase 5 — Análisis post-simulación

**Métricas a evaluar:**
- Distribución de puntos entre usuarios (¿está balanceado?)
- % de predicciones correctas por jornada (¿el sistema es justo?)
- Tiempo de respuesta de la clasificación tras actualizar resultados
- Errores o inconsistencias detectados por el Agente 3

**Queries de análisis (Supabase SQL Editor):**
```sql
-- Distribución de puntos en la liga
select pr.name, sum(p.points) as total, count(*) as predictions
from predictions p
join profiles pr on pr.id = p.user_id
group by pr.name
order by total desc;

-- Puntos por jornada
select m.jornada_number, sum(p.points) as pts_totales
from predictions p
join matches m on m.id = p.match_id
group by m.jornada_number
order by m.jornada_number;

-- Tasa de acierto global
select
  count(*) filter (where points > 0)::float / count(*) as hit_rate
from predictions
where points is not null;
```

---

## Seguridad y rollback

### Principios de seguridad

1. **Los datos de usuario nunca se modifican.** Los scripts solo hacen `UPDATE` en `matches` (scores + status). Las `predictions` y `profiles` son de solo lectura para los scripts.

2. **`service_role_key` solo local.** Nunca commitear ni pasar a Vercel. Solo existe en el entorno de desarrollo del admin.

3. **Idempotencia.** Todos los scripts son seguros de re-ejecutar. Si un UPDATE ya fue aplicado, no produce efectos secundarios.

4. **Validación antes de aplicar.** El Agente 2 muestra un preview de los cambios y pide confirmación antes de ejecutar.

### Plan de rollback

```bash
# Revertir resultados de una jornada específica
npx tsx scripts/sim/reset.ts --jornada 2

# Revertir simulación completa (mantiene predictions intactas)
npx tsx scripts/sim/reset.ts --all
```

**Lo que hace `reset.ts`:**
```sql
-- Para los partidos de la jornada indicada:
UPDATE matches SET
  home_score = NULL,
  away_score = NULL,
  status = 'scheduled'
WHERE jornada_number = $1;

-- El trigger recalcula: points vuelven a NULL
-- Las predictions del usuario se mantienen intactas
```

---

## Estructura de ficheros a desarrollar

```
scripts/
└── sim/
    ├── config.ts              # Supabase admin client (service_role)
    ├── status.ts              # Estado actual: qué jornadas están completas
    ├── generate-scores.ts     # Agente 1: genera fixture JSON
    ├── run-jornada.ts         # Agente 2: aplica fixture a DB
    ├── validate-jornada.ts    # Agente 3: validación de integridad
    ├── generate-knockout.ts   # Agente 4: bracket eliminatorias
    └── reset.ts               # Rollback de resultados

fixtures/                      # Generados por Agente 1, revisados por admin
    ├── jornada-1.json
    ├── jornada-2.json
    └── ...
```

---

## Orden de desarrollo recomendado

Antes del primer test real, implementar en este orden:

1. **`config.ts`** — cliente admin con `service_role_key`
2. **`status.ts`** — para verificar estado en cualquier momento
3. **`reset.ts`** — siempre tener rollback antes de avanzar
4. **`run-jornada.ts`** — el core de la simulación
5. **`validate-jornada.ts`** — integridad post-ejecución
6. **`generate-scores.ts`** — generación de marcadores (puede hacerse manual inicialmente)
7. **`generate-knockout.ts`** — solo necesario tras J3

---

## Consideraciones pendientes de decisión

| Decisión | Opciones | Recomendación |
|---|---|---|
| Velocidad de simulación | Horas / días / manual | **Manual por jornada** — más control |
| Generación de scores | Random / weighted / pre-scripted | **Weighted** — más realismo |
| Empates en eliminatorias | Ignorar / penaltis / extra time | **Campo `extra_time_winner`** — DB limpia |
| Comunicación a usuarios | Email / WhatsApp / in-app | **In-app banner** (añadir al liga page) |
| ¿Resetear después? | Sí / No | **No** — los datos son válidos para análisis |

---

## Estado actual

- [x] Schema y triggers de puntos en producción
- [x] 72 partidos de grupos en DB (`status = 'scheduled'`)
- [x] Usuarios reales pueden predecir
- [ ] Scripts de simulación por desarrollar
- [ ] Fixture JSON J1 por generar
- [ ] Agentes configurados
- [ ] Comunicación a usuarios de inicio de simulación
