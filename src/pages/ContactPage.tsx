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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              İletişim
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              İnsan kaynakları çözümleriniz için bizimle iletişime geçin. 
              Uzman ekibimiz sizin için burada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Harita Görünümü</p>
                    </div>
                  </div>
                </Card>
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