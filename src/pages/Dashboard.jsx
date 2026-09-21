import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

const CARDS = [
  { key: 'haciendas_activas', label: 'Haciendas activas', icon: '🌾', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'lotes_activos', label: 'Lotes activos', icon: '🧩', color: 'bg-amber-100 text-amber-700' },
  { key: 'responsables_activos', label: 'Responsables activos', icon: '👥', color: 'bg-sky-100 text-sky-700' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState([])
  const [overviewLoading, setOverviewLoading] = useState(true)

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((response) => setSummary(response.data))
      .catch(() => toast.error('No se pudo cargar el resumen del dashboard'))
      .finally(() => setLoading(false))

    api
      .get('/dashboard/haciendas-overview')
      .then((response) => setOverview(response.data))
      .catch(() => toast.error('No se pudo cargar el detalle de haciendas'))
      .finally(() => setOverviewLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Panorama general de la operación agrícola.
      </p>

      {loading ? (
        <Spinner label="Cargando resumen..." />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {summary?.[card.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Detalle por hacienda
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Lotes y hectáreas cultivadas por cada hacienda registrada.
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {overviewLoading ? (
            <Spinner label="Cargando detalle..." />
          ) : overview.length === 0 ? (
            <div className="p-6">
              <EmptyState message="Aún no hay haciendas registradas." />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Hacienda</th>
                  <th className="px-6 py-3">Ubicación</th>
                  <th className="px-6 py-3">Estatus</th>
                  <th className="px-6 py-3">Lotes (activos / total)</th>
                  <th className="px-6 py-3">Hectáreas totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {overview.map((hacienda) => (
                  <tr
                    key={hacienda.id}
                    onClick={() => navigate(`/haciendas/${hacienda.id}/lotes`)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {hacienda.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {hacienda.ubicacion || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge active={hacienda.estatus} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {hacienda.lotes_activos_count} / {hacienda.lotes_count}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {Number(hacienda.hectareas_totales).toFixed(2)} ha
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
