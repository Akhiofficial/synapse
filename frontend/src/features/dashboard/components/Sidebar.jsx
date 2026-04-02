import { NavLink } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../../auth/hooks/useAuth';
import { useUI } from '../../../app/UIContext';

const Sidebar = () => {
  const { setIsAddModalOpen } = useDashboard();
  const { handleLogout } = useAuth();
  const { isSidebarOpen, closeSidebar } = useUI();
  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Collections', icon: 'folder_open', path: '/collections' },
    { label: 'Graph', icon: 'account_tree', path: '/graph' },
    { label: 'Search', icon: 'search', path: '/search' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <aside className={`fixed left-0 top-0 flex flex-col h-screen w-64 border-r border-white/10 bg-brand-black font-display tracking-tight z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter text-brand-orange">Synapse</h1>
          <p className="text-[10px] text-brand-orange/60 font-bold tracking-widest mt-1 uppercase">Predictive Engine Active</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-linear-to-r from-brand-orange/20 to-transparent text-brand-orange border-r-2 border-brand-orange'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-linear-to-br from-brand-orange to-orange-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 hover:scale-[0.98] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined font-fill-1">bolt</span>
            New Neural Link
          </button>
        </div>

        <div className="mt-auto p-4 border-t border-white/5 space-y-1">
          <NavLink 
            to="/help"
            className={({ isActive }) => 
              `w-full flex items-center gap-3 px-4 py-2 text-xs transition-colors ${
                isActive ? 'text-brand-orange bg-brand-orange/10 rounded-lg' : 'text-gray-500 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Help</span>
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-gray-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
