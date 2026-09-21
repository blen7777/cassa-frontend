# Diseño técnico — Frontend

Ver requerimientos en [`requirements.md`](./requirements.md).

## Stack

React 19 + Vite + React Router 7 + Tailwind 4 + axios + react-hot-toast.

## Estado y autenticación

- `src/context/AuthContext.jsx`: Context API. Valida credenciales estáticas
  (`devcassa` / `cassa123`), persiste la sesión en `sessionStorage` (sobrevive
  refresh, se limpia al cerrar pestaña o al hacer logout).
- `src/routes/ProtectedRoute.jsx`: guarda de rutas — si no hay sesión, redirige
  a `/login` conservando la ruta de origen (`state.from`) para volver tras login.

## Enrutamiento (`src/App.jsx`)

```
/login                          → Login (pública)
/dashboard                      → Dashboard        (protegida, dentro de MainLayout)
/haciendas                      → Haciendas         (protegida)
/haciendas/:haciendaId/lotes    → Lotes             (protegida, contexto por parámetro de URL)
/responsables                   → Responsables      (protegida)
/                                → redirect a /dashboard
```

## Componentes compartidos (`src/components/`)

- `Modal.jsx` — contenedor genérico para formularios.
- `ConfirmModal.jsx` — confirmación de eliminación (usado en las 3 entidades).
- `Spinner.jsx`, `EmptyState.jsx`, `StatusBadge.jsx` — feedback de UX.

## Capa de datos (`src/api/client.js`)

axios con `baseURL` = `/api` (proxy de Vite hacia el backend Laravel en dev,
evita configurar CORS localmente). Override vía `VITE_API_URL` si el backend
está en otro host.

## Decisiones

- Context API en vez de Redux/Zustand: alcance pequeño (un solo estado de
  auth), evita dependencia extra bajo la ventana de tiempo de la prueba.
- `sessionStorage` en vez de `localStorage`: la sesión es "falsa" (no hay JWT
  real), tiene sentido que no sobreviva entre pestañas/reinicios largos.
