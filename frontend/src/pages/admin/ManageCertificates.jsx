import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Upload, Award } from 'lucide-react';

export default function ManageCertificates() {
  const [certs, setCerts] = useState([]);
  const [bulkForm, setBulkForm] = useState({ eventName: '', type: 'participation', eventType: 'session' });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/certificates/all').then((r) => setCerts(r.data));
  }, []);

  const handleBulk = async (e) => {
    e.preventDefault();
    if (!file || !bulkForm.eventName) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventName', bulkForm.eventName);
    formData.append('type', bulkForm.type);
    formData.append('eventType', bulkForm.eventType);

    try {
      const res = await api.post('/certificates/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      api.get('/certificates/all').then((r) => setCerts(r.data));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Certificates</h1>

      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <h2 className="font-semibold flex items-center gap-2 mb-4"><Upload size={18} /> Bulk Generate from Excel/CSV</h2>
        <p className="text-sm text-slate-500 mb-4">Upload CSV with <code className="bg-slate-100 px-1 rounded">id_number</code> and <code className="bg-slate-100 px-1 rounded">name</code> columns</p>
        <form onSubmit={handleBulk} className="space-y-4">
          <input placeholder="Event Name" value={bulkForm.eventName} onChange={(e) => setBulkForm({ ...bulkForm, eventName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <div className="grid grid-cols-2 gap-4">
            <select value={bulkForm.type} onChange={(e) => setBulkForm({ ...bulkForm, type: e.target.value })} className="px-3 py-2 border rounded-lg">
              <option value="participation">Participation</option>
              <option value="appreciation">Appreciation</option>
            </select>
            <select value={bulkForm.eventType} onChange={(e) => setBulkForm({ ...bulkForm, eventType: e.target.value })} className="px-3 py-2 border rounded-lg">
              <option value="session">Session</option>
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="program">Program</option>
            </select>
          </div>
          <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
            {loading ? 'Generating...' : 'Generate Certificates'}
          </button>
        </form>
        {result && <p className="mt-4 text-sm text-green-700">Generated {result.generated} certificates. {result.errors?.length} errors.</p>}
      </div>

      <div>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Award size={18} /> Issued Certificates ({certs.length})</h2>
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3">{c.student?.name} ({c.student?.idNumber})</td>
                  <td className="px-4 py-3">{c.eventName}</td>
                  <td className="px-4 py-3 capitalize">{c.type}</td>
                  <td className="px-4 py-3">{new Date(c.issuedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
