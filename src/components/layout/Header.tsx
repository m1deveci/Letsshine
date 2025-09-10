import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { content } = useContent()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsServicesOpen(false)
  }, [location])

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/images/logo_68763840566a21.02519408.png" 
              alt="Let's Shine Logo" 
              className="h-8 w-auto lg:h-10"
            />
            <span className="text-xl lg:text-2xl font-bold text-primary-600">
              {content.site.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Ana Sayfa
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span>Hizmetlerimiz</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-scale-in">
                  {content.navigation.services.map((service) => (
                    service.external ? (
                      <a
                        key={service.name}
                        href={service.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {service.name}
                      </a>
                    ) : (
                      <Link
                        key={service.name}
                        to={service.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {service.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleContactClick}
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              İletişim
            </button>

            <Link
              to="/contact"
              className="btn-primary"
            >
              Teklif Al
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Ana Sayfa
              </Link>

              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <span>Hizmetlerimiz</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {content.navigation.services.map((service) => (
                      service.external ? (
                        <a
                          key={service.name}
                          href={service.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {service.name}
                        </a>
                      ) : (
                        <Link
                          key={service.name}
                          to={service.path}
                          className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {service.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleContactClick}
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors text-left"
              >
                İletişim
              </button>

              <Link
                to="/contact"
                className="btn-primary inline-block text-center"
              >
                Teklif Al
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}