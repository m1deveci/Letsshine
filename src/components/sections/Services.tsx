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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            HİZMETLERİMİZ
          </h2>
          <p className="text-xl text-gray-600 mb-2">İşinize Değer Katacak Çözümler</p>
          <p className="text-gray-500 max-w-3xl mx-auto">
            Yetenek yönetiminden organizasyonel gelişime kadar geniş bir yelpazede hizmet sunuyoruz
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {activeServices.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
            
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Card className="h-full group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Link to={`/hizmet/${service.slug}`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                          <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6 flex-grow">
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                            {feature}
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{service.features.length - 3} diğer özellik
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                        <span>Detayları Görüntüle</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/hizmetler">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Tüm Hizmetlerimizi Görüntüle
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;