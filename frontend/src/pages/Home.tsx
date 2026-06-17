import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Bienvenido al Sistema</h1>
        <p>Selecciona una aplicación para comenzar</p>
      </div>
      <div className="home-cards">
        <div className="home-card home-card-alquiler" onClick={() => navigate('/alquiler')}>
          <div className="home-card-icon">🏠</div>
          <h2>Sistema de Alquiler</h2>
          <p>Gestión de gastos compartidos, períodos mensuales y reportes</p>
          <span className="home-card-btn">Ingresar →</span>
        </div>
        <div className="home-card home-card-prode" onClick={() => navigate('/prode')}>
          <div className="home-card-icon">🏆</div>
          <h2>Prode Mundial 2026</h2>
          <p>Pronostica los resultados del Mundial y compite en el ranking</p>
          <span className="home-card-btn">Ingresar →</span>
        </div>
      </div>
    </div>
  )
}
