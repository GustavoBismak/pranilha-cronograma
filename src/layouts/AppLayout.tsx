import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Car, Target, CalendarRange, LogOut, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Cronograma', to: '/routine', icon: CalendarClock },
  { name: 'Uber & Ganhos', to: '/uber', icon: Car },
  { name: 'Metas', to: '/goals', icon: Target },
  { name: 'Plano Semanal', to: '/weekly', icon: CalendarRange },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] border-r border-white/5">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Bismak Manager</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-[var(--color-surface)] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Bismak</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[var(--color-surface)] border-l border-white/5 p-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-gray-400 hover:text-red-400"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative pt-16 md:pt-0">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--color-background)] p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
