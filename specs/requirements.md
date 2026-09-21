# Requerimientos — Prueba Técnica Full-Stack Agrícola (CASSA)

Fuente original: [`requirements/prueba-tecnica-fullstack.pdf`](./requirements/prueba-tecnica-fullstack.pdf).
El detalle completo de todas las HU (incluye backend) vive también en el repo
`cassa-backend/specs/requirements.md` — este documento resume lo que aplica al frontend.

Stack: React + Vite. Repo separado del backend (Laravel).

## HU1 — Autenticación y Protección de Accesos (Login) (15 pts)

- Pantalla de login visualmente atractiva.
- Credenciales estáticas: usuario `devcassa` / contraseña `cassa123` (sin BD/JWT real).
- Todas las rutas internas protegidas; sin sesión activa → redirigir a `/login`.
- Evaluado: route guards, estado global (Context/Zustand/Redux), limpieza de estado en logout.

**Fuera de alcance (decisión explícita, no ambigüedad):** token refresh, rate
limiting y seguridad de password (hash/salt/políticas) **no aplican** — el
enunciado indica textualmente "No es necesario conectar el login a la base de
datos ni implementar JWT real". No hay backend de auth ni password
persistido que proteger. Si en el futuro se reemplaza el login estático por
uno real contra BD, estos puntos deben re-evaluarse aquí antes de implementarse.

**Sí agregado (bajo costo, mejora UX/UI del rubro transversal):** toggle de
mostrar/ocultar contraseña (ícono de ojo) en el input de password.

## HU2 — Estructura Base y Navegación (10 pts)

- Layout principal que envuelve las vistas protegidas.
- Sidebar: Dashboard, Haciendas, Responsables.
- Botón visible de cierre de sesión.
- Evaluado: componentes compartidos (Layout), uso de React Router.

**Mejoras agregadas (fuera del enunciado, entran en "Buena UX" transversal):**
- `cursor: pointer` explícito en todos los elementos accionables (botones, links, filas clicables).
- Modo claro/oscuro con toggle persistente (`localStorage`), detecta preferencia
  del sistema (`prefers-color-scheme`) como valor inicial. Implementado con
  `ThemeContext` + variante `dark:` de Tailwind (estrategia por clase, no por
  media query, para permitir el override manual).

## HU3 — Dashboard Principal (Resumen) (15 pts, frontend + backend)

- Pantalla por defecto tras login.
- 3 cards: Haciendas activas, Lotes activos, Responsables activos, con datos reales del backend.

**Agregado (esencial, no en el enunciado):** tabla "Detalle por hacienda"
debajo de las cards (hacienda, ubicación, estatus, lotes activos/total,
hectáreas totales), consumiendo `/api/dashboard/haciendas-overview`. Clic en
una fila navega a `/haciendas/:id/lotes` — da contexto accionable más allá
de los 3 contadores.

## HU4 — Gestión de Responsables (CRUD) (15 pts, frontend + backend)

- Listado, crear, editar, eliminar. Campo `estatus` (Activo/Inactivo).
- Evaluado en frontend: formularios y validaciones, refresco de UI tras cada operación.

## HU5 — Gestión de Haciendas y Navegación a Lotes (15 pts, frontend + backend)

- Listado con estatus, crear/editar/eliminar.
- Clic en una hacienda → navega a `/haciendas/:id/lotes` pasando el contexto (parámetro de URL).

## HU6 — Gestión de Lotes por Hacienda (CRUD) (10 pts, frontend + backend)

- Listado de lotes filtrado únicamente por la hacienda seleccionada.
- Crear/editar/eliminar lotes vinculados a esa hacienda.
- Evaluado en frontend: manejo de contexto/estado (saber a qué hacienda se agrega el lote).

## Consideraciones transversales (20 pts)

| Criterio | Detalle | Pts |
|---|---|---|
| Prevención de errores | Modal de confirmación antes de eliminar | 5 |
| Diseño moderno (UI) | TailwindCSS / sistema de diseño coherente | 5 |
| Buena UX | Loading states, toasts, estados vacíos | 5 |
| Buenas prácticas | Código limpio, componentes modulares, variables de entorno | 5 |
