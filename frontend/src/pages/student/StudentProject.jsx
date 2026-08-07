import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Save } from 'lucide-react';

export default function StudentProject() {
  const [project, setProject] = useState({ projectTitle: '', problemStatement: '', teamMembers: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/projects/my').then((r) => setProject(r.data)).finally(() => setLoading(false));
  }, []);

  const addMember = () => {
    setProject((p) => ({
      ...p,
      teamMembers: [...p.teamMembers, { idNumber: '', name: '', branch: '' }],
    }));
  };

  const updateMember = (idx, field, value) => {
    setProject((p) => {
      const members = [...p.teamMembers];
      members[idx] = { ...members[idx], [field]: value };
      return { ...p, teamMembers: members };
    });
  };

  const removeMember = (idx) => {
    setProject((p) => ({ ...p, teamMembers: p.teamMembers.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put('/projects/my', project);
      setProject(res.data);
      setMessage('Saved successfully!');
    } catch {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-40 bg-slate-100 rounded-xl" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Details</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          <Save size={16} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            value={project.projectTitle}
            onChange={(e) => setProject({ ...project, projectTitle: e.target.value })}
            placeholder="Enter project title (added by admin later)"
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Problem Statement</label>
          <textarea
            value={project.problemStatement}
            onChange={(e) => setProject({ ...project, problemStatement: e.target.value })}
            placeholder="Describe your problem statement..."
            rows={4}
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Team Members</h2>
          <button onClick={addMember} className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
            <Plus size={16} /> Add Member
          </button>
        </div>
        {project.teamMembers.length === 0 ? (
          <p className="text-slate-400 text-sm">No team members added yet</p>
        ) : (
          <div className="space-y-3">
            {project.teamMembers.map((m, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center p-3 bg-slate-50 rounded-lg">
                <input placeholder="ID Number" value={m.idNumber} onChange={(e) => updateMember(i, 'idNumber', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Name" value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
                <input placeholder="Branch" value={m.branch} onChange={(e) => updateMember(i, 'branch', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
                <button onClick={() => removeMember(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg justify-self-end">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
