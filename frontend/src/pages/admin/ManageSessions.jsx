import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Trash2 } from 'lucide-react';

export default function ManageSessions({ canDelete = false }) {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'session', date: '', venue: '', startTime: '', endTime: '', description: '',
  });
  const [message, setMessage] = useState('');

  const load = () => api.get('/sessions').then((r) => setSessions(r.data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', form);
      setMessage('Session created');
      setShowForm(false);
      setForm({ title: '', type: 'session', date: '', venue: '', startTime: '', endTime: '', description: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this session?')) return;
    await api.delete(`/sessions/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Programs & Sessions</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
          <Plus size={16} /> Add Session
        </button>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Session Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg sm:col-span-2" required />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border rounded-lg">
            <option value="session">Session</option>
            <option value="workshop">Workshop</option>
            <option value="hackathon">Hackathon</option>
            <option value="program">Program</option>
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg sm:col-span-2">Create Session</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div key={s._id} className="bg-white rounded-xl border p-5">
            <div className="flex justify-between">
              <span className="text-xs font-medium uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{s.type}</span>
              {canDelete && (
                <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
              )}
            </div>
            <h3 className="font-semibold mt-2">{s.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{new Date(s.date).toLocaleDateString()} · {s.startTime}–{s.endTime}</p>
            <p className="text-sm text-slate-500">{s.venue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
