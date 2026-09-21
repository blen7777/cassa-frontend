# CASSA Agrícola — Frontend (React + Vite)

Aplicación web para la prueba técnica full-stack agrícola.

> **Spec-driven development:** todo cambio futuro debe partir de lo documentado
> en [`specs/`](./specs/requirements.md) (requerimientos, diseño técnico y
> tareas). Si un cambio no está reflejado ahí, actualizar los specs primero.

## Puesta en marcha

```bash
npm install
npm run dev
```

Levanta en `http://localhost:5173`. El proxy de Vite (`vite.config.js`)
redirige `/api/*` hacia `http://127.0.0.1:8000` (backend Laravel), por lo
que no se necesita configurar CORS ni variables de entorno en desarrollo.
Para apuntar a otro backend, definir `VITE_API_URL` en un `.env`.

## Credenciales de acceso (Login)

```text
Usuario:    devcassa
Contraseña: cassa123
```

## Estructura

- `src/context/AuthContext.jsx` — autenticación estática y sesión (sessionStorage).
- `src/routes/ProtectedRoute.jsx` — guarda de rutas, redirige a `/login`.
- `src/layouts/MainLayout.jsx` — layout con sidebar y logout.
- `src/pages/` — Login, Dashboard, Haciendas, Responsables, Lotes.
- `src/components/` — Modal, ConfirmModal, Spinner, EmptyState, StatusBadge.
