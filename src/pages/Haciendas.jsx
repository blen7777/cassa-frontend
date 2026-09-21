import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'

const EMPTY_FORM = { nombre: '', ubicacion: '', estatus: true }

export default function Haciendas() {
  const navigate = useNavigate()
  const [haciendas, setHaciendas] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchHaciendas = () => {
    setLoading(true)
    return api
      .get('/haciendas')
      .then((response) => setHaciendas(response.data))
      .catch(() => toast.error('No se pudieron cargar las haciendas'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHaciendas()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (hacienda) => {
    setEditing(hacienda)
    setForm({
      nombre: hacienda.nombre ?? '',
      ubicacion: hacienda.ubicacion ?? '',
      estatus: hacienda.estatus,
    })
    setFormOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/haciendas/${editing.id}`, form)
        toast.success('Hacienda actualizada')
      } else {
        await api.post('/haciendas', form)
        toast.success('Hacienda creada')
      }
      setFormOpen(false)
      await fetchHaciendas()
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
      await api.delete(`/haciendas/${deleting.id}`)
      toast.success('Hacienda eliminada')
      setDeleting(null)
      await fetchHaciendas()
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'No se pudo eliminar')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Haciendas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra los terrenos. Haz clic en una fila para ver sus lotes.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Nueva hacienda
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner />
        ) : haciendas.length === 0 ? (
          <div className="p-6">
            <EmptyState message="Aún no hay haciendas registradas." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Ubicación</th>
                <th className="px-6 py-3">Estatus</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {haciendas.map((hacienda) => (
                <tr
                  key={hacienda.id}
                  onClick={() => navigate(`/haciendas/${hacienda.id}/lotes`)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{hacienda.nombre}</td>
                  <td className="px-6 py-4 text-slate-600">{hacienda.ubicacion || '—'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge active={hacienda.estatus} />
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => openEdit(hacienda)}
                      className="mr-2 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(hacienda)}
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
        title={editing ? 'Editar hacienda' : 'Nueva hacienda'}
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Ubicación</label>
            <input
              type="text"
              maxLength={255}
              value={form.ubicacion}
              onChange={(event) => setForm({ ...form, ubicacion: event.target.value })}
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
        title="Eliminar hacienda"
        message={`¿Seguro que deseas eliminar "${deleting?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
