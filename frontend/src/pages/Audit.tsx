import { useEffect, useState } from 'react'
import { audit } from '../api/endpoints'
import type { AuditLog } from '../types'

export default function Audit() {
  const [data, setData] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 50

  useEffect(() => {
    setLoading(true)
    audit.list(page, limit).then((res) => {
      setData(res.data)
      setTotal(res.total)
    }).finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / limit)

  const getActionBadge = (action: string) => {
    const map: Record<string, string> = { CREATE: 'badge-success', UPDATE: 'badge-warning', DELETE: 'badge-danger' }
    return <span className={`badge ${map[action] ?? 'badge-info'}`}>{action}</span>
  }

  return (
    <>
      <div className="topbar">
        <h2>Bitácora de Auditoría</h2>
        <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{total} registros</span>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <>
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tabla</th>
                      <th>Registro</th>
                      <th>Acción</th>
                      <th>Usuario</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 && (
                      <tr><td colSpan={6} className="text-center" style={{ padding: 40, color: 'var(--text-light)' }}>Sin registros de auditoría</td></tr>
                    )}
                    {data.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{log.tableName}</td>
                        <td>{log.recordId}</td>
                        <td>{getActionBadge(log.action)}</td>
                        <td>{log.userId ?? '—'}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span style={{ fontSize: 14, color: 'var(--text-light)' }}>Página {page} de {totalPages}</span>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
                  <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
