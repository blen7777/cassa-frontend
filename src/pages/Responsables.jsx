import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/client'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'

const EMPTY_FORM = { nombre: '', apellido: '', correo: '', telefono: '', estatus: true }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\s-]{7,30}$/

function validate(form) {
  const errors = {}
  const nombre = form.nombre.trim()

  if (!nombre) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.'
  } else if (nombre.length > 150) {
    errors.nombre = 'Máximo 150 caracteres.'
  }

  if (form.apellido && form.apellido.trim().length > 150) {
    errors.apellido = 'Máximo 150 caracteres.'
  }

  if (form.correo) {
    const correo = form.correo.trim()
    if (correo.length > 255) {
      errors.correo = 'Máximo 255 caracteres.'
    } else if (!EMAIL_RE.test(correo)) {
      errors.correo = 'Correo inválido (ej. nombre@dominio.com).'
    }
  }

  if (form.telefono) {
    const telefono = form.telefono.trim()
    if (telefono.length > 30) {
      errors.telefono = 'Máximo 30 caracteres.'
    } else if (!PHONE_RE.test(telefono)) {
      errors.telefono = 'Teléfono inválido (solo números, espacios, +, -, paréntesis).'
    }
  }

  return errors
}

export default function Responsables() {
  const [responsables, setResponsables] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchResponsables = () => {
    setLoading(true)
    return api
      .get('/responsables')
      .then((response) => setResponsables(response.data))
      .catch(() => toast.error('No se pudieron cargar los responsables'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchResponsables()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (responsable) => {
    setEditing(responsable)
    setForm({
      nombre: responsable.nombre ?? '',
      apellido: responsable.apellido ?? '',
      correo: responsable.correo ?? '',
      telefono: responsable.telefono ?? '',
      estatus: responsable.estatus,
    })
    setErrors({})
    setFormOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.')
      return
    }

    const payload = {
      ...form,
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim() || null,
      correo: form.correo.trim() || null,
      telefono: form.telefono.trim() || null,
    }

    setSaving(true)
    try {
      if (editing) {
        await api.put(`/responsables/${editing.id}`, payload)
        toast.success('Responsable actualizado correctamente')
      } else {
        await api.post('/responsables', payload)
        toast.success('Responsable creado correctamente')
      }
      setFormOpen(false)
      await fetchResponsables()
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
      await api.delete(`/responsables/${deleting.id}`)
      toast.success('Responsable eliminado')
      setDeleting(null)
      await fetchResponsables()
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Responsables</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Catálogo del personal a cargo de las operaciones.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Nuevo responsable
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <Spinner />
        ) : responsables.length === 0 ? (
          <div className="p-6">
            <EmptyState message="Aún no hay responsables registrados." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Estatus</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {responsables.map((responsable) => (
                <tr key={responsable.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {responsable.nombre} {responsable.apellido}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{responsable.correo || '—'}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{responsable.telefono || '—'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge active={responsable.estatus} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(responsable)}
                      className="mr-2 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(responsable)}
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
        title={editing ? 'Editar responsable' : 'Nuevo responsable'}
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                required
                maxLength={150}
                value={form.nombre}
                onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.nombre ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200'}`}
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label>
              <input
                type="text"
                maxLength={150}
                value={form.apellido}
                onChange={(event) => setForm({ ...form, apellido: event.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.apellido ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200'}`}
              />
              {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
            <input
              type="email"
              maxLength={255}
              value={form.correo}
              onChange={(event) => setForm({ ...form, correo: event.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.correo ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200'}`}
            />
            {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
            <input
              type="text"
              maxLength={30}
              value={form.telefono}
              onChange={(event) => setForm({ ...form, telefono: event.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.telefono ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200'}`}
            />
            {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
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
        title="Eliminar responsable"
        message={`¿Seguro que deseas eliminar a "${deleting?.nombre} ${deleting?.apellido ?? ''}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
