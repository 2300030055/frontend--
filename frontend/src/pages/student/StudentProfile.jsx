import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();

  const fields = [
    { label: 'ID Number', value: user.idNumber },
    { label: 'Club Name', value: user.clubName || 'WebApps Club' },
    { label: 'Branch', value: user.branch || '—' },
    { label: 'Residency', value: user.residency === 'hostler' ? 'Hostler' : user.residency === 'day_scholar' ? 'Day Scholar' : '—' },
    { label: 'Year', value: user.year || '—' },
    { label: 'Name', value: user.name },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
            {user.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-indigo-200">{user.idNumber}</p>
        </div>
        <div className="p-6 grid gap-4">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{f.label}</span>
              <span className="font-medium text-slate-800">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
