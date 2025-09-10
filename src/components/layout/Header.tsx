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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-large border-b border-gray-100/50' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <img 
              src="/images/logo_68763840566a21.02519408.png" 
              alt="Let's Shine Logo" 
              className="h-10 w-auto lg:h-12 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {content.site.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link 
              to="/" 
              className={`font-semibold text-lg transition-all duration-300 hover:text-primary-600 hover:scale-105 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Ana Sayfa
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center space-x-2 font-semibold text-lg text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-105"
              >
                <span>Hizmetlerimiz</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-large border border-gray-100/50 py-3 animate-scale-in">
                  {content.navigation.services.map((service) => (
                    service.external ? (
                      <a
                        key={service.name}
                        href={service.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 font-medium hover:translate-x-1"
                      >
                        {service.name}
                      </a>
                    ) : (
                      <Link
                        key={service.name}
                        to={service.path}
                        className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 font-medium hover:translate-x-1"
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
              className="font-semibold text-lg text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-105"
            >
              İletişim
            </button>

            <Link
              to="/contact"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:shadow-colored hover:-translate-y-1 hover:scale-105"
            >
              Teklif Al
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-100/50 animate-slide-down bg-white/95 backdrop-blur-md rounded-b-2xl">
            <div className="flex flex-col space-y-6">
              <Link 
                to="/" 
                className={`font-semibold text-lg transition-all duration-300 hover:text-primary-600 hover:translate-x-2 ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Ana Sayfa
              </Link>

              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full font-semibold text-lg text-gray-700 hover:text-primary-600 transition-all duration-300"
                >
                  <span>Hizmetlerimiz</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isServicesOpen && (
                  <div className="mt-4 ml-6 space-y-3">
                    {content.navigation.services.map((service) => (
                      service.external ? (
                        <a
                          key={service.name}
                          href={service.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-gray-600 hover:text-primary-600 transition-all duration-300 font-medium hover:translate-x-1"
                        >
                          {service.name}
                        </a>
                      ) : (
                        <Link
                          key={service.name}
                          to={service.path}
                          className="block text-gray-600 hover:text-primary-600 transition-all duration-300 font-medium hover:translate-x-1"
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
                className="font-semibold text-lg text-gray-700 hover:text-primary-600 transition-all duration-300 text-left hover:translate-x-2"
              >
                İletişim
              </button>

              <Link
                to="/contact"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-colored hover:-translate-y-1 inline-block text-center"
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