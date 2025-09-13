import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Lightbulb } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/ui/Card';

const VisionMissionPage: React.FC = () => {
  const { aboutContent } = useApp();

  if (!aboutContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Find mission and vision sections
  const missionSection = aboutContent.sections?.find(section => 
    section.title.toLowerCase().includes('misyon')
  );
  const visionSection = aboutContent.sections?.find(section => 
    section.title.toLowerCase().includes('vizyon')
  );

  const features = [
    {
      icon: Target,
      title: 'Misyonumuz',
      description: missionSection?.content || 'İnsan odaklı yaklaşımımızla, organizasyonların sürdürülebilir başarıya ulaşması için stratejik insan kaynakları çözümleri geliştirmek ve uygulamaktır.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Eye,
      title: 'Vizyonumuz',
      description: visionSection?.content || 'İnsan kaynakları danışmanlığında öncü ve güvenilir bir marka olmak, müşterilerimizin iş sonuçlarına doğrudan katkı sağlayan çözümler sunmaktır.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Heart,
      title: 'Değerlerimiz',
      description: 'İnsan odaklılık, güvenilirlik, profesyonellik ve sürekli gelişim değerleriyle hareket ediyoruz.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Hedefimiz',
      description: 'Müşterilerimizin insan kaynakları süreçlerini optimize ederek, iş performanslarını artırmak ve sürdürülebilir büyüme sağlamak.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const stats = [
    { number: '25+', label: 'Yıllık Deneyim', icon: Award },
    { number: '500+', label: 'Başarılı Proje', icon: Target },
    { number: '200+', label: 'Mutlu Müşteri', icon: Users },
    { number: '100%', label: 'Müşteri Memnuniyeti', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Vizyon & <span className="text-blue-600">Misyon</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {aboutContent.subtitle || 'İnsan Kaynakları alanında güvenilir çözüm ortağınız'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Content */}
          {aboutContent.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <Card>
                <div className="p-8">
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: aboutContent.content }}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Rakamlarla <span className="text-blue-600">Let's Shine</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Yılların verdiği deneyim ve başarılarımızla müşterilerimize değer katıyoruz.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Sections */}
          {aboutContent.sections && aboutContent.sections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="space-y-8"
            >
              {aboutContent.sections
                .filter(section => 
                  !section.title.toLowerCase().includes('misyon') && 
                  !section.title.toLowerCase().includes('vizyon')
                )
                .map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  >
                    <Card>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                          <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                          {section.title}
                        </h3>
                        <div 
                          className="prose prose-lg max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VisionMissionPage;
