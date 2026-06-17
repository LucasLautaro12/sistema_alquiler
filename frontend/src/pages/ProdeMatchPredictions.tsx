import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { matches, predictions } from '../api/endpoints'
import type { Match, Prediction } from '../types'

export default function ProdeMatchPredictions() {
  const { matchId } = useParams<{ matchId: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [predList, setPredList] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (matchId) loadData()
  }, [matchId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [matchRes, predRes] = await Promise.all([
        matches.get(parseInt(matchId!)),
        predictions.byMatch(parseInt(matchId!)),
      ])
      setMatch(matchRes)
      setPredList(predRes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!match) {
    return <div className="empty-state"><h3>Partido no encontrado</h3></div>
  }

  const isFinished = match.matchStatus === 'finished'

  return (
    <div>
      <div className="prode-match-header">
        <div className="teams">
          <div className="team">
            <img src={`https://flagcdn.com/w80/${match.homeTeam.code.toLowerCase()}.png`} alt={match.homeTeam.name} />
            <span>{match.homeTeam.name}</span>
          </div>
          <div className="result">
            {isFinished ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
          </div>
          <div className="team">
            <img src={`https://flagcdn.com/w80/${match.awayTeam.code.toLowerCase()}.png`} alt={match.awayTeam.name} />
            <span>{match.awayTeam.name}</span>
          </div>
        </div>
        <div className="meta">
          {formatDate(match.matchDate)} · {match.stage} · {match.tournament?.name}
        </div>
      </div>

      <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
        Pronósticos ({predList.length})
      </h3>

      {predList.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📝</div>
          <h3>Sin pronósticos</h3>
          <p>No hay pronósticos para este partido aún</p>
        </div>
      ) : (
        <table className="prode-predictions-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Usuario</th>
              <th>Pronóstico</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {predList
              .sort((a, b) => (b.points || 0) - (a.points || 0))
              .map((pred, idx) => {
                const rowClass = !pred.isScored ? '' : pred.isExact ? 'is-exact' : pred.isCorrectOutcome ? 'is-correct' : 'is-wrong'
                return (
                  <tr key={pred.id} className={rowClass}>
                    <td>{idx + 1}</td>
                    <td>{pred.user.name}</td>
                    <td>{pred.homeScore} - {pred.awayScore}</td>
                    <td>{pred.isScored ? `${pred.points} pts` : '—'}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      )}
    </div>
  )
}
