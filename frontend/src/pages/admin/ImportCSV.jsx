import { useState } from 'react';
import api from '../../utils/api';
import { Upload, FileSpreadsheet } from 'lucide-react';

export default function ImportCSV() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/students/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Import Students (CSV)</h1>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start gap-4 mb-6">
          <FileSpreadsheet className="text-indigo-600 shrink-0" size={32} />
          <div>
            <h2 className="font-semibold">CSV Format</h2>
            <p className="text-sm text-slate-500 mt-1">Required columns: <code className="bg-slate-100 px-1 rounded">id_number</code>, <code className="bg-slate-100 px-1 rounded">name</code></p>
            <p className="text-sm text-slate-500">Optional: <code className="bg-slate-100 px-1 rounded">branch</code>, <code className="bg-slate-100 px-1 rounded">residency</code> (hostler/day scholar), <code className="bg-slate-100 px-1 rounded">year</code> (Y23-Y26)</p>
            <p className="text-sm text-slate-500 mt-2">Default password for new students: <code className="bg-slate-100 px-1 rounded">webapps@123</code></p>
          </div>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm" />
          <button type="submit" disabled={!file || loading} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50">
            <Upload size={16} /> {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-sm">
            <p><strong>{result.imported}</strong> new students imported</p>
            <p><strong>{result.updated}</strong> existing students updated</p>
            {result.errors?.length > 0 && <p className="text-red-600 mt-1">{result.errors.length} rows skipped</p>}
          </div>
        )}
      </div>
    </div>
  );
}
