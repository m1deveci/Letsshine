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
    <div className="space-y-8">
      {/* Contact Info Cards */}
      <div className="space-y-6">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  {item.href !== '#' ? (
                    <a
                      href={item.href}
                      className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {item.value}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Working Hours */}
      <div className="bg-primary-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-6 h-6 text-primary-600" />
          <h3 className="font-semibold text-gray-900">
            Çalışma Saatleri
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Pazartesi - Cuma</span>
            <span className="font-medium text-gray-900">09:00 - 18:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cumartesi</span>
            <span className="font-medium text-gray-900">10:00 - 16:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pazar</span>
            <span className="font-medium text-gray-900">Kapalı</span>
          </div>
        </div>
      </div>

      {/* Quick Response */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <MessageCircle className="w-6 h-6" />
          <h3 className="font-semibold">
            Hızlı Yanıt Garantisi
          </h3>
        </div>
        <p className="text-sm text-white/90">
          Tüm sorularınıza 24 saat içinde yanıt veriyoruz. 
          Acil durumlar için telefon ile ulaşabilirsiniz.
        </p>
      </div>
    </div>
  )
}