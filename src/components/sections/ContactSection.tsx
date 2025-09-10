import React from 'react'
import { ContactForm } from '../forms/ContactForm'
import { ContactInfo } from '../ui/ContactInfo'

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            İletişime Geçin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İnsan kaynakları ihtiyaçlarınız için bizimle iletişime geçin. 
            Uzman ekibimiz size en uygun çözümleri sunmak için hazır.
          </p>
        </div>

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
  )
}