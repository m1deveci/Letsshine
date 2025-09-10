import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { ServiceCard } from '../ui/ServiceCard'

const iconMap = {
  Users,
  UserSearch,
  Target,
  GraduationCap,
  Heart,
  MessageCircle,
  DollarSign
};

export const ServicesSection: React.FC = () => {
  const { services } = useApp()
  const activeServices = services.filter(service => service.isActive)

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
            Profesyonel Hizmetlerimiz
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 font-display">
            Hizmetlerimiz
          </h2>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            İşletmenizin insan kaynağını verimli yönetebilmesi için modern çözümler sunuyoruz. 
            Stratejik danışmanlık, koçluk ve sürekli gelişim alanlarında uzmanız.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {activeServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
            
            return (
              <div
                key={service.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <Link to={`/hizmet/${service.slug}`} className="block h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                            {feature}
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <div className="text-sm text-gray-500 ml-5">
                            +{service.features.length - 3} diğer özellik
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300">
                        <span>Detayları Görüntüle</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-scale-in">
          <div className="relative bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 rounded-4xl shadow-large p-12 lg:p-16 max-w-5xl mx-auto border border-white/50 backdrop-blur-sm">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary-500/10 to-primary-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-display">
              İhtiyacınıza Özel Çözüm Arıyorsunuz?
            </h3>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Uzman ekibimizle birlikte işletmeniz için en uygun İK stratejisini belirleyelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:shadow-colored hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-3 text-lg"
              >
                <span>Ücretsiz Danışmanlık</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <a
                href="tel:+90 (XXX) XXX XX XX"
                className="group border-2 border-primary-500 text-primary-600 font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:bg-primary-500 hover:text-white backdrop-blur-sm flex items-center justify-center space-x-3 text-lg hover:scale-105"
              >
                <span>Hemen Arayın</span>
                <ExternalLink className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}