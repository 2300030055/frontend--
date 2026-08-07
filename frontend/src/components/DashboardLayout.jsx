import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FolderKanban, Calendar, Award,
  Users, ClipboardCheck, Upload, Settings, Shield, LogOut,
  Menu, X, GraduationCap
} from 'lucide-react';
import { useState } from 'react';

const roleConfig = {
  student: {
    label: 'Student Portal',
    color: 'bg-emerald-500',
    badge: 'Student',
    nav: [
      { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/student/profile', icon: User, label: 'Profile' },
      { to: '/student/project', icon: FolderKanban, label: 'Project Details' },
      { to: '/student/sessions', icon: Calendar, label: 'Sessions Calendar' },
      { to: '/student/certificates', icon: Award, label: 'Certificates' },
    ],
  },
  admin: {
    label: 'Admin Portal',
    color: 'bg-blue-500',
    badge: 'Admin',
    nav: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/admin/students', icon: Users, label: 'Manage Students' },
      { to: '/admin/import', icon: Upload, label: 'Import CSV' },
      { to: '/admin/attendance', icon: ClipboardCheck, label: 'Take Attendance' },
      { to: '/admin/sessions', icon: Calendar, label: 'Sessions' },
      { to: '/admin/certificates', icon: Award, label: 'Certificates' },
    ],
  },
  super_admin: {
    label: 'Super Admin Portal',
    color: 'bg-violet-600',
    badge: 'Super Admin',
    nav: [
      { to: '/super-admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/super-admin/students', icon: Users, label: 'Students' },
      { to: '/super-admin/admins', icon: Shield, label: 'Manage Admins' },
      { to: '/super-admin/import', icon: Upload, label: 'Import Data' },
      { to: '/super-admin/attendance', icon: ClipboardCheck, label: 'Attendance' },
      { to: '/super-admin/sessions', icon: Calendar, label: 'Programs & Sessions' },
      { to: '/super-admin/certificates', icon: Award, label: 'Certificates' },
      { to: '/super-admin/settings', icon: Settings, label: 'Club Settings' },
    ],
  },
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = roleConfig[user.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center`}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight">WebApps Club</h1>
                <p className="text-xs text-slate-400">{config.label}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 mx-3 mt-4 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="font-semibold text-sm truncate">{user.idNumber}</p>
            <p className="text-xs text-slate-400 truncate">{user.name}</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {config.nav.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${config.color} mb-3`}>
              {config.badge}
            </span>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.idNumber}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
