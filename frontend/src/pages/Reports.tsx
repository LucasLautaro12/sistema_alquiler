import { useEffect, useState } from 'react'
import { reports, periods } from '../api/endpoints'
import type { MonthlySummary, CategoryHistoryItem, UserPaymentHistory, TrendResponse, MonthlyPeriod } from '../types'

export default function Reports() {
  const [periodsList, setPeriodsList] = useState<MonthlyPeriod[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [catHistory, setCatHistory] = useState<CategoryHistoryItem[]>([])
  const [userSummary, setUserSummary] = useState<UserPaymentHistory[]>([])
  const [trends, setTrends] = useState<TrendResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'summary' | 'history' | 'users' | 'trends'>('summary')

  useEffect(() => {
    periods.list().then((list) => {
      setPeriodsList(list)
      if (list.length > 0) setSelectedPeriod(list[0].id)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'history') reports.categoryHistory().then(setCatHistory).catch(() => {})
    if (tab === 'users') reports.userPayments().then(setUserSummary).catch(() => {})
    if (tab === 'trends') reports.trends().then(setTrends).catch(() => {})
  }, [tab])

  useEffect(() => {
    if (selectedPeriod) reports.monthlySummary(selectedPeriod).then(setSummary).catch(() => setSummary(null))
  }, [selectedPeriod])

  const selected = periodsList.find((p) => p.id === selectedPeriod)

  return (
    <>
      <div className="topbar">
        <h2>Reportes</h2>
        <div className="topbar-actions">
          <div className="flex gap-2">
            <button className={`btn btn-sm ${tab === 'summary' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('summary')}>Resumen</button>
            <button className={`btn btn-sm ${tab === 'history' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('history')}>Historial</button>
            <button className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('users')}>Usuarios</button>
            <button className={`btn btn-sm ${tab === 'trends' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('trends')}>Tendencias</button>
          </div>
        </div>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <>
            {tab === 'summary' && (
              <SummaryTab summary={summary} periodsList={periodsList} selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} selected={selected} />
            )}
            {tab === 'history' && <CategoryHistoryTab data={catHistory} />}
            {tab === 'users' && <UserSummaryTab data={userSummary} />}
            {tab === 'trends' && <TrendsTab data={trends} />}
          </>
        )}
      </div>
    </>
  )
}

function SummaryTab({
  summary, periodsList, selectedPeriod, setSelectedPeriod, selected,
}: {
  summary: MonthlySummary | null
  periodsList: MonthlyPeriod[]
  selectedPeriod: number | null
  setSelectedPeriod: (id: number) => void
  selected: MonthlyPeriod | undefined
}) {
  const totalNonCash = summary ? summary.totalExpenses - summary.rentAmount : 0

  return (
    <div className="report-section">
      <div className="mb-4">
        <select className="form-control" value={selectedPeriod ?? ''} onChange={(e) => setSelectedPeriod(Number(e.target.value))} style={{ width: 240 }}>
          {periodsList.map((p) => (
            <option key={p.id} value={p.id}>{months[p.month - 1]} {p.year}</option>
          ))}
        </select>
      </div>
      {summary ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Gastos</div>
              <div className="stat-value">S/ {summary.totalExpenses.toFixed(2)}</div>
              <div className="stat-sub">{selected?.isClosed ? 'Cerrado' : 'Abierto'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Share por Usuario</div>
              <div className="stat-value">S/ {summary.sharePerUser.toFixed(2)}</div>
              <div className="stat-sub">{summary.activeUsers} usuarios</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Alquiler (Efectivo)</div>
              <div className="stat-value">S/ {summary.rentAmount.toFixed(2)}</div>
              <div className="stat-sub">No efectivo: S/ {totalNonCash.toFixed(2)}</div>
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-header"><h3>Gastos por Categoría</h3></div>
              <div className="card-body" style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr><th>Categoría</th><th>Monto</th></tr>
                  </thead>
                  <tbody>
                    {summary.categoryDetails.map((c, i) => (
                      <tr key={i}>
                        <td>{c.categoryName}</td>
                        <td><strong>S/ {c.amount.toFixed(2)}</strong></td>
                      </tr>
                    ))}
                    {summary.categoryDetails.length === 0 && (
                      <tr><td colSpan={2} className="text-center" style={{ padding: 24, color: 'var(--text-light)' }}>Sin gastos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>Balance por Usuario</h3></div>
              <div className="card-body" style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr><th>Usuario</th><th>Pagó</th><th>Debe</th></tr>
                  </thead>
                  <tbody>
                    {summary.userSummaries.map((u) => (
                      <tr key={u.userId}>
                        <td>{u.userName}</td>
                        <td>S/ {u.amountAlreadyPaid.toFixed(2)}</td>
                        <td><span className={u.cashToPay <= 0 ? 'positive' : 'negative'}>S/ {u.cashToPay.toFixed(2)}</span></td>
                      </tr>
                    ))}
                    {summary.userSummaries.length === 0 && (
                      <tr><td colSpan={3} className="text-center" style={{ padding: 24, color: 'var(--text-light)' }}>Sin usuarios</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state"><div className="icon">📊</div><h3>Sin datos</h3><p>Selecciona un período con gastos registrados.</p></div>
      )}
    </div>
  )
}

function CategoryHistoryTab({ data }: { data: CategoryHistoryItem[] }) {
  if (data.length === 0) return <div className="empty-state"><div className="icon">📈</div><h3>Sin datos históricos</h3></div>
  return (
    <div className="report-section">
      {data.map((ch, i) => (
        <div key={i} className="card mb-4">
          <div className="card-header"><h3>{ch.categoryName}</h3></div>
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr><th>Período</th><th>Monto</th></tr>
              </thead>
              <tbody>
                {ch.history.map((h, j) => (
                  <tr key={j}><td>{h.period}</td><td><strong>S/ {h.amount.toFixed(2)}</strong></td></tr>
                ))}
                {ch.history.length === 0 && (
                  <tr><td colSpan={2} className="text-center" style={{ padding: 24, color: 'var(--text-light)' }}>Sin registros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function UserSummaryTab({ data }: { data: UserPaymentHistory[] }) {
  if (data.length === 0) return <div className="empty-state"><div className="icon">👥</div><h3>Sin datos de usuarios</h3></div>
  return (
    <div className="report-section">
      {data.map((us) => (
        <div key={us.userId} className="card mb-4">
          <div className="card-header">
            <h3>{us.userName}</h3>
            <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Total pagado: <strong>S/ {us.totalPaid.toFixed(2)}</strong></span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr><th>Período</th><th>Categoría</th><th>Monto</th><th>Fecha</th></tr>
              </thead>
              <tbody>
                {us.payments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.period}</td>
                    <td>{p.category}</td>
                    <td>S/ {p.amount.toFixed(2)}</td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {us.payments.length === 0 && (
                  <tr><td colSpan={4} className="text-center" style={{ padding: 24, color: 'var(--text-light)' }}>Sin pagos registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function TrendsTab({ data }: { data: TrendResponse | null }) {
  if (!data || data.data.length === 0) return <div className="empty-state"><div className="icon">📉</div><h3>Sin tendencias</h3></div>
  return (
    <div className="card">
      <div className="card-header"><h3>Tendencias Mensuales</h3></div>
      <div className="card-body" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Período</th><th>Total</th><th>Alquiler</th><th>Gas</th><th>Luz/Agua</th><th>Limsa</th><th>Gastos Com.</th></tr>
          </thead>
          <tbody>
            {data.data.map((t, i) => (
              <tr key={i}>
                <td>{t.period}</td>
                <td><strong>S/ {t.totalExpenses.toFixed(2)}</strong></td>
                <td>S/ {t.rent.toFixed(2)}</td>
                <td>S/ {t.gas.toFixed(2)}</td>
                <td>S/ {t.waterElectricity.toFixed(2)}</td>
                <td>S/ {t.limsa.toFixed(2)}</td>
                <td>S/ {t.buildingFees.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
