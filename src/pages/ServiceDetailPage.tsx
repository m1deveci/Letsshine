import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign, GraduationCap as UserGraduate, User as UserTie, Dumbbell, ClipboardCheck as ChalkboardTeacher, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ServiceCategory } from '../types';
import ServiceApplicationForm from '../components/forms/ServiceApplicationForm';
import Tooltip from '../components/ui/Tooltip';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const iconMap = {
  Users,
  UserSearch,
  Target,
  GraduationCap,
  Heart,
  MessageCircle,
  DollarSign,
  UserGraduate,
  UserTie,
  Dumbbell,
  ChalkboardTeacher,
  UserCheck
};

// Coaching service categories with tooltips
const coachingCategories: ServiceCategory[] = [
  { 
    id: '1',
    value: 'yeni_mezun', 
    name: 'Yeni Mezun Kariyer Koçluğu',
    description: 'Eğitim hayatını tamamlamış olup iş yaşamına başlangıç yapmak isteyen kişileri kapsar.',
    icon: 'UserGraduate',
    tooltip: `
      <strong>Yeni Mezun Kariyer Koçluğu</strong><br>
      İş hayatına yeni atılan bireylerin ne istediklerini keşfetmelerine, kendilerini en parlak hissedebilecekleri alanlarla ilgili farkındalık geliştirmelerine destek olan kariyer ve mentörlük programıdır.<br><br>
      CV hazırlama teknikleri, kişilik envanteri, kariyer portallarını en doğru şekilde kullanım kılavuzluğu, mülakatlarda başarılı olmanın yolları gibi konularda farkındalık geliştiren bir programdır.<br><br>
      10 seanstan oluşan bir pakedi kapsar. <em>(Takip seanslarından ücret alınmamaktadır.)</em>
    `
  },
  { 
    id: '2',
    value: 'uzman', 
    name: 'Uzman Gelişim Koçluğu',
    description: 'İş hayatında deneyimli profesyonelleri kapsar.',
    icon: 'UserTie',
    tooltip: `
      <strong>Uzman Kariyer Koçluğu</strong><br>
      Mevcut işinde tatmin olmayan, motivasyonu düşen, farklı kariyer yolları arayan deneyimli çalışanlar ile iş hayatına bir süre ara vermiş uzmanlığı olan kişilere yönelik kariyer ve mentörlük programıdır.<br><br>
      10 seanstan oluşan bir pakedi kapsar. <em>(Takip seanslarından ücret alınmamaktadır.)</em>
    `
  },
  { 
    id: '3',
    value: 'sporcu_performans', 
    name: 'Sporcu Performans Koçluğu',
    description: 'Genç sporcuları ve profesyonel olarak spor yapan antrenör ve sporcuları kapsar.',
    icon: 'Dumbbell',
    tooltip: `
      <strong>Sporcu Performans Koçluğu</strong><br>
      Sporcuların en yüksek potansiyellerine ulaşmalarını sağlamak amacıyla fiziksel, zihinsel ve duygusal açıdan performans geliştirmeye yönelik çalışmaları kapsayan programdır.<br><br>
      8 seans ve 2 takip görüşmesinden oluşan bir pakedi kapsar. <em>(2 Takip seanslarından ücret alınmamaktadır.)</em>
    `
  },
  { 
    id: '4',
    value: 'emeklilik_sonrasi', 
    name: 'Emeklilik Sonrası İkinci Kariyer Koçluğu',
    description: 'Emekli olmuş ve yeniden çalışmak isteyen kişileri kapsar.',
    icon: 'ChalkboardTeacher',
    tooltip: `
      <strong>Emeklilik Sonrası İkinci Kariyer Koçluğu</strong><br>
      Uzun soluklu iş yaşamı sonrası emekli olmuş ve yeniden iş hayatında yer edinmek isteyen kişilerin ikinci çalışma hayatlarında en motive olacakları işi bulmalarına destek olan koçluk programıdır.<br><br>
      8 seans ve 2 takip görüşmesinden oluşan bir pakedi kapsar. <em>(2 Takip seanslarından ücret alınmamaktadır.)</em>
    `
  },
  { 
    id: '5',
    value: 'takim_koclugu', 
    name: 'Takım Koçluğu',
    description: 'Kurumsal şirketlerdeki departman çalışanlarını kapsar.',
    icon: 'Users',
    tooltip: `
      <strong>Takım Koçluğu</strong><br>
      Şirketlerin çeşitli departmanlarında yer alan takım üyelerinin dayanışma ve ekip ruhunu artırmayı hedefleyen farkındalık geliştirici bir programdır.
    `
  },
  { 
    id: '6',
    value: 'yonetici_koclugu', 
    name: 'Yönetici Koçluğu',
    description: 'Şirketlerin yönetim kadrolarında olan liderleri kapsar.',
    icon: 'UserCheck',
    tooltip: `
      <strong>Yönetici Koçluğu</strong><br>
      Yönetim kadrolarında çalışan profesyonellere yönelik, yetkinlik gelişimini hedefleyen, liderlik kapasitesinin güçlendirilmesini benimseyen bir programdır.<br><br>
      8 seans ve 2 takip görüşmesinden oluşan bir pakedi kapsar. <em>(2 Takip seanslarından ücret alınmamaktadır.)</em>
    `
  },
  { 
    id: '7',
    value: 'genc_mentorlugu', 
    name: 'Genç Mentörlüğü',
    description: 'Eğitim hayatı içinde olan bireyleri kapsar.',
    icon: 'UserCheck',
    tooltip: `
      <strong>Genç Mentörlüğü</strong><br>
      Üniversite sınavına hazırlanan gençlerin kişisel, akademik ve kariyer hedeflerine ulaşmalarını sağlayan, gençlerin kendi değerlerinin ve kişilik analizlerinin farkında olmalarını sağlayarak ona göre hedefler koymalarını teşvik eden mentörlük programıdır.<br><br>
      8 seans ve 2 takip görüşmesinden oluşan bir pakedi kapsar. <em>(Takip seanslarından ücret alınmamaktadır.)</em>
    `
  }
];

