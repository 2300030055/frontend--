import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Users, ClipboardCheck, Upload, Calendar, Award, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, sessions: 0, certs: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/students?role=student'),
      api.get('/sessions'),
      api.get('/certificates/all'),
    ]).then(([s, sess, c]) => {
      setStats({ students: s.data.length, sessions: sess.data.length, certs: c.data.length });
    }).catch(() => {});
  }, []);

  const links = [
    { to: '/admin/students', icon: Users, label: 'Manage Students', desc: `${stats.students} students`, color: 'bg-blue-50 text-blue-600' },
    { to: '/admin/import', icon: Upload, label: 'Import CSV', desc: 'Bulk import from SAC', color: 'bg-violet-50 text-violet-600' },
    { to: '/admin/attendance', icon: ClipboardCheck, label: 'Take Attendance', desc: 'Mark present/absent', color: 'bg-emerald-50 text-emerald-600' },
    { to: '/admin/sessions', icon: Calendar, label: 'Sessions', desc: `${stats.sessions} sessions`, color: 'bg-amber-50 text-amber-600' },
    { to: '/admin/certificates', icon: Award, label: 'Certificates', desc: `${stats.certs} issued`, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">Manage students, attendance, and sessions</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> You can edit student data within 15 minutes of submission. Attendance edits follow the same 15-minute window.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${l.color} mb-3`}>
              <l.icon size={20} />
            </div>
            <h3 className="font-semibold">{l.label}</h3>
            <p className="text-sm text-slate-500 mt-1">{l.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm text-indigo-600 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
