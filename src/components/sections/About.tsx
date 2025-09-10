import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Handshake, Clock } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Uzman Kadro',
      description: 'Alanında deneyimli ve sertifikalı danışmanlar'
    },
    {
      icon: Lightbulb,
      title: 'Yenilikçi Stratejiler',
      description: 'İleriye dönük, esnek insan kaynakları çözümleri'
    },
    {
      icon: Handshake,
      title: 'İşbirliği Odaklı',
      description: 'Her kurumun ihtiyacına özel destek ve planlama'
    },
    {
      icon: Clock,
      title: '7/24 Destek',
      description: 'Danışman ekibimiz her zaman yanınızda'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                HAKKIMIZDA
              </h2>
              <h3 className="text-xl text-blue-600 font-semibold mb-6">
                İK Yönetiminde Güvenilir İş Ortağınız
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                İşletmenizin insan kaynağını verimli yönetebilmesi için modern çözümler sunuyoruz. 
                Stratejik danışmanlık, koçluk ve sürekli gelişim alanlarında uzmanız.
              </p>
            </div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Takım çalışması"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-2xl"></div>
            </div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5+</div>
                  <div className="text-xs text-gray-600">Yıl Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100+</div>
                  <div className="text-xs text-gray-600">Mutlu Müşteri</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;