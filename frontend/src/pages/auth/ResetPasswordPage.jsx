import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const idNumber = searchParams.get('id');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return setError('Passwords do not match');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/reset-password', { token, idNumber, newPassword });
      localStorage.setItem('wcms_token', res.data.token);
      updateUser(res.data.user);
      const role = res.data.user.role;
      navigate(role === 'student' ? '/student' : role === 'admin' ? '/admin' : '/super-admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold mb-6">Set New Password</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        <Link to="/login" className="block text-center mt-4 text-sm text-indigo-600">Back to login</Link>
      </div>
    </div>
  );
}
