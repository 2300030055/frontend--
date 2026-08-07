import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ManageStudents() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ idNumber: '', name: '', branch: '', residency: '', year: 'Y25' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get(`/students?role=student&search=${search}`).then((r) => setStudents(r.data));
  };

  useEffect(() => { load(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editId) {
        await api.put(`/students/${editId}`, form);
        setMessage('Student updated');
      } else {
        await api.post('/students', form);
        setMessage('Student added');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ idNumber: '', name: '', branch: '', residency: '', year: 'Y25' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this student?')) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const startEdit = (s) => {
    setEditId(s._id);
    setForm({ idNumber: s.idNumber, name: s.name, branch: s.branch, residency: s.residency, year: s.year });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="ID Number" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} className="px-3 py-2 border rounded-lg" required disabled={!!editId} />
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <input placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.residency} onChange={(e) => setForm({ ...form, residency: e.target.value })} className="px-3 py-2 border rounded-lg">
            <option value="">Residency</option>
            <option value="hostler">Hostler</option>
            <option value="day_scholar">Day Scholar</option>
          </select>
          <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="px-3 py-2 border rounded-lg">
            {['Y23', 'Y24', 'Y25', 'Y26'].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">{editId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">ID Number</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Branch</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Year</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{s.idNumber}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{s.branch}</td>
                <td className="px-4 py-3 hidden md:table-cell">{s.year}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button onClick={() => startEdit(s)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded"><Pencil size={14} /></button>
                  {isSuperAdmin && (
                    <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="p-8 text-center text-slate-400">No students found</p>}
      </div>
    </div>
  );
}
