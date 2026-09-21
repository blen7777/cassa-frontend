import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'

const EMPTY_FORM = { nombre: '', hectareas: '', estatus: true }

export default function Lotes() {
  const { haciendaId } = useParams()
  const [hacienda, setHacienda] = useState(null)
  const [lotes, setLotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    return Promise.all([
      api.get(`/haciendas/${haciendaId}`),
      api.get(`/haciendas/${haciendaId}/lotes`),
    ])
      .then(([haciendaRes, lotesRes]) => {
        setHacienda(haciendaRes.data)
        setLotes(lotesRes.data)
      })
      .catch(() => toast.error('No se pudieron cargar los lotes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haciendaId])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (lote) => {
    setEditing(lote)
    setForm({
      nombre: lote.nombre ?? '',
      hectareas: lote.hectareas ?? '',
      estatus: lote.estatus,
    })
    setFormOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/haciendas/${haciendaId}/lotes/${editing.id}`, form)
        toast.success('Lote actualizado')
      } else {
        await api.post(`/haciendas/${haciendaId}/lotes`, form)
        toast.success('Lote creado')
      }
      setFormOpen(false)
      await fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Ocurrió un error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await api.delete(`/haciendas/${haciendaId}/lotes/${deleting.id}`)
      toast.success('Lote eliminado')
      setDeleting(null)
      await fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'No se pudo eliminar')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <Link to="/haciendas" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Volver a Haciendas
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lotes {hacienda ? `· ${hacienda.nombre}` : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Divisiones de tierra correspondientes a esta hacienda.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Nuevo lote
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner />
        ) : lotes.length === 0 ? (
          <div className="p-6">
            <EmptyState message="Esta hacienda aún no tiene lotes registrados." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Hectáreas</th>
                <th className="px-6 py-3">Estatus</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lotes.map((lote) => (
                <tr key={lote.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{lote.nombre}</td>
                  <td className="px-6 py-4 text-slate-600">{lote.hectareas ?? '—'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge active={lote.estatus} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(lote)}
                      className="mr-2 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(lote)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Editar lote' : 'Nuevo lote'}
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              required
              maxLength={200}
              value={form.nombre}
              onChange={(event) => setForm({ ...form, nombre: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hectáreas</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.hectareas}
              onChange={(event) => setForm({ ...form, hectareas: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.estatus}
              onChange={(event) => setForm({ ...form, estatus: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Activo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title="Eliminar lote"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
