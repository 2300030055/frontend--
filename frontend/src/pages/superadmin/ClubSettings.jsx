import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Save } from 'lucide-react';

export default function ClubSettings() {
  const [settings, setSettings] = useState({ clubName: '', defaultStudentPassword: 'webapps@123' });
  const [clubLogo, setClubLogo] = useState(null);
  const [sacLogo, setSacLogo] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/settings').then((r) => setSettings(r.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('clubName', settings.clubName);
    formData.append('defaultStudentPassword', settings.defaultStudentPassword);
    if (clubLogo) formData.append('clubLogo', clubLogo);
    if (sacLogo) formData.append('sacLogo', sacLogo);

    try {
      const res = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSettings(res.data);
      setMessage('Settings saved!');
    } catch {
      setMessage('Failed to save');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Club Settings</h1>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      <form onSubmit={handleSave} className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Club Name</label>
          <input value={settings.clubName} onChange={(e) => setSettings({ ...settings, clubName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Student Password</label>
          <input value={settings.defaultStudentPassword} onChange={(e) => setSettings({ ...settings, defaultStudentPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Club Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setClubLogo(e.target.files[0])} />
          {settings.clubLogo && <img src={`/${settings.clubLogo}`} alt="Club" className="mt-2 h-16 object-contain" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">KL SAC Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setSacLogo(e.target.files[0])} />
          {settings.sacLogo && <img src={`/${settings.sacLogo}`} alt="SAC" className="mt-2 h-16 object-contain" />}
        </div>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
          <Save size={16} /> Save Settings
        </button>
      </form>
    </div>
  );
}
