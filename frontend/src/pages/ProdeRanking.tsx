import { useState, useEffect } from 'react'
import { rankings } from '../api/endpoints'
import type { RankingEntry } from '../types'

export default function ProdeRanking() {
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const stored = localStorage.getItem('app_user')
    if (stored) {
      try { setCurrentUserId(JSON.parse(stored).id) } catch { /* ignore */ }
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await rankings.global()
      setEntries(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getPodiumClass = (pos: number) => {
    if (pos === 1) return 'gold'
    if (pos === 2) return 'silver'
    if (pos === 3) return 'bronze'
    return ''
  }

  const getMedal = (pos: number) => {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return ''
  }

  const top3 = entries.filter((e) => e.position <= 3)
  const rest = entries.filter((e) => e.position > 3)

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <div>
      <h2 style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>Ranking Global</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Tabla de posiciones del Prode Mundial 2026
      </p>

      {top3.length > 0 && (
        <div className="prode-podium">
          {top3.map((entry) => (
            <div key={entry.id} className={`prode-podium-item ${getPodiumClass(entry.position)}`}>
              <div className="medal">{getMedal(entry.position)}</div>
              <div className="name">{entry.name}</div>
              <div className="points">{entry.totalPoints}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>pts</div>
            </div>
          ))}
        </div>
      )}

      <table className="prode-ranking-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Usuario</th>
            <th>Puntos</th>
            <th>Exactos</th>
            <th>Aciertos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className={entry.id === currentUserId ? 'is-current-user' : ''}>
              <td>
                <span className={`position ${entry.position <= 3 ? `top-${entry.position}` : ''}`}>
                  {entry.position <= 3 ? getMedal(entry.position) : `#${entry.position}`}
                </span>
              </td>
              <td>{entry.name}</td>
              <td style={{ fontWeight: 700, color: '#f5c518' }}>{entry.totalPoints}</td>
              <td>{entry.exactPredictions}</td>
              <td>{entry.correctOutcomes}</td>
              <td>{entry.totalPredictions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
