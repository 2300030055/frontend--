import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Calendar, Award, ClipboardCheck, FolderKanban, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

  useEffect(() => {
    api.get('/sessions/upcoming').then((r) => setUpcoming(r.data)).catch(() => {});
    api.get('/attendance/my-stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Present', value: stats.present, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Absent', value: stats.absent, color: 'text-red-600 bg-red-50' },
    { label: 'Total Sessions', value: stats.total, color: 'text-indigo-600 bg-indigo-50' },
  ];

  const quickLinks = [
    { to: '/student/profile', icon: FolderKanban, label: 'View Profile', desc: 'Your club details' },
    { to: '/student/project', icon: FolderKanban, label: 'Project Details', desc: 'Team & problem statement' },
    { to: '/student/sessions', icon: Calendar, label: 'Sessions', desc: 'Calendar & upcoming' },
    { to: '/student/certificates', icon: Award, label: 'Certificates', desc: 'Download yours' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user.name}!</h1>
        <p className="text-slate-500">Student Dashboard · {user.idNumber}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${c.color}`}>
              <ClipboardCheck size={14} className="mr-1 mt-0.5" />
              {c.label}
            </div>
            <p className="text-3xl font-bold mt-3 text-slate-800">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-lg mb-4">Absent Sessions</h2>
          {stats.absentDates?.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.absentDates.map((a, i) => (
                <div key={i} className="flex justify-between text-sm p-2 bg-red-50 rounded-lg">
                  <span className="text-red-700">{a.sessionTitle || 'Session'}</span>
                  <span className="text-red-500">{a.date ? format(new Date(a.date), 'dd MMM yyyy') : '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No absences recorded</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" /> Upcoming Sessions
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-slate-400 text-sm">No upcoming sessions</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((s) => (
                <div key={s._id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(s.date), 'dd MMM yyyy')} · {s.startTime}–{s.endTime} · {s.venue}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link to="/student/sessions" className="inline-flex items-center gap-1 text-sm text-indigo-600 mt-4 font-medium">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-lg mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((q) => (
              <Link key={q.to} to={q.to} className="p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors">
                <q.icon size={18} className="text-indigo-600 mb-2" />
                <p className="font-medium text-sm">{q.label}</p>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
