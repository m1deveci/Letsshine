import React from 'react'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

export const ContactInfo: React.FC = () => {
  const { content } = useContent()

  const contactItems = [
    {
      icon: Mail,
      title: 'E-posta',
      value: content.contact.email,
      href: `mailto:${content.contact.email}`,
      description: 'Size 24 saat içinde dönüş yapıyoruz',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: content.contact.phone,
      href: `tel:${content.contact.phone}`,
      description: 'Pazartesi - Cuma, 09:00 - 18:00',
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: content.contact.address,
      href: '#',
      description: 'Ofisimize bekleriz',
    },
  ]

  return (
    <div className="space-y-10">
      <div className="text-center lg:text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Bizimle İletişime Geçin
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          Size en uygun iletişim kanalını seçin. Tüm sorularınızı yanıtlamak için buradayız.
        </p>
      </div>
      
      {/* Contact Info Cards */}
      <div className="space-y-8">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon
          
          return (
            <div
              key={index}
              className="feature-card p-8 hover:shadow-colored group"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-colored">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  {item.href !== '#' ? (
                    <a
                      href={item.href}
                      className="text-primary-600 hover:text-primary-700 transition-colors font-bold text-lg"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-bold text-lg">
                      {item.value}
                    </p>
                  )}
                  <p className="text-gray-500 mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Working Hours */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 border border-primary-200/50">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-xl text-gray-900">
            Çalışma Saatleri
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Pazartesi - Cuma</span>
            <span className="font-bold text-gray-900">09:00 - 18:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Cumartesi</span>
            <span className="font-bold text-gray-900">10:00 - 16:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Pazar</span>
            <span className="font-bold text-gray-900">Kapalı</span>
          </div>
        </div>
      </div>

      {/* Quick Response */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 rounded-3xl p-8 text-white shadow-colored">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-xl">
            Hızlı Yanıt Garantisi
          </h4>
        </div>
        <p className="text-white/90 leading-relaxed">
          Tüm sorularınıza 24 saat içinde yanıt veriyoruz. 
          Acil durumlar için telefon ile ulaşabilirsiniz.
        </p>
      </div>
    </div>
  )
}