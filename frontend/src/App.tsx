import { Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './api/client'
import AlquilerLayout from './components/AlquilerLayout'
import ProdeLayout from './components/ProdeLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Periods from './pages/Periods'
import Expenses from './pages/Expenses'
import Payments from './pages/Payments'
import Contributions from './pages/Contributions'
import Reports from './pages/Reports'
import Audit from './pages/Audit'
import ProdeMatchList from './pages/ProdeMatchList'
import ProdeMyPredictions from './pages/ProdeMyPredictions'
import ProdeMatchPredictions from './pages/ProdeMatchPredictions'
import ProdeRanking from './pages/ProdeRanking'
import ProdeProfile from './pages/ProdeProfile'
import ProdeAdmin from './pages/ProdeAdmin'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={getToken() ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

      {/* Alquiler System */}
      <Route path="/alquiler" element={<ProtectedRoute><AlquilerLayout><Dashboard /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/usuarios" element={<ProtectedRoute><AlquilerLayout><Users /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/periodos" element={<ProtectedRoute><AlquilerLayout><Periods /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/gastos" element={<ProtectedRoute><AlquilerLayout><Expenses /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/pagos" element={<ProtectedRoute><AlquilerLayout><Payments /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/aportes" element={<ProtectedRoute><AlquilerLayout><Contributions /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/reportes" element={<ProtectedRoute><AlquilerLayout><Reports /></AlquilerLayout></ProtectedRoute>} />
      <Route path="/alquiler/auditoria" element={<ProtectedRoute><AlquilerLayout><Audit /></AlquilerLayout></ProtectedRoute>} />

      {/* Prode System */}
      <Route path="/prode" element={<ProtectedRoute><ProdeLayout><ProdeMatchList /></ProdeLayout></ProtectedRoute>} />
      <Route path="/prode/mis-pronosticos" element={<ProtectedRoute><ProdeLayout><ProdeMyPredictions /></ProdeLayout></ProtectedRoute>} />
      <Route path="/prode/partido/:matchId" element={<ProtectedRoute><ProdeLayout><ProdeMatchPredictions /></ProdeLayout></ProtectedRoute>} />
      <Route path="/prode/ranking" element={<ProtectedRoute><ProdeLayout><ProdeRanking /></ProdeLayout></ProtectedRoute>} />
      <Route path="/prode/perfil" element={<ProtectedRoute><ProdeLayout><ProdeProfile /></ProdeLayout></ProtectedRoute>} />
      <Route path="/prode/admin" element={<ProtectedRoute><ProdeLayout><ProdeAdmin /></ProdeLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
