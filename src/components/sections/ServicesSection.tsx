import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { ServiceCard } from '../ui/ServiceCard'

export const ServicesSection: React.FC = () => {
  const { content } = useContent()

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Hizmetlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İşletmenizin insan kaynağını verimli yönetebilmesi için modern çözümler sunuyoruz. 
            Stratejik danışmanlık, koçluk ve sürekli gelişim alanlarında uzmanız.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {content.services.map((service, index) => (
            <div
              key={service.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-scale-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              İhtiyacınıza Özel Çözüm Arıyorsunuz?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Uzman ekibimizle birlikte işletmeniz için en uygun İK stratejisini belirleyelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="group bg-primary-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Ücretsiz Danışmanlık</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+90 (XXX) XXX XX XX"
                className="group border-2 border-primary-600 text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-600 hover:text-white flex items-center justify-center space-x-2"
              >
                <span>Hemen Arayın</span>
                <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}