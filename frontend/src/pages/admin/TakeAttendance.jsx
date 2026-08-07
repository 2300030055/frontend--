import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Save } from 'lucide-react';

export default function TakeAttendance({ editWindow = '15 minutes' }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/sessions').then((r) => setSessions(r.data));
  }, []);

  useEffect(() => {
    if (selectedSession) {
      api.get(`/attendance/students-for-session/${selectedSession}`).then((r) => setStudents(r.data));
    }
  }, [selectedSession]);

  const toggleStatus = (idx) => {
    setStudents((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        attendanceStatus: updated[idx].attendanceStatus === 'present' ? 'absent' : 'present',
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/attendance/mark', {
        sessionId: selectedSession,
        records: students.map((s) => ({
          studentId: s._id,
          status: s.attendanceStatus || 'absent',
        })),
      });
      setMessage(`Attendance saved! Edit window: ${editWindow}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Take Attendance</h1>
        <p className="text-sm text-slate-500">Edit window: {editWindow} after marking</p>
      </div>

      <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} className="w-full max-w-md px-4 py-2.5 border rounded-xl bg-white">
        <option value="">Select a session</option>
        {sessions.map((s) => (
          <option key={s._id} value={s._id}>{s.title} — {new Date(s.date).toLocaleDateString()}</option>
        ))}
      </select>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      {selectedSession && (
        <>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-3 font-mono text-xs">{s.idNumber}</td>
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.branch}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(i)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.attendanceStatus === 'present'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {s.attendanceStatus === 'present' ? 'Present' : 'Absent'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </>
      )}
    </div>
  );
}
