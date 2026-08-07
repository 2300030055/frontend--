import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function StudentSessions() {
  const [sessions, setSessions] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    api.get('/sessions').then((r) => setSessions(r.data));
    api.get('/sessions/upcoming').then((r) => setUpcoming(r.data));
  }, []);

  const SessionCard = ({ session, highlight }) => (
    <div className={`bg-white rounded-xl border p-5 shadow-sm ${highlight ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {session.type}
          </span>
          <h3 className="font-semibold text-lg mt-2">{session.title}</h3>
        </div>
        {highlight && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Upcoming</span>}
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Calendar size={14} /> {format(new Date(session.date), 'EEEE, dd MMM yyyy')}</p>
        <p className="flex items-center gap-2"><Clock size={14} /> {session.startTime} – {session.endTime}</p>
        <p className="flex items-center gap-2"><MapPin size={14} /> {session.venue}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Sessions Calendar</h1>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-emerald-700">Upcoming Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((s) => <SessionCard key={s._id} session={s} highlight />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4">All Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-slate-400">No sessions scheduled yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s) => <SessionCard key={s._id} session={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}
