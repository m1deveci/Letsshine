import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Eye, Star, Users, Lightbulb, Shield, Zap, Award, Globe } from 'lucide-react';
import { AboutContent } from '../types';

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setAboutContent(data);
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      Heart,
      Shield,
      Zap,
      Users,
      Lightbulb,
      Globe,
      Target,
      Eye,
      Star,
      Award
    };
    return iconMap[iconName] || Heart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!aboutContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">İçerik yüklenemedi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3B82F6 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #3B82F6 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hakkımızda
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              İnsanın içindeki potansiyele inanıyoruz. Dinliyor, anlıyor ve ilhamla dönüştürüyoruz.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Manifesto Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="pt-12 pb-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-12 h-12 text-yellow-500 mr-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Manifestosumuz</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {aboutContent.manifesto.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission, Vision Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div variants={sectionVariants} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Misyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {aboutContent.mission}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={sectionVariants} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <Eye className="w-10 h-10 text-green-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {aboutContent.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-purple-600 mr-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Değerlerimiz</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Çalışma prensiplerimizi ve değerlerimizi oluşturan temel ilkeler
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutContent.values.map((value, index) => {
              const IconComponent = getIconComponent(value.icon);
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Slogans Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">İlham Verici Sözlerimiz</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Çalışma felsefemizi yansıtan ve bizi motive eden sözler
            </p>
          </motion.div>

          <div className="space-y-8">
            {aboutContent.slogans.map((sloganCategory, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">
                  {sloganCategory.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sloganCategory.items.map((slogan, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      className="bg-white border border-slate-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <p className="text-lg font-medium text-center text-slate-800">{slogan}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Bizimle Çalışmaya Başlayın
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              İnsan kaynakları çözümleriniz için profesyonel desteğe mi ihtiyacınız var? 
              Hemen iletişime geçin ve size nasıl yardımcı olabileceğimizi öğrenin.
            </p>
            <motion.a
              href="/iletisim"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              İletişime Geçin
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;