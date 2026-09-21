# CASSA Agrícola — Frontend (React + Vite)

Aplicación web para la prueba técnica full-stack agrícola: login, dashboard,
y CRUD de haciendas, lotes y responsables. Repo hermano del backend:
[`cassa-backend`](https://github.com/blen7777/cassa-backend) (Laravel).

> **Spec-driven development:** todo cambio futuro debe partir de lo documentado
> en [`specs/`](./specs/requirements.md) (requerimientos, diseño técnico y
> tareas). Si un cambio no está reflejado ahí, actualizar los specs primero.

## Requisitos

- Node.js 18+ y npm
- Backend (`cassa-backend`) corriendo en `http://127.0.0.1:8000`

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

## Estructura del proyecto

```
frontend/
├── src/
│   ├── api/client.js          # axios, baseURL "/api" (proxy de Vite)
│   ├── context/
│   │   ├── AuthContext.jsx    # login estático + sesión (sessionStorage)
│   │   └── ThemeContext.jsx   # modo claro/oscuro (localStorage)
│   ├── routes/ProtectedRoute.jsx  # guarda de rutas → /login
│   ├── layouts/MainLayout.jsx     # sidebar + logout + toggle de tema
│   ├── pages/                     # Login, Dashboard, Haciendas, Responsables, Lotes
│   └── components/                # Modal, ConfirmModal, Spinner, EmptyState,
│                                   # StatusBadge, ThemeToggle
├── specs/                     # Requerimientos, diseño y tareas (spec-driven dev)
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   └── requirements/prueba-tecnica-fullstack.pdf
└── vite.config.js             # proxy /api → backend, alias "@" → src/
```
