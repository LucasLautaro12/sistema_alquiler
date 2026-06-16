import { useEffect, useState } from 'react'
import { users } from '../api/endpoints'
import type { User } from '../types'

export default function Users() {
  const [list, setList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm] = useState({ dni: '', name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => users.list().then(setList).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditUser(null)
    setForm({ dni: '', name: '', email: '', password: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (u: User) => {
    setEditUser(u)
    setForm({ dni: String(u.dni), name: u.name, email: u.email, password: '' })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editUser) {
        const payload: Record<string, string> = {}
        if (form.name !== editUser.name) payload.name = form.name
        if (form.email !== editUser.email) payload.email = form.email
        if (form.password) payload.password = form.password
        await users.update(editUser.id, payload)
      } else {
        await users.create({
          dni: Number(form.dni),
          name: form.name,
          email: form.email,
          password: form.password,
        })
      }
      setShowModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try { await users.delete(id); await load() }
    catch (err) { alert(err instanceof Error ? err.message : 'Error') }
  }

  return (
    <>
      <div className="topbar">
        <h2>Usuarios</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Usuario</button>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan={6} className="text-center" style={{ padding: 40, color: 'var(--text-light)' }}>Sin usuarios registrados</td></tr>
                  )}
                  {list.map((u) => (
                    <tr key={u.id}>
                      <td>{u.dni}</td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>{u.role === 'admin' ? 'Admin' : 'Usuario'}</span></td>
                      <td><span className={`badge ${u.status ? 'badge-success' : 'badge-danger'}`}>{u.status ? 'Activo' : 'Inactivo'}</span></td>
                      <td className="text-right">
                        <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>DNI</label>
                <input type="number" className="form-control" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} disabled={!!editUser} />
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{editUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
                <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editUser ? '••••••' : ''} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando…' : editUser ? 'Actualizar' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
