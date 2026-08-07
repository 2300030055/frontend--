import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Download, Award } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentCertificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    api.get('/certificates/my').then((r) => setCerts(r.data));
  }, []);

  const handleDownload = async (id, eventName) => {
    try {
      const res = await api.get(`/certificates/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${eventName.replace(/\s+/g, '-')}.pdf`;
      a.click();
    } catch {
      alert('Download failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Certificates</h1>
      {certs.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Award size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No certificates yet. Complete events to earn certificates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${c.type === 'appreciation' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.type === 'appreciation' ? 'Appreciation' : 'Participation'}
                  </span>
                  <h3 className="font-semibold mt-2">{c.eventName}</h3>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{c.eventType} · {format(new Date(c.issuedDate), 'dd MMM yyyy')}</p>
                </div>
                <button
                  onClick={() => handleDownload(c._id, c.eventName)}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Download size={14} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
