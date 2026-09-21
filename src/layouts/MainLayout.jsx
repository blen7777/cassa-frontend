import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/haciendas', label: 'Haciendas', icon: '🌾' },
  { to: '/responsables', label: 'Responsables', icon: '👥' },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside className="flex w-64 flex-col justify-between bg-slate-900 text-slate-100">
        <div>
          <div className="flex items-center justify-between gap-2 px-6 py-6 text-lg font-bold">
            <span className="flex items-center gap-2">
              <span>🌱</span>
              <span>CASSA Agrícola</span>
            </span>
            <ThemeToggle className="!border-slate-700 !text-slate-300 hover:!bg-slate-800" />
          </div>
          <nav className="mt-4 flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <p className="mb-3 truncate text-xs text-slate-400">
            Sesión: <span className="font-semibold text-slate-200">{user?.username}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-red-600 hover:text-white"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 dark:text-slate-100">
        <Outlet />
      </main>
    </div>
  )
}
