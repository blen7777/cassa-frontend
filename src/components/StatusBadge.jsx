export default function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
      }`}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}
