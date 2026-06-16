import { useEffect, useState } from 'react'
import { contributions, periods, users } from '../api/endpoints'
import type { CashContribution, MonthlyPeriod, User } from '../types'

export default function Contributions() {
  const [list, setList] = useState<CashContribution[]>([])
  const [periodsList, setPeriodsList] = useState<MonthlyPeriod[]>([])
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ periodId: 0, userId: 0, amount: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const [c, p, u] = await Promise.all([
      contributions.list(), periods.list(), users.list(),
    ])
    setList(c)
    setPeriodsList(p)
    setUsersList(u.filter((x) => x.status))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ periodId: periodsList[0]?.id ?? 0, userId: 0, amount: '' })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.periodId || !form.userId || !form.amount) {
      setError('Completa todos los campos')
      return
    }
    setSaving(true)
    setError('')
    try {
      await contributions.create({
        periodId: Number(form.periodId),
        userId: Number(form.userId),
        amount: Number(form.amount),
      })
      setShowModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este aporte?')) return
    try { await contributions.delete(id); await load() }
    catch (err) { alert(err instanceof Error ? err.message : 'Error') }
  }

  const getPeriodLabel = (p: MonthlyPeriod | undefined) => p ? `${months[p.month - 1]} ${p.year}` : '-'

  return (
    <>
      <div className="topbar">
        <h2>Aportes en Efectivo</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Aporte</button>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Usuario</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan={5} className="text-center" style={{ padding: 40, color: 'var(--text-light)' }}>Sin aportes registrados</td></tr>
                  )}
                  {list.map((ct) => {
                    const period = periodsList.find((p) => p.id === ct.periodId)
                    const user = usersList.find((u) => u.id === ct.userId)
                    return (
                      <tr key={ct.id}>
                        <td>{getPeriodLabel(period)}</td>
                        <td><strong>{user?.name ?? '—'}</strong></td>
                        <td><strong>S/ {Number(ct.amount).toFixed(2)}</strong></td>
                        <td>{new Date(ct.createdAt).toLocaleDateString()}</td>
                        <td className="text-right">
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ct.id)}>Eliminar</button>
                        </td>
                      </tr>
                    )
                  })}
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
              <h3>Nuevo Aporte en Efectivo</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>Período</label>
                <select className="form-control" value={form.periodId} onChange={(e) => setForm({ ...form, periodId: Number(e.target.value) })}>
                  {periodsList.map((p) => <option key={p.id} value={p.id}>{getPeriodLabel(p)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <select className="form-control" value={form.userId} onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}>
                  <option value={0}>Seleccionar…</option>
                  {usersList.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Monto (S/)</label>
                <input type="number" step="0.01" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando…' : 'Registrar Aporte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
