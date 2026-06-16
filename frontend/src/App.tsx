import { Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './api/client'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Periods from './pages/Periods'
import Expenses from './pages/Expenses'
import Payments from './pages/Payments'
import Contributions from './pages/Contributions'
import Reports from './pages/Reports'
import Audit from './pages/Audit'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={getToken() ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/periodos" element={<ProtectedRoute><Periods /></ProtectedRoute>} />
      <Route path="/gastos" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/pagos" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/aportes" element={<ProtectedRoute><Contributions /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/auditoria" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
