import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ScrollToTop from './components/ScrollToTop';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/admin/LoginPage';
import ServicesManagement from './pages/admin/ServicesManagement';
import TeamManagement from './pages/admin/TeamManagement';
import ApplicationsManagement from './pages/admin/ApplicationsManagement';
import MessagesPage from './pages/admin/MessagesPage';
import SettingsPage from './pages/admin/SettingsPage';
import HeroManagement from './pages/admin/HeroManagement';
import NavigationManagement from './pages/admin/NavigationManagement';
import PagesManagement from './pages/admin/PagesManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/ekibimiz" element={<TeamPage />} />
                        <Route path="/hizmetler" element={<ServicesPage />} />
                        <Route path="/hizmet/:slug" element={<ServiceDetailPage />} />
                        <Route path="/iletisim" element={<ContactPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<ServicesManagement />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="applications" element={<ApplicationsManagement />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="pages" element={<PagesManagement />} />
                <Route path="pages/hero" element={<HeroManagement />} />
                <Route path="pages/navigation" element={<NavigationManagement />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;