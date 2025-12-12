import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { settings } = useApp();

  const { navigationItems } = useApp();

  const navigation = navigationItems
    .filter(item => item.is_active || item.isActive)
    .sort((a, b) => (a.order_position || a.order || 0) - (b.order_position || b.order || 0))
    .map(item => ({ name: item.name, href: item.href }));

  // Hizmetlerimiz menüsü altına Eğitim Kataloğu ekle
  const servicesDropdown = [
    { name: 'Tüm Hizmetler', href: '/hizmetler' },
    { name: 'Eğitim Kataloğu', href: '/egitim-katalogu' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some(item => isActive(item.href));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="h-12 sm:h-16 w-auto mr-3 object-contain max-w-[180px]"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg sm:text-xl">LS</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{settings.title || "Let's Shine"}</h1>
                <p className="text-xs text-gray-500">{settings.subtitle || "İnsan Kaynakları"}</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              // Hizmetlerimiz için dropdown menü
              if (item.href === '/hizmetler') {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown('services')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                        isDropdownActive(servicesDropdown)
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === 'services' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                        >
                          {servicesDropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                isActive(dropdownItem.href)
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                              }`}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                // Hizmetlerimiz için dropdown menü
                if (item.href === '/hizmetler') {
                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'services-mobile' ? null : 'services-mobile')}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isDropdownActive(servicesDropdown)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === 'services-mobile' ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Mobile Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === 'services-mobile' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {servicesDropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.href}
                                className={`block px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                                  isActive(dropdownItem.href)
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;