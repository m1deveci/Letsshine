import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ContactForm } from '../components/forms/ContactForm'
import { ContactInfo } from '../components/ui/ContactInfo'

export const ContactPage: React.FC = () => {
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
            İletişim
          </h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            İnsan kaynakları ihtiyaçlarınız için bizimle iletişime geçin. 
            Uzman ekibimiz size en uygun çözümleri sunmak için hazır.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ofisimizi Ziyaret Edin
            </h2>
            <p className="text-lg text-gray-600">
              İzmir merkezli ofisimizde yüz yüze görüşme imkanı da sunuyoruz.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Harita Yakında Eklenecek
                </h3>
                <p className="text-gray-600">
                  Detaylı adres bilgisi için lütfen bizimle iletişime geçin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}