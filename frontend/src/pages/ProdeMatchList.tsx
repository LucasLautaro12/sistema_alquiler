import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { matches, predictions } from '../api/endpoints'
import type { Match, Prediction, CreatePredictionDto } from '../types'

export default function ProdeMatchList() {
  const navigate = useNavigate()
  const [matchList, setMatchList] = useState<Match[]>([])
  const [myPredictions, setMyPredictions] = useState<Prediction[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [scoreInputs, setScoreInputs] = useState<Record<number, { homeScore: string; awayScore: string }>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [matchRes, predRes] = await Promise.all([
        matches.list(),
        predictions.myPredictions(),
      ])
      setMatchList(matchRes)
      setMyPredictions(predRes)

      const inputs: Record<number, { homeScore: string; awayScore: string }> = {}
      for (const p of predRes) {
        inputs[p.matchId] = { homeScore: String(p.homeScore), awayScore: String(p.awayScore) }
      }
      setScoreInputs(inputs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredMatches = matchList.filter((m) => {
    if (filter === 'upcoming') return m.matchStatus === 'scheduled'
    if (filter === 'finished') return m.matchStatus === 'finished'
    return true
  })

  const getPredictionForMatch = (matchId: number) =>
    myPredictions.find((p) => p.matchId === matchId)

  const handleScoreChange = (matchId: number, side: 'homeScore' | 'awayScore', value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    setScoreInputs((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }))
  }

  const handleSave = async (matchId: number) => {
    const input = scoreInputs[matchId]
    if (!input) return
    const homeScore = parseInt(input.homeScore, 10)
    const awayScore = parseInt(input.awayScore, 10)
    if (isNaN(homeScore) || isNaN(awayScore)) return

    setSaving(matchId)
    try {
      const existing = getPredictionForMatch(matchId)
      const dto: CreatePredictionDto = { matchId, homeScore, awayScore }
      if (existing) {
        await predictions.update(existing.id, dto)
      } else {
        await predictions.create(dto)
      }
      await loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <div>
      <h2 style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>Partidos</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Pronostica el resultado de cada partido
      </p>

      <div className="prode-filters">
        <button className={`prode-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
        <button className={`prode-filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Próximos</button>
        <button className={`prode-filter-btn ${filter === 'finished' ? 'active' : ''}`} onClick={() => setFilter('finished')}>Finalizados</button>
      </div>

      <div className="prode-matches-grid">
        {filteredMatches.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="icon">⚽</div>
            <h3>No hay partidos</h3>
            <p>No se encontraron partidos para este filtro</p>
          </div>
        )}
        {filteredMatches.map((match) => {
          const pred = getPredictionForMatch(match.id)
          const input = scoreInputs[match.id] || { homeScore: '', awayScore: '' }
          const isFinished = match.matchStatus === 'finished'
          return (
            <div key={match.id} className="prode-match-card">
              <div className="prode-match-teams">
                <div className="prode-team">
                  <img src={`https://flagcdn.com/w80/${match.homeTeam.code.toLowerCase()}.png`} alt={match.homeTeam.name} />
                  <span>{match.homeTeam.name}</span>
                </div>
                <div className="prode-score">
                  {isFinished ? (
                    <>
                      <span className="prode-score-display">{match.homeScore}</span>
                      <span className="prode-score-sep">-</span>
                      <span className="prode-score-display">{match.awayScore}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="prode-score-input"
                        value={input.homeScore}
                        onChange={(e) => handleScoreChange(match.id, 'homeScore', e.target.value)}
                        maxLength={2}
                      />
                      <span className="prode-score-sep">-</span>
                      <input
                        type="text"
                        className="prode-score-input"
                        value={input.awayScore}
                        onChange={(e) => handleScoreChange(match.id, 'awayScore', e.target.value)}
                        maxLength={2}
                      />
                    </>
                  )}
                </div>
                <div className="prode-team">
                  <img src={`https://flagcdn.com/w80/${match.awayTeam.code.toLowerCase()}.png`} alt={match.awayTeam.name} />
                  <span>{match.awayTeam.name}</span>
                </div>
              </div>
              <div className="prode-match-info">
                <span>{formatDate(match.matchDate)}</span>
                <span className="prode-match-stage">{match.stage}</span>
                <span className={`prode-match-status ${match.matchStatus}`}>
                  {match.matchStatus === 'scheduled' ? 'Programado' : match.matchStatus === 'finished' ? 'Finalizado' : match.matchStatus === 'in_play' ? 'En vivo' : match.matchStatus}
                </span>
              </div>
              {pred && isFinished && (
                <div className="prode-prediction-badge">
                  <span>Tu pronóstico: </span>{pred.homeScore} - {pred.awayScore}
                  {pred.isScored && <> · <strong>{pred.points} pts</strong></>}
                </div>
              )}
              {!isFinished && (
                <button
                  className="prode-save-btn"
                  onClick={() => handleSave(match.id)}
                  disabled={saving === match.id}
                >
                  {saving === match.id ? 'Guardando…' : pred ? 'Actualizar Pronóstico' : 'Guardar Pronóstico'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
