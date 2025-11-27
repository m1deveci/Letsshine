import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ContactForm from '../components/forms/ContactForm';
import Card from '../components/ui/Card';

const ContactPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { settings } = useApp();

  const handleFormSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      info: settings.phone,
      description: 'Bize hızlıca ulaşabilirsiniz'
    },
    {
      icon: Mail,
      title: 'E-posta',
      info: settings.email,
      description: '7/24 mesajlarınızı okuyoruz'
    },
    {
      icon: MapPin,
      title: 'Adres',
      info: settings.address,
      description: 'Ofis ziyaretleri için randevu alın'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      info: 'Pzt-Cum: 09:00 - 18:00',
      description: 'Hafta sonları randevulu'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-800 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
              İletişim
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
              İletişim
            </h1>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              İnsan kaynakları çözümleriniz için bizimle iletişime geçin. 
              Uzman ekibimiz sizin için burada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Bizimle İletişime Geçin
                </h2>
                <p className="text-lg text-gray-600">
                  İnsan kaynakları süreçlerinizde size nasıl yardımcı olabileceğimizi 
                  konuşmak için bizimle iletişime geçin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-900 font-medium mb-1">
                        {item.info}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Google Maps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
               
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {showSuccess ? (
                <Card className="text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Mesajınız İletildi!
                      </h3>
                      <p className="text-gray-600">
                        En kısa sürede size dönüş yapacağız.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Mesaj Gönderin
                    </h3>
                    <p className="text-gray-600">
                      Formu doldurarak bizimle iletişime geçebilirsiniz.
                    </p>
                  </div>
                  
                  <ContactForm onSuccess={handleFormSuccess} />
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;