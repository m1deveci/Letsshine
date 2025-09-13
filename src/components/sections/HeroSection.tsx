import React from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export const HeroSection: React.FC = () => {
  const { content } = useContent()

  const handleScrollToServices = (e: React.MouseEvent) => {
    e.preventDefault()
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-accent-500/20"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-500/10 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${content.hero.image})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-slide-up space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent-400 rounded-full mr-2 animate-pulse"></span>
              Türkiye'nin Önde Gelen İK Danışmanlığı
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 font-display">
              {content.hero.title}
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl">
              {content.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button
                onClick={handleScrollToServices}
                className="group bg-white text-primary-600 font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-3 text-lg"
              >
                <span>Hizmetlerimizi Keşfedin</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <button
                onClick={handleScrollToContact}
                className="group border-2 border-white/80 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:bg-white hover:text-primary-600 backdrop-blur-sm flex items-center justify-center space-x-3 text-lg hover:scale-105"
              >
                <span>İletişime Geçin</span>
                <Play className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-white/80 text-sm">Başarılı Proje</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-white/80 text-sm">Yıl Deneyim</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">200+</div>
                <div className="text-white/80 text-sm">Mutlu Müşteri</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Main Image Container */}
            <div className="relative z-10 group">
              <img
                src={content.hero.image}
                alt="İnsan Kaynakları Danışmanlığı"
                className="w-full h-auto rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-3xl"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent-500/30 rounded-full blur-2xl animate-bounce-slow"></div>
            <div className="absolute top-1/2 -right-4 w-24 h-24 bg-secondary-500/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-large animate-slide-down">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800">Aktif Projeler</span>
              </div>
              <div className="text-2xl font-bold text-primary-600 mt-1">24</div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-large animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-800">Müşteri Memnuniyeti</span>
              </div>
              <div className="text-2xl font-bold text-accent-600 mt-1">98%</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-4 bg-white/80 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}