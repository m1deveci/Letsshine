import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

const About: React.FC = () => {
  const { aboutContent } = useApp();

  if (!aboutContent || !aboutContent.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">İçerik Bulunamadı</h1>
          <p className="text-gray-600">Hakkımızda sayfası içeriği mevcut değil.</p>
        </div>
      </div>
    );
  }

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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderSection = (section: typeof aboutContent.sections[0], index: number) => {
    const isEven = index % 2 === 0;
    
    return (
      <motion.div
        key={section.id}
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
      >
        {section.type === 'text' ? (
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <div 
                className="text-lg text-gray-600 leading-relaxed prose prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Text Content */}
            <motion.div 
              className={`${(section.type === 'text-image' && !isEven) || (section.type === 'image-text' && isEven) ? 'lg:order-2' : ''}`}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                {section.title}
              </h3>
              <div 
                className="text-gray-600 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.div>
            
            {/* Image */}
            {section.image && (
              <motion.div
                variants={imageVariants}
                className={`${(section.type === 'text-image' && !isEven) || (section.type === 'image-text' && isEven) ? 'lg:order-1' : ''}`}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <img 
                    src={section.image}
                    alt={section.title}
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
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
              {aboutContent.title}
            </h1>
            {aboutContent.subtitle && (
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                {aboutContent.subtitle}
              </p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="prose prose-lg mx-auto text-gray-600"
              dangerouslySetInnerHTML={{ __html: aboutContent.content }}
            />
          </motion.div>

          {/* Hero Image */}
          {aboutContent.heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16"
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl shadow-3xl">
                  <img 
                    src={aboutContent.heroImage}
                    alt={aboutContent.title}
                    className="w-full h-96 sm:h-[32rem] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-300 rounded-full opacity-40" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Content Sections */}
      {aboutContent.sections.length > 0 && (
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {aboutContent.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => renderSection(section, index))}
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bizimle Çalışmaya Başlayın
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              İnsan kaynakları çözümleriniz için profesyonel desteğe mi ihtiyacınız var? 
              Hemen iletişime geçin ve size nasıl yardımcı olabileceğimizi öğrenin.
            </p>
            <motion.a
              href="/iletisim"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg"
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