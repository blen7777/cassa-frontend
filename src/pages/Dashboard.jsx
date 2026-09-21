import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import Spinner from '../components/Spinner'

const CARDS = [
  { key: 'haciendas_activas', label: 'Haciendas activas', icon: '🌾', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'lotes_activos', label: 'Lotes activos', icon: '🧩', color: 'bg-amber-100 text-amber-700' },
  { key: 'responsables_activos', label: 'Responsables activos', icon: '👥', color: 'bg-sky-100 text-sky-700' },
]

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((response) => setSummary(response.data))
      .catch(() => toast.error('No se pudo cargar el resumen del dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Panorama general de la operación agrícola.
      </p>

      {loading ? (
        <Spinner label="Cargando resumen..." />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {summary?.[card.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
