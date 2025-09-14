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
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Professional background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Professional Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Kurumsal Kimliğimiz
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 font-serif">
                İnsan Kaynakları
                <span className="block text-blue-600">Uzmanlık Merkezi</span>
              </h2>

              <div className="space-y-6">
                <p className="text-xl text-slate-700 leading-relaxed font-medium">
                  25+ yıllık deneyimimizle, kurumsal insan kaynakları yönetiminde
                  stratejik çözümler geliştiren köklü bir danışmanlık firmasıyız.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  ISO standartlarında hizmet kalitesi, kanıtlanmış metodolojiler ve
                  uzman kadromuzla işletmenizin insan sermayesini optimize ediyoruz.
                </p>
              </div>
            </div>

            {/* Professional Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-8 font-serif">Kurumsal Değerlerimiz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 group-hover:border-slate-800 transition-all duration-300">
                        <feature.icon className="w-7 h-7 text-slate-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 ml-4 group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium pl-18">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Professional Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-slate-100 via-white to-slate-50 rounded-3xl p-8 border border-slate-200 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Profesyonel İnsan Kaynakları Danışmanlığı"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
              />

              {/* Professional overlay */}
              <div className="absolute inset-8 bg-gradient-to-t from-slate-800/20 via-transparent to-slate-800/10 rounded-2xl"></div>

              {/* Corner accent elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-600 rounded-full opacity-10"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-slate-600 rounded-full opacity-5"></div>
            </div>

            {/* Professional Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-8 -right-8 bg-slate-800 text-white p-8 rounded-3xl shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">25+</div>
                  <div className="text-slate-300 text-sm font-medium">Yıl Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
                  <div className="text-slate-300 text-sm font-medium">Başarı Oranı</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -top-8 -left-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-xl"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-slate-600 text-sm font-medium">Mutlu Müşteri</div>
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