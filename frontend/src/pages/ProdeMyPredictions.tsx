import { useState, useEffect } from 'react'
import { predictions } from '../api/endpoints'
import type { Prediction } from '../types'

export default function ProdeMyPredictions() {
  const [predList, setPredList] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await predictions.myPredictions()
      setPredList(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exact = predList.filter((p) => p.isScored && p.isExact).length
  const correct = predList.filter((p) => p.isScored && p.isCorrectOutcome && !p.isExact).length
  const wrong = predList.filter((p) => p.isScored && !p.isCorrectOutcome && !p.isExact).length
  const pending = predList.filter((p) => !p.isScored).length
  const totalPoints = predList.reduce((sum, p) => sum + (p.points || 0), 0)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <div>
      <h2 style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>Mis Pronósticos</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Historial de todos tus pronósticos
      </p>

      <div className="prode-stats-summary">
        <div className="prode-stat-card exact">
          <div className="stat-value">{exact}</div>
          <div className="stat-label">Exactos (6 pts)</div>
        </div>
        <div className="prode-stat-card correct">
          <div className="stat-value">{correct}</div>
          <div className="stat-label">Aciertos (3 pts)</div>
        </div>
        <div className="prode-stat-card wrong">
          <div className="stat-value">{wrong}</div>
          <div className="stat-label">Errados (0 pts)</div>
        </div>
        <div className="prode-stat-card total">
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Puntos Totales</div>
        </div>
      </div>

      <div className="prode-predictions-list">
        {predList.length === 0 && (
          <div className="empty-state">
            <div className="icon">📝</div>
            <h3>Sin pronósticos</h3>
            <p>Aún no has realizado ningún pronóstico</p>
          </div>
        )}
        {predList.map((pred) => {
          const itemClass = !pred.isScored ? 'is-pending' : pred.isExact ? 'is-exact' : pred.isCorrectOutcome ? 'is-correct' : 'is-wrong'
          const pointsClass = !pred.isScored ? 'pending' : pred.isExact ? 'exact' : pred.isCorrectOutcome ? 'correct' : 'wrong'

          return (
            <div key={pred.id} className={`prode-prediction-item ${itemClass}`}>
              <div className="prode-prediction-match">
                <div className="match-teams">
                  {pred.match.homeTeam.name} vs {pred.match.awayTeam.name}
                </div>
                <div className="match-date">{formatDate(pred.match.matchDate)} · {pred.match.stage}</div>
              </div>
              <div className="prode-prediction-scores">
                <span className="pred">{pred.homeScore}</span>
                <span className="sep">-</span>
                <span className="pred">{pred.awayScore}</span>
                {pred.isScored && (
                  <>
                    <span className="sep">→</span>
                    <span className="real">{pred.match.homeScore}</span>
                    <span className="sep">-</span>
                    <span className="real">{pred.match.awayScore}</span>
                  </>
                )}
              </div>
              <div className={`prode-prediction-points ${pointsClass}`}>
                {pred.isScored ? `${pred.points} pts` : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
