import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Shield, Users, Award, Settings, Upload, ArrowRight } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ students: 0, admins: 0, sessions: 0, certs: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/students?role=student'),
      api.get('/settings/admins'),
      api.get('/sessions'),
      api.get('/certificates/all'),
    ]).then(([s, a, sess, c]) => {
      setStats({ students: s.data.length, admins: a.data.length, sessions: sess.data.length, certs: c.data.length });
    }).catch(() => {});
  }, []);

  const links = [
    { to: '/super-admin/students', icon: Users, label: 'Students', desc: `${stats.students} enrolled`, color: 'bg-emerald-50 text-emerald-600' },
    { to: '/super-admin/admins', icon: Shield, label: 'Manage Admins', desc: `${stats.admins} admins`, color: 'bg-violet-50 text-violet-600' },
    { to: '/super-admin/import', icon: Upload, label: 'Import Data', desc: 'CSV bulk import', color: 'bg-blue-50 text-blue-600' },
    { to: '/super-admin/sessions', icon: Settings, label: 'Programs & Sessions', desc: `${stats.sessions} sessions`, color: 'bg-amber-50 text-amber-600' },
    { to: '/super-admin/certificates', icon: Award, label: 'Certificates', desc: `${stats.certs} issued`, color: 'bg-rose-50 text-rose-600' },
    { to: '/super-admin/settings', icon: Settings, label: 'Club Settings', desc: 'Logos & config', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-slate-500">Full control over WebApps Club Management System</p>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800">
        <strong>Super Admin privileges:</strong> Manage admins, edit attendance for 24 hours, delete sessions, club settings, and bulk certificate generation.
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
