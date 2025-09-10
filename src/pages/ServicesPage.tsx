import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { ServiceCard } from '../components/ui/ServiceCard'

export const ServicesPage: React.FC = () => {
  const { content } = useContent()

  return (
    <div className="pt-20 animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Ana Sayfa</span>
            </Link>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Hizmetlerimiz
          </h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            İşletmenizin insan kaynağını verimli yönetebilmesi için modern çözümler sunuyoruz. 
            Her hizmetimiz, sektördeki deneyimimiz ve uzmanlığımızla desteklenmektedir.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Hangi Hizmete İhtiyacınız Var?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Uzman ekibimizle birlikte işletmeniz için en uygun İK stratejisini belirleyelim. 
              Ücretsiz danışmanlık için bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary"
              >
                Ücretsiz Danışmanlık Al
              </Link>
              <a
                href={`tel:${content.contact.phone}`}
                className="btn-outline"
              >
                Hemen Arayın
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}