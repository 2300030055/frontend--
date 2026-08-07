import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Trash2 } from 'lucide-react';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ idNumber: '', name: '', role: 'admin', password: '' });
  const [message, setMessage] = useState('');

  const load = () => api.get('/settings/admins').then((r) => setAdmins(r.data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings/admins', form);
      setMessage('Admin added');
      setShowForm(false);
      setForm({ idNumber: '', name: '', role: 'admin', password: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this admin?')) return;
    await api.delete(`/settings/admins/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="ID Number" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 border rounded-lg">
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <input placeholder="Password (optional)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Add</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{a.idNumber}</td>
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.role === 'super_admin' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {a.role !== 'super_admin' && (
                    <button onClick={() => handleDelete(a._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
