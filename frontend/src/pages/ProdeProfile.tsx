import { useState, useEffect } from 'react'
import { predictions, rankings } from '../api/endpoints'
import type { RankingEntry, Prediction } from '../types'

export default function ProdeProfile() {
  const [stats, setStats] = useState<RankingEntry | null>(null)
  const [predList, setPredList] = useState<Prediction[]>([])
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('app_user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setUserName(u.name || '')
        setUserEmail(u.email || '')
      } catch { /* ignore */ }
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [rankingRes, predRes] = await Promise.all([
        rankings.me(),
        predictions.myPredictions(),
      ])
      setStats(rankingRes)
      setPredList(predRes)
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

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  return (
    <div className="prode-profile">
      <h2 style={{ color: '#e0e0e0', marginBottom: '1.5rem' }}>Mi Perfil</h2>

      <div className="prode-profile-card">
        <h2>Información Personal</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={userName} readOnly />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" value={userEmail} readOnly />
        </div>
      </div>

      <div className="prode-profile-card">
        <h2>Estadísticas</h2>
        <div className="prode-stats-summary">
          <div className="prode-stat-card total">
            <div className="stat-value">{stats?.totalPoints ?? 0}</div>
            <div className="stat-label">Puntos</div>
          </div>
          <div className="prode-stat-card exact">
            <div className="stat-value">{exact}</div>
            <div className="stat-label">Exactos</div>
          </div>
          <div className="prode-stat-card correct">
            <div className="stat-value">{correct}</div>
            <div className="stat-label">Aciertos</div>
          </div>
          <div className="prode-stat-card wrong">
            <div className="stat-value">{wrong}</div>
            <div className="stat-label">Errados</div>
          </div>
        </div>
      </div>

      <div className="prode-profile-card">
        <h2>Resumen</h2>
        <div className="prode-stats-summary">
          <div className="prode-stat-card total">
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="prode-stat-card total">
            <div className="stat-value">{predList.length}</div>
            <div className="stat-label">Total Pronósticos</div>
          </div>
          <div className="prode-stat-card total">
            <div className="stat-value">{stats?.position ?? '-'}</div>
            <div className="stat-label">Posición</div>
          </div>
        </div>
      </div>
    </div>
  )
}
