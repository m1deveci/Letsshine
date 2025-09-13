import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Settings, 
  Briefcase, 
  MessageSquare, 
  LogOut,
  Users,
  FileText,
  Layout,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const { isAuthenticated, logout, token } = useAuth();
  const { settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch pending applications count
  const fetchPendingApplicationsCount = async () => {
    try {
      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const pendingCount = data.filter((app: any) => app.status === 'pending').length;
        setPendingApplicationsCount(pendingCount);
      }
    } catch (error) {
      console.error('Error fetching pending applications count:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchPendingApplicationsCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingApplicationsCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Hakkımızda', href: '/admin/about', icon: FileText },
    { name: 'Hizmetler', href: '/admin/services', icon: Briefcase },
    { name: 'Ekip', href: '/admin/team', icon: Users },
    { name: 'Başvurular', href: '/admin/applications', icon: MessageSquare },
    { name: 'Sayfa Yönetimi', href: '/admin/pages', icon: Layout, children: [
      { name: 'Ana Sayfa', href: '/admin/pages/hero', icon: Home },
      { name: 'Menü Yönetimi', href: '/admin/pages/navigation', icon: Navigation }
    ]},
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings }
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Çıkış Yap',
      text: 'Oturumunuzu sonlandırmak istediğinizden emin misiniz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Çıkış Yap',
      cancelButtonText: 'İptal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      logout();
      navigate('/');
      
      await Swal.fire({
        title: 'Başarılı!',
        text: 'Oturumunuz başarıyla sonlandırıldı.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl"
            >
              {/* Mobile sidebar content */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center">
                  {settings.logo ? (
                    <img 
                      src={settings.logo} 
                      alt="Logo" 
                      className="h-8 w-auto mr-3 object-contain max-w-[100px]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">LS</span>
                    </div>
                  )}
                  <span className="text-lg font-semibold">Admin Panel</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.name === 'Başvurular' && pendingApplicationsCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {pendingApplicationsCount}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Çıkış Yap
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="h-8 w-auto mr-3 object-contain max-w-[100px]"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">LS</span>
                </div>
              )}
              <span className="text-lg font-semibold">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
                {item.name === 'Başvurular' && pendingApplicationsCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {pendingApplicationsCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Mobile header */}
        <div className="flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center ml-4">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-6 w-auto mr-2 object-contain max-w-[80px]"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">LS</span>
              </div>
            )}
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;