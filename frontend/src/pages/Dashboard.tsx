import { useEffect, useState } from 'react'
import { periods, reports } from '../api/endpoints'
import type { MonthlyPeriod, MonthlySummary } from '../types'

export default function Dashboard() {
  const [periodsList, setPeriodsList] = useState<MonthlyPeriod[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    periods.list().then((list) => {
      setPeriodsList(list)
      if (list.length > 0) setSelectedPeriod(list[0].id)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedPeriod) return
    reports.monthlySummary(selectedPeriod).then(setSummary).catch(() => setSummary(null))
  }, [selectedPeriod])

  const selected = periodsList.find((p) => p.id === selectedPeriod)
  const totalNonCash = summary
    ? summary.totalExpenses - summary.rentAmount
    : 0

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <div className="topbar">
        <h2>Dashboard</h2>
        <div className="topbar-actions">
          <select
            className="form-control"
            value={selectedPeriod ?? ''}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            style={{ width: 200 }}
          >
            {periodsList.length === 0 && <option value="">Sin períodos</option>}
            {periodsList.map((p) => (
              <option key={p.id} value={p.id}>
                {months[p.month - 1]} {p.year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="page-content">
        {periodsList.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <h3>No hay períodos registrados</h3>
            <p>Crea un período mensual en la sección Períodos para comenzar.</p>
          </div>
        ) : summary ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Período</div>
                <div className="stat-value">{selected ? `${months[selected.month - 1]} ${selected.year}` : '-'}</div>
                <div className="stat-sub">{selected?.isClosed ? '🔒 Cerrado' : '🟢 Abierto'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Gastos</div>
                <div className="stat-value">S/ {summary.totalExpenses.toFixed(2)}</div>
                <div className="stat-sub">{summary.categoryDetails.length} categorías</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Alquiler (Efectivo)</div>
                <div className="stat-value">S/ {summary.rentAmount.toFixed(2)}</div>
                <div className="stat-sub">Requiere aportes en efectivo</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Gastos No Efectivo</div>
                <div className="stat-value">S/ {totalNonCash.toFixed(2)}</div>
                <div className="stat-sub">Pagado directamente por usuarios</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Usuarios Activos</div>
                <div className="stat-value">{summary.activeUsers}</div>
                <div className="stat-sub">S/ {summary.sharePerUser.toFixed(2)} c/u</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Usuarios con deuda</div>
                <div className="stat-value">{summary.userSummaries.filter((u) => u.cashToPay > 0).length}</div>
                <div className="stat-sub">{summary.userSummaries.filter((u) => u.cashToPay <= 0).length} al día</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-header"><h3>Gastos por Categoría</h3></div>
                <div className="card-body">
                  <table>
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.categoryDetails.length === 0 && (
                        <tr><td colSpan={2} className="text-center" style={{ padding: 20, color: 'var(--text-light)' }}>Sin gastos</td></tr>
                      )}
                      {summary.categoryDetails.map((c, i) => (
                        <tr key={i}>
                          <td>{c.categoryName}</td>
                          <td><strong>S/ {c.amount.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h3>Balance por Usuario</h3></div>
                <div className="card-body">
                  <table>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Ya Pagó</th>
                        <th>Debe Pagar</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.userSummaries.length === 0 && (
                        <tr><td colSpan={4} className="text-center" style={{ padding: 20, color: 'var(--text-light)' }}>Sin usuarios</td></tr>
                      )}
                      {summary.userSummaries.map((u) => {
                        const balance = u.amountAlreadyPaid - u.sharePerUser
                        return (
                          <tr key={u.userId}>
                            <td>{u.userName}</td>
                            <td>S/ {u.amountAlreadyPaid.toFixed(2)}</td>
                            <td>S/ {u.cashToPay.toFixed(2)}</td>
                            <td>
                              <span className={balance >= 0 ? 'positive' : 'negative'}>
                                {balance >= 0 ? '+' : ''}S/ {balance.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">📊</div>
            <h3>Sin datos para este período</h3>
            <p>Registra gastos y pagos para ver el resumen.</p>
          </div>
        )}
      </div>
    </>
  )
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
