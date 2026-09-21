export default function EmptyState({ message = 'No hay registros para mostrar.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
      <span className="text-3xl">🗂️</span>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}
