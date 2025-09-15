import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

const Hero: React.FC = () => {
  const { heroContent } = useApp();
  
  // Default values if heroContent is not available
  const features = heroContent?.features || [
    'Stratejik İnsan Kaynakları Danışmanlığı',
    'Stratejik Danışmanlık',
    'Koçluk & Mentorluk Hizmetleri',
    'Kurumsal Psikolojik Danışmanlık ve Destek',
    'Kurumsal Eğitimler'
  ];


  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle geometric patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(59,130,246,0.03)_25%,rgba(59,130,246,0.03)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.03)_75%,rgba(59,130,246,0.03)_76%,transparent_77%)] bg-[size:48px_48px]"></div>

        {/* Corporate overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-transparent to-blue-900/5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:pt-6 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {/* Professional badge */}
              <div className="inline-flex items-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-sm font-medium">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Profesyonel İnsan Kaynakları Danışmanlığı
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight font-serif">
                {heroContent?.title || 'İnsan Odaklı İK Çözümleri ile Geleceği Şekillendirin'}
              </h1>

              <p className="text-xl text-slate-700 leading-relaxed max-w-2xl">
                {heroContent?.subtitle || 'Uzman ekibimizle, organizasyonunuzun insan kaynakları potansiyelini maksimuma çıkarıyoruz.'}
              </p>

              {heroContent?.description && (
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  {heroContent.description}
                </p>
              )}
            </div>

            {/* Professional Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Uzmanlık Alanlarımız</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Professional CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/hizmetler" className="group">
                <div className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span className="font-semibold text-lg">Hizmetlerimizi Keşfedin</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link to="/iletisim" className="group">
                <div className="bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="font-semibold text-lg">Bizimle İletişime Geçin</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Professional Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-slate-100 via-white to-slate-50 rounded-3xl p-4 shadow-2xl border border-slate-200">
              <img
                src={heroContent?.heroImage || "/uploads/logo1.png"}
                alt="İnsan Kaynakları Danışmanlığı"
                className="w-full h-full object-contain object-center rounded-2xl"
              />

              {/* Professional overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-800/10 via-slate-800/5 to-transparent rounded-t-3xl"></div>

              {/* Corner accent */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-blue-600 rounded-full opacity-10"></div>
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-slate-600 rounded-full opacity-5"></div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;