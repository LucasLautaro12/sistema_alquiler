import { useEffect, useState } from 'react'
import { expenses, periods, categories, users } from '../api/endpoints'
import type { MonthlyExpense, MonthlyPeriod, ExpenseCategory, User } from '../types'

export default function Expenses() {
  const [list, setList] = useState<MonthlyExpense[]>([])
  const [periodsList, setPeriodsList] = useState<MonthlyPeriod[]>([])
  const [catsList, setCatsList] = useState<ExpenseCategory[]>([])
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editExpense, setEditExpense] = useState<MonthlyExpense | null>(null)
  const [form, setForm] = useState({ periodId: 0, categoryId: 0, amount: '', paidByUserId: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const [e, p, c, u] = await Promise.all([
      expenses.list(), periods.list(), categories.list(), users.list(),
    ])
    setList(e)
    setPeriodsList(p)
    setCatsList(c)
    setUsersList(u.filter((x) => x.status))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditExpense(null)
    setForm({ periodId: periodsList[0]?.id ?? 0, categoryId: 0, amount: '', paidByUserId: '', notes: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (ex: MonthlyExpense) => {
    setEditExpense(ex)
    setForm({
      periodId: ex.periodId,
      categoryId: ex.categoryId,
      amount: String(ex.amount),
      paidByUserId: ex.paidByUserId ? String(ex.paidByUserId) : '',
      notes: ex.notes ?? '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.periodId || !form.categoryId || !form.amount) {
      setError('Completa los campos obligatorios')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        periodId: Number(form.periodId),
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        paidByUserId: form.paidByUserId ? Number(form.paidByUserId) : undefined,
        notes: form.notes || undefined,
      }
      if (editExpense) {
        await expenses.update(editExpense.id, payload)
      } else {
        await expenses.create(payload as any)
      }
      setShowModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este gasto?')) return
    try { await expenses.delete(id); await load() }
    catch (err) { alert(err instanceof Error ? err.message : 'Error') }
  }

  const getPeriodLabel = (p: MonthlyPeriod | undefined) => p ? `${months[p.month - 1]} ${p.year}` : '-'

  return (
    <>
      <div className="topbar">
        <h2>Gastos Mensuales</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Gasto</button>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Categoría</th>
                    <th>Monto</th>
                    <th>Pagado por</th>
                    <th>Notas</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan={6} className="text-center" style={{ padding: 40, color: 'var(--text-light)' }}>Sin gastos registrados</td></tr>
                  )}
                  {list.map((ex) => {
                    const period = periodsList.find((p) => p.id === ex.periodId)
                    const cat = catsList.find((c) => c.id === ex.categoryId)
                    const user = usersList.find((u) => u.id === ex.paidByUserId)
                    return (
                      <tr key={ex.id}>
                        <td>{getPeriodLabel(period)}</td>
                        <td>{cat?.name ?? '—'}</td>
                        <td><strong>S/ {Number(ex.amount).toFixed(2)}</strong></td>
                        <td>{user?.name ?? '—'}</td>
                        <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.notes ?? '—'}</td>
                        <td className="text-right">
                          <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ex)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ex.id)}>Eliminar</button>
                          </div>
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
              <h3>{editExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>Período *</label>
                <select className="form-control" value={form.periodId} onChange={(e) => setForm({ ...form, periodId: Number(e.target.value) })}>
                  {periodsList.map((p) => <option key={p.id} value={p.id}>{getPeriodLabel(p)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <select className="form-control" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
                  <option value={0}>Seleccionar…</option>
                  {catsList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Monto (S/) *</label>
                <input type="number" step="0.01" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Pagado por</label>
                <select className="form-control" value={form.paidByUserId} onChange={(e) => setForm({ ...form, paidByUserId: e.target.value })}>
                  <option value="">Sin asignar</option>
                  {usersList.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando…' : editExpense ? 'Actualizar' : 'Crear Gasto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
