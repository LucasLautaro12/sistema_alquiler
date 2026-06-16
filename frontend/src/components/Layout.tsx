import { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getToken, clearToken } from '../api/client'
import { useEffect, useState } from 'react'
import { auth, users } from '../api/endpoints'
import type { User } from '../types'

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!getToken()) return
    const stored = localStorage.getItem('alquiler_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    clearToken()
    localStorage.removeItem('alquiler_user')
    navigate('/login')
  }

  const sections: { title: string; items: { path: string; label: string; icon: string }[] }[] = [
    {
      title: 'General',
      items: [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/periodos', label: 'Períodos', icon: '📅' },
      ],
    },
    {
      title: 'Gestión',
      items: [
        { path: '/usuarios', label: 'Usuarios', icon: '👥' },
        { path: '/gastos', label: 'Gastos', icon: '💰' },
        { path: '/pagos', label: 'Pagos', icon: '💳' },
        { path: '/aportes', label: 'Aportes Efectivo', icon: '🏦' },
      ],
    },
    {
      title: 'Reportes',
      items: [
        { path: '/reportes', label: 'Resumen', icon: '📈' },
      ],
    },
    {
      title: 'Auditoría',
      items: [
        { path: '/auditoria', label: 'Bitácora', icon: '📋' },
      ],
    },
  ]

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' active' : ''}`

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>🏠 Alquiler</h1>
          <span>Compartido</span>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === '/'}>
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
            {user?.email}
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