// Coaching service details - removed as not used

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { services } = useApp();

  const service = services.find(s => s.slug === slug && s.isActive);

  if (!service) {
    return <Navigate to="/hizmetler" replace />;
  }

  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
  const isCoachingService = service.slug === 'kocluk';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/hizmetler">
              <Button variant="ghost" leftIcon={<ArrowLeft className="w-5 h-5" />} className="text-white hover:bg-white/10">
                Hizmetlere Dön
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center mb-8"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-6">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                {service.title}
              </h1>
              <p className="text-xl text-blue-100">
                {service.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hizmet Detayları</h2>
                  
                  {/* HTML içeriği için zengin text editör desteği */}
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: service.content }}
                  />
                </Card>
              </motion.div>

              {/* Coaching Service Categories - Only show for coaching service */}
              {isCoachingService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Faaliyet Türlerimiz</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {coachingCategories.map((category, index) => {
                        const CategoryIcon = iconMap[category.icon as keyof typeof iconMap] || Users;
                        
                        return (
                          <Tooltip
                            key={category.id}
                            content={category.tooltip || ''}
                            trigger="hover"
                            position="top"
                            maxWidth={360}
                          >
                            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 cursor-pointer group">
                              <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                                  <CategoryIcon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {category.name}
                                  </h5>
                                  <p className="text-gray-600 text-sm leading-relaxed">
                                    {category.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Service Features - Show for non-coaching services */}
              {!isCoachingService && service.features && service.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Hizmet Özellikleri</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="sticky top-8"
              >
                <ServiceApplicationForm 
                  service={service} 
                  categories={isCoachingService ? coachingCategories.map(cat => ({ 
                    value: cat.value, 
                    label: cat.name 
                  })) : undefined}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;