import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign, Info, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Tooltip from '../components/ui/Tooltip';

const iconMap = {
  Users,
  UserSearch,
  Target,
  GraduationCap,
  Heart,
  MessageCircle,
  DollarSign
};

// Farklı renk paletleri
const colorPalettes = [
  { bg: 'from-blue-600 to-blue-700', hover: 'group-hover:from-blue-700 group-hover:to-blue-800' },
  { bg: 'from-emerald-600 to-emerald-700', hover: 'group-hover:from-emerald-700 group-hover:to-emerald-800' },
  { bg: 'from-purple-600 to-purple-700', hover: 'group-hover:from-purple-700 group-hover:to-purple-800' },
  { bg: 'from-orange-600 to-orange-700', hover: 'group-hover:from-orange-700 group-hover:to-orange-800' },
  { bg: 'from-pink-600 to-pink-700', hover: 'group-hover:from-pink-700 group-hover:to-pink-800' },
  { bg: 'from-indigo-600 to-indigo-700', hover: 'group-hover:from-indigo-700 group-hover:to-indigo-800' },
  { bg: 'from-teal-600 to-teal-700', hover: 'group-hover:from-teal-700 group-hover:to-teal-800' },
  { bg: 'from-rose-600 to-rose-700', hover: 'group-hover:from-rose-700 group-hover:to-rose-800' }
];

const ServicesPage: React.FC = () => {
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
              Profesyonel Hizmetlerimiz
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
              Hizmetlerimiz
            </h1>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              İşinize değer katacak kapsamlı insan kaynakları çözümleri sunuyoruz. 
              Her hizmetimiz, modern yöntemler ve uzman kadromuzla desteklenmektedir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-gray-50/50 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-100/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activeServices.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
              const colorPalette = colorPalettes[index % colorPalettes.length];
              
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <div className="h-full group">
                    <Link to={`/hizmet/${service.slug}`} className="block h-full">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden group">
                        {/* Card accent - Star */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                          <Star className="w-5 h-5 text-white fill-current" />
                        </div>
                        
                        <div className="flex flex-col h-full relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className={`w-14 h-14 bg-gradient-to-br ${colorPalette.bg} ${colorPalette.hover} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                                <IconComponent className="w-7 h-7 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-slate-700 transition-colors duration-300">
                                {service.title}
                              </h3>
                            </div>
                            {service.properties && service.properties.length > 0 && (
                              <Tooltip
                                content={`<div class="space-y-2">
                                  <div class="font-semibold text-white mb-2">Hizmet Özellikleri:</div>
                                  ${service.properties.map((prop: any) =>
                                    `<div class="flex justify-between">
                                      <span class="text-gray-200">${prop.key}:</span>
                                      <span class="text-white ml-2">${prop.value}</span>
                                    </div>`
                                  ).join('')}
                                </div>`}
                                position="left"
                                maxWidth={280}
                                trigger="hover"
                              >
                                <div
                                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <Info className="w-5 h-5" />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4 flex-grow leading-relaxed text-sm">
                            {service.description}
                          </p>
                          
                          {/* Features */}
                          {service.features && service.features.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {service.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                                <div key={featureIndex} className="flex items-center text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full mr-2 flex-shrink-0"></div>
                                  <span className="leading-relaxed">{feature}</span>
                                </div>
                              ))}
                              {service.features.length > 3 && (
                                <div className="text-xs text-slate-500 text-center pt-1">
                                  +{service.features.length - 3} diğer özellik
                                </div>
                              )}
                            </div>
                          )}

                          {/* Properties */}
                          {service.properties && service.properties.length > 0 && (
                            <div className="border-t border-slate-100 pt-3 mb-4">
                              <h4 className="text-xs font-semibold text-slate-800 mb-2">Hizmet Detayları</h4>
                              <div className="space-y-1">
                                {service.properties.slice(0, 2).map((property: any, propIndex: number) => (
                                  <div key={propIndex} className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="font-medium">{property.key}:</span>
                                    <span className="text-slate-700 font-medium">{property.value}</span>
                                  </div>
                                ))}
                                {service.properties.length > 2 && (
                                  <div className="text-xs text-slate-500 text-center pt-1">
                                    +{service.properties.length - 2} diğer detay
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center text-slate-600 font-semibold group-hover:text-slate-700 transition-colors duration-300 text-sm">
                            <span>Detayları İncele</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
    </div>
  );
};

export default ServicesPage;