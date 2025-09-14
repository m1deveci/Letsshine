import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const iconMap = {
  Users,
  UserSearch,
  Target,
  GraduationCap,
  Heart,
  MessageCircle,
  DollarSign
};

const Services: React.FC = () => {
  const { services } = useApp();
  const activeServices = services.filter(service => service.isActive);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-full text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
            Profesyonel Hizmetlerimiz
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-serif">
            Uzmanlık Alanlarımız
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-700 mb-4 font-medium">İşletmenizin İnsan Kaynakları Vizyonunu Gerçekleştiriyoruz</p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Stratejik danışmanlık, yetenek yönetimi ve organizasyonel gelişim alanlarında
              kanıtlanmış metodolojilerle kurumsal hedeflerinize ulaşmanızı sağlıyoruz.
            </p>
          </div>
        </motion.div>

        {/* Professional Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {activeServices.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;

            return (
              <motion.div key={service.id} variants={itemVariants}>
                <div className="group h-full">
                  <Link to={`/hizmet/${service.slug}`}>
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                      {/* Card accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-slate-600/10 rounded-bl-3xl"></div>

                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 group-hover:border-slate-800 transition-all duration-300">
                            <IconComponent className="w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hizmet</div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 font-serif">
                          {service.title}
                        </h3>

                        <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                          {service.description}
                        </p>

                        {/* Professional Features */}
                        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                          <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Kapsamı</h4>
                          <div className="space-y-3">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-slate-700">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                                <span className="font-medium">{feature}</span>
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <div className="text-sm text-slate-500 font-medium">
                                +{service.features.length - 3} diğer alan
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-slate-700 font-semibold">Detayları İncele</span>
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;