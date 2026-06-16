import { useEffect, useState } from 'react'
import { periods } from '../api/endpoints'
import type { MonthlyPeriod } from '../types'

export default function Periods() {
  const [list, setList] = useState<MonthlyPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => periods.list().then(setList).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      await periods.create({ year, month })
      setShowModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear período')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = async (id: number) => {
    if (!confirm('¿Cerrar este período? No se podrán modificar gastos.')) return
    try { await periods.close(id); await load() }
    catch (err) { alert(err instanceof Error ? err.message : 'Error') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este período definitivamente?')) return
    try { await periods.delete(id); await load() }
    catch (err) { alert(err instanceof Error ? err.message : 'Error') }
  }

  return (
    <>
      <div className="topbar">
        <h2>Períodos Mensuales</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Período</button>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Período</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan={5} className="text-center" style={{ padding: 40, color: 'var(--text-light)' }}>Sin períodos registrados</td></tr>
                  )}
                  {list.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td><strong>{months[p.month - 1]} {p.year}</strong></td>
                      <td>
                        <span className={`badge ${p.isClosed ? 'badge-danger' : 'badge-success'}`}>
                          {p.isClosed ? 'Cerrado' : 'Abierto'}
                        </span>
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                          {!p.isClosed && (
                            <button className="btn btn-warning btn-sm" onClick={() => handleClose(p.id)}>Cerrar</button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Período</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Año</label>
                  <input type="number" className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))} min={2020} max={2100} />
                </div>
                <div className="form-group">
                  <label>Mes</label>
                  <select className="form-control" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {months.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? 'Guardando…' : 'Crear Período'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
