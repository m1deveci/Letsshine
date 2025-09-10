import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/ui/Card';

const iconMap = {
  Users,
  UserSearch,
  Target,
  GraduationCap,
  Heart,
  MessageCircle,
  DollarSign
};

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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Hizmetlerimiz
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              İşinize değer katacak kapsamlı insan kaynakları çözümleri sunuyoruz. 
              Her hizmetimiz, modern yöntemler ve uzman kadromuzla desteklenmektedir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activeServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
              
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Card className="h-full group hover:shadow-lg transition-all duration-300">
                    <Link to={`/hizmet/${service.slug}`} className="block h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                            <IconComponent className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {service.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                          {service.description}
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                          <span>Detayları İncele</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </Card>
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