import { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getToken, clearToken } from '../api/client'
import { useEffect, useState } from 'react'
import type { User } from '../types'

interface AlquilerLayoutProps { children: ReactNode }

export default function AlquilerLayout({ children }: AlquilerLayoutProps) {
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
      title: 'General',
      items: [
        { path: '/alquiler', label: 'Dashboard', icon: '📊' },
        { path: '/alquiler/periodos', label: 'Períodos', icon: '📅' },
      ],
    },
    {
      title: 'Gestión',
      items: [
        { path: '/alquiler/usuarios', label: 'Usuarios', icon: '👥' },
        { path: '/alquiler/gastos', label: 'Gastos', icon: '💰' },
        { path: '/alquiler/pagos', label: 'Pagos', icon: '💳' },
        { path: '/alquiler/aportes', label: 'Aportes Efectivo', icon: '🏦' },
      ],
    },
    {
      title: 'Reportes',
      items: [
        { path: '/alquiler/reportes', label: 'Resumen', icon: '📈' },
      ],
    },
    {
      title: 'Auditoría',
      items: [
        { path: '/alquiler/auditoria', label: 'Bitácora', icon: '📋' },
      ],
    },
  ]

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' active' : ''}`

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>🏠 Alquiler Compartido</h1>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === '/alquiler'}>
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
          <button className="btn-logout" onClick={() => navigate('/home')} style={{ marginBottom: '8px' }}>
            Volver al inicio
          </button>
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
