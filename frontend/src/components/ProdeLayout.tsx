import { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getToken, clearToken } from '../api/client'
import { useEffect, useState } from 'react'
import type { User } from '../types'

interface ProdeLayoutProps { children: ReactNode }

export default function ProdeLayout({ children }: ProdeLayoutProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!getToken()) return
    const stored = localStorage.getItem('app_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    clearToken()
    localStorage.removeItem('app_user')
    navigate('/login')
  }

  const sections: { title: string; items: { path: string; label: string; icon: string }[] }[] = [
    {
      title: 'Partidos',
      items: [
        { path: '/prode', label: 'Partidos', icon: '⚽' },
        { path: '/prode/mis-pronosticos', label: 'Mis Pronósticos', icon: '📝' },
      ],
    },
    {
      title: 'Ranking',
      items: [
        { path: '/prode/ranking', label: 'Tabla General', icon: '🏆' },
      ],
    },
    {
      title: 'Perfil',
      items: [
        { path: '/prode/perfil', label: 'Mi Perfil', icon: '👤' },
      ],
    },
    {
      title: 'Admin',
      items: [
        { path: '/prode/admin', label: 'Administración', icon: '⚙️' },
      ],
    },
  ]

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' active' : ''}`

  return (
    <div className="prode-layout">
      <aside className="prode-sidebar">
        <div className="sidebar-header">
          <h1>🏆 Prode Mundial 2026</h1>
          <span>EE.UU., Canadá y México</span>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === '/prode'}>
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.name ?? 'Usuario'}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="btn-logout" onClick={() => navigate('/home')} style={{ marginBottom: '8px' }}>
            Volver al inicio
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="prode-main">
        {children}
      </main>
    </div>
  )
}
