# Tareas — Frontend

Estado respecto a [`requirements.md`](./requirements.md).

- [x] `AuthContext` + credenciales estáticas + limpieza en logout — HU1
- [x] `ProtectedRoute` (route guard) — HU1
- [x] Toggle mostrar/ocultar password (ícono de ojo) — HU1
- [x] Decisión documentada: token refresh, rate limit y hash de password fuera de alcance (ver `requirements.md`) — HU1
- [x] `MainLayout` con sidebar y logout — HU2
- [x] Enrutamiento con React Router (`App.jsx`) — HU2
- [x] `cursor-pointer` global en botones/links/filas accionables — HU2
- [x] Modo claro/oscuro (`ThemeContext`, `ThemeToggle`, persistido en localStorage) — HU2
- [x] `Dashboard` con 3 cards conectadas a `/api/dashboard/summary` — HU3
- [x] Tabla "Detalle por hacienda" (lotes/hectáreas) vía `/api/dashboard/haciendas-overview` — HU3
- [x] CRUD `Responsables` (listar/crear/editar/eliminar + estatus) — HU4
- [x] CRUD `Haciendas` + navegación a `/haciendas/:id/lotes` — HU5
- [x] CRUD `Lotes` filtrado por hacienda (vía `useParams`) — HU6
- [x] `ConfirmModal` en los 3 deletes
- [x] Toasts (éxito/error), spinners de carga, `EmptyState`
- [x] `npm run build` sin errores (verificado)

## Pendiente / mejoras futuras

- [ ] Verificación visual manual en navegador (el chequeo automatizado con
      Chrome tooling falló por un problema de entorno ajeno al código —
      pendiente de confirmación humana)
- [ ] Tests de componentes (React Testing Library)
- [ ] Manejo de loading states granular por acción (crear vs. eliminar)
