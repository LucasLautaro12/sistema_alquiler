import { useState, useEffect } from 'react'
import { matches, teams, prodeAdmin } from '../api/endpoints'
import type { Team, Match, GroupStanding, KnockoutTemplate, BulkMatchInput } from '../types'

type Tab = 'teams' | 'matches' | 'groups' | 'seed'

export default function ProdeAdmin() {
  const [activeTab, setActiveTab] = useState<Tab>('seed')
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [newMatch, setNewMatch] = useState({ homeTeamId: 0, awayTeamId: 0, matchDate: '', stage: 'group_stage', matchday: 1 })
  const [resultForm, setResultForm] = useState<Record<number, { homeScore: number; awayScore: number }>>({})

  useEffect(() => {
    if (activeTab === 'teams') loadTeams()
    if (activeTab === 'matches') loadMatches()
    if (activeTab === 'groups') loadGroups()
  }, [activeTab])

  async function loadTeams() {
    setLoading(true)
    try {
      const data = await teams.list()
      setAllTeams(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function loadMatches() {
    setLoading(true)
    try {
      const data = await matches.list()
      setAllMatches(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function loadGroups() {
    setLoading(true)
    try {
      const data = await prodeAdmin.getGroups()
      setGroupStandings(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleSeed() {
    if (!confirm('¿Estás seguro? Esto creará el torneo y los 48 equipos si no existen.')) return
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await prodeAdmin.seed()
      setMessage(`Datos inicializados: ${res.teams} equipos creados`)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleCreateMatch() {
    if (!newMatch.homeTeamId || !newMatch.awayTeamId || !newMatch.matchDate) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      const input: BulkMatchInput[] = [{
        homeTeamId: newMatch.homeTeamId,
        awayTeamId: newMatch.awayTeamId,
        matchDate: newMatch.matchDate,
        stage: newMatch.stage,
        matchday: newMatch.matchday,
      }]
      await prodeAdmin.bulkCreateMatches(input)
      setMessage('Partido creado correctamente')
      setNewMatch({ homeTeamId: 0, awayTeamId: 0, matchDate: '', stage: 'group_stage', matchday: 1 })
      loadMatches()
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleSetResult(matchId: number) {
    const r = resultForm[matchId]
    if (!r || r.homeScore === undefined || r.awayScore === undefined) return
    setLoading(true)
    setError('')
    try {
      await matches.updateResult(matchId, r.homeScore, r.awayScore)
      setMessage('Resultado guardado y predicciones puntuadas')
      loadMatches()
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'seed', label: 'Inicializar' },
    { key: 'teams', label: 'Equipos' },
    { key: 'matches', label: 'Partidos' },
    { key: 'groups', label: 'Grupos' },
  ]

  const groupColors: Record<string, string> = {
    A: '#ff6b6b', B: '#feca57', C: '#48dbfb', D: '#ff9ff3',
    E: '#54a0ff', F: '#5f27cd', G: '#01a3a4', H: '#f368e0',
    I: '#ff6348', J: '#7bed9f', K: '#70a1ff', L: '#ffa502',
  }

  return (
    <div className="prode-admin">
      <h1 style={{ color: '#f5c518', marginBottom: '1.5rem' }}>Administración Prode</h1>

      {message && <div className="prode-alert prode-alert-success">{message}
        <button onClick={() => setMessage('')} style={{ marginLeft: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>×</button>
      </div>}
      {error && <div className="prode-alert prode-alert-error">{error}
        <button onClick={() => setError('')} style={{ marginLeft: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>×</button>
      </div>}

      <div className="prode-filters" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button key={t.key} className={`prode-filter-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'seed' && (
        <div className="prode-admin-card">
          <h2>Inicializar Datos del Mundial 2026</h2>
          <p style={{ color: '#999', marginBottom: '1.5rem' }}>
            Crea el torneo "Copa Mundial de la FIFA 2026" y los 48 equipos organizados en 12 grupos (A-L).
            Si ya existen, no se duplicarán.
          </p>
          <button className="prode-save-btn" onClick={handleSeed} disabled={loading} style={{ maxWidth: '300px' }}>
            {loading ? 'Inicializando...' : '🚀 Inicializar Datos'}
          </button>
        </div>
      )}

      {activeTab === 'teams' && (
        <div>
          <div className="prode-admin-card" style={{ marginBottom: '1rem' }}>
            <h2>Equipos ({allTeams.length})</h2>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {allTeams.map(team => (
              <div key={team.id} className="prode-admin-team-card" style={{ background: '#152238', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #1e3050' }}>
                {team.flagUrl && <img src={team.flagUrl} alt={team.name} style={{ width: '32px', height: '32px' }} />}
                <div>
                  <div style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem' }}>{team.name}</div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>Grupo {team.group} · {team.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div>
          <div className="prode-admin-card" style={{ marginBottom: '1.5rem' }}>
            <h2>Crear Partido</h2>
            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              <div className="form-group">
                <label>Equipo Local</label>
                <select value={newMatch.homeTeamId} onChange={e => setNewMatch(p => ({ ...p, homeTeamId: +e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '6px', color: '#e0e0e0' }}>
                  <option value={0}>Seleccionar...</option>
                  {allTeams.map(t => <option key={t.id} value={t.id}>Grupo {t.group} - {t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Equipo Visitante</label>
                <select value={newMatch.awayTeamId} onChange={e => setNewMatch(p => ({ ...p, awayTeamId: +e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '6px', color: '#e0e0e0' }}>
                  <option value={0}>Seleccionar...</option>
                  {allTeams.map(t => <option key={t.id} value={t.id}>Grupo {t.group} - {t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha y Hora</label>
                <input type="datetime-local" value={newMatch.matchDate} onChange={e => setNewMatch(p => ({ ...p, matchDate: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '6px', color: '#e0e0e0' }} />
              </div>
              <div className="form-group">
                <label>Etapa</label>
                <select value={newMatch.stage} onChange={e => setNewMatch(p => ({ ...p, stage: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '6px', color: '#e0e0e0' }}>
                  <option value="group_stage">Fase de Grupos</option>
                  <option value="round_of_32">Dieciseisavos</option>
                  <option value="round_of_16">Octavos</option>
                  <option value="quarterfinals">Cuartos</option>
                  <option value="semifinals">Semifinal</option>
                  <option value="third_place">3er Puesto</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div className="form-group">
                <label>Jornada</label>
                <input type="number" min={1} value={newMatch.matchday} onChange={e => setNewMatch(p => ({ ...p, matchday: +e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '6px', color: '#e0e0e0' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="prode-save-btn" onClick={handleCreateMatch} disabled={loading}>
                  {loading ? 'Creando...' : '➕ Crear Partido'}
                </button>
              </div>
            </div>
          </div>

          <h2 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Partidos ({allMatches.length})</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {allMatches.map(m => (
              <div key={m.id} className="prode-admin-match-row" style={{
                background: '#152238', borderRadius: '8px', padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #1e3050', flexWrap: 'wrap'
              }}>
                <div style={{ minWidth: '80px', fontSize: '0.75rem', color: '#888' }}>
                  {new Date(m.matchDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {m.homeTeam?.flagUrl && <img src={m.homeTeam.flagUrl} style={{ width: '24px', height: '24px' }} />}
                  <span style={{ color: '#e0e0e0', fontWeight: 600, flex: 1, textAlign: 'right' }}>{m.homeTeam?.name}</span>

                  {m.matchStatus === 'finished' ? (
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f5c518', minWidth: '60px', textAlign: 'center' }}>
                      {m.homeScore} - {m.awayScore}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      <input type="number" min={0} max={20} placeholder="?" style={{ width: '36px', height: '36px', textAlign: 'center', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '4px', color: '#fff' }}
                        value={resultForm[m.id]?.homeScore ?? ''}
                        onChange={e => setResultForm(r => ({ ...r, [m.id]: { ...r[m.id], homeScore: +e.target.value } }))} />
                      <span style={{ color: '#666' }}>-</span>
                      <input type="number" min={0} max={20} placeholder="?" style={{ width: '36px', height: '36px', textAlign: 'center', background: '#0d1f3c', border: '1px solid #1e3050', borderRadius: '4px', color: '#fff' }}
                        value={resultForm[m.id]?.awayScore ?? ''}
                        onChange={e => setResultForm(r => ({ ...r, [m.id]: { ...r[m.id], awayScore: +e.target.value } }))} />
                      <button style={{ padding: '0.3rem 0.6rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                        onClick={() => handleSetResult(m.id)}>OK</button>
                    </div>
                  )}

                  {m.awayTeam?.flagUrl && <img src={m.awayTeam.flagUrl} style={{ width: '24px', height: '24px' }} />}
                  <span style={{ color: '#e0e0e0', fontWeight: 600, flex: 1 }}>{m.awayTeam?.name}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'capitalize' }}>
                  {m.stage?.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {groupStandings.map(gs => (
            <div key={gs.group} className="prode-admin-card" style={{ borderTop: `4px solid ${groupColors[gs.group] || '#f5c518'}` }}>
              <h2 style={{ color: groupColors[gs.group] || '#f5c518', marginBottom: '1rem' }}>Grupo {gs.group}</h2>
              <table className="prode-ranking-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>G</th>
                    <th>E</th>
                    <th>P</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {gs.teams.map((t, i) => (
                    <tr key={t.teamId}>
                      <td className={`position ${i < 2 ? 'top-1' : ''}`}>{i + 1}</td>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {t.flagUrl && <img src={t.flagUrl} style={{ width: '20px', height: '20px' }} />}
                        {t.teamName}
                      </td>
                      <td>{t.played}</td>
                      <td>{t.won}</td>
                      <td>{t.drawn}</td>
                      <td>{t.lost}</td>
                      <td>{t.goalsFor}</td>
                      <td>{t.goalsAgainst}</td>
                      <td style={{ color: t.goalDifference > 0 ? '#28a745' : t.goalDifference < 0 ? '#dc3545' : '#888' }}>{t.goalDifference > 0 ? '+' : ''}{t.goalDifference}</td>
                      <td style={{ fontWeight: 800, color: '#f5c518' }}>{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
