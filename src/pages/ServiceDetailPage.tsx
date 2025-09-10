import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Users, UserSearch, Target, GraduationCap, Heart, MessageCircle, DollarSign, GraduationCap as UserGraduate, User as UserTie, Dumbbell, ClipboardCheck as ChalkboardTeacher, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ServiceApplicationForm from '../components/forms/ServiceApplicationForm';
import Button from '../components/ui/Button';
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

// Coaching service categories
const coachingCategories = [
  { value: 'yeni_mezun', label: 'Yeni Mezun Kariyer Koçluğu' },
  { value: 'uzman', label: 'Uzman Gelişim Koçluğu' },
  { value: 'yonetici_koclugu', label: 'Yönetici Koçluğu' },
  { value: 'takim_koclugu', label: 'Takım Koçluğu' },
  { value: 'emeklilik_sonrasi', label: 'Emeklilik Sonrası İkinci Kariyer Koçluğu' },
  { value: 'sporcu_performans', label: 'Sporcu Performans Koçluğu' },
  { value: 'genc_mentorlugu', label: 'Genç Mentörlüğü' }
];

// Coaching service details
const coachingServiceDetails = [
  {
    icon: UserGraduate,
    title: 'Yeni Mezun Kariyer Koçluğu',
    description: 'Eğitim hayatını tamamlamış olup iş yaşamına başlangıç yapmak isteyen kişileri kapsar.',
    details: 'İş hayatına yeni atılan bireylerin ne istediklerini keşfetmelerine, kendilerini en parlak hissedebilecekleri alanlarla ilgili farkındalık geliştirmelerine destek olan kariyer ve mentörlük programıdır. CV hazırlama teknikleri, kişilik envanteri, kariyer portallarını en doğru şekilde kullanım kılavuzluğu, mülakatlarda başarılı olmanın yolları gibi konularda farkındalık geliştiren bir programdır.',
    sessions: '10 seanstan oluşan bir paketi kapsar. (Takip seanslarından ücret alınmamaktadır.)'
  },
  {
    icon: UserTie,
    title: 'Uzman Gelişim Koçluğu',
    description: 'İş hayatında deneyimli profesyonelleri kapsar.',
    details: 'Mevcut işinde tatmin olmayan, motivasyonu düşen, farklı kariyer yolları arayan deneyimli çalışanlar ile iş yaşamına bir süre ara vermiş uzmanlığı olan kişilere yönelik kariyer ve mentörlük programıdır.',
    sessions: '10 seanstan oluşan bir paketi kapsar. (Takip seanslarından ücret alınmamaktadır.)'
  },
  {
    icon: Dumbbell,
    title: 'Sporcu Performans Koçluğu',
    description: 'Genç sporcuları ve profesyonel olarak spor yapan antrenör ve sporcuları kapsar.',
    details: 'Sporcuların en yüksek potansiyellerine ulaşmalarını sağlamak amacıyla fiziksel, zihinsel ve duygusal açıdan performans geliştirmeye yönelik çalışmaları kapsayan programdır.',
    sessions: '8 seans ve 2 takip görüşmesinden oluşan bir paketi kapsar. (2 Takip seanslarından ücret alınmamaktadır.)'
  },
  {
    icon: ChalkboardTeacher,
    title: 'Emeklilik Sonrası İkinci Kariyer Koçluğu',
    description: 'Emekli olmuş ve yeniden çalışmak isteyen kişileri kapsar.',
    details: 'Uzun soluklu iş yaşamı sonrası emekli olmuş ve yeniden iş hayatında yer edinmek isteyen kişilerin ikinci çalışma hayatlarında en motive olacakları işi bulmalarına destek olan koçluk programıdır.',
    sessions: '8 seans ve 2 takip görüşmesinden oluşan bir paketi kapsar. (2 Takip seanslarından ücret alınmamaktadır.)'
  },
  {
    icon: Users,
    title: 'Takım Koçluğu',
    description: 'Kurumsal şirketlerdeki departman çalışanlarını kapsar.',
    details: 'Şirketlerin çeşitli departmanlarında yer alan takım üyelerinin dayanışma ve ekip ruhunu artırmayı hedefleyen farkındalık geliştirici bir programdır.',
    sessions: 'Müşteri ihtiyacına göre özelleştirilir.'
  },
  {
    icon: UserCheck,
    title: 'Yönetici Koçluğu',
    description: 'Şirketlerin yönetim kadrolarında olan liderleri kapsar.',
    details: 'Yönetim kadrolarında çalışan profesyonellere yönelik, yetkinlik gelişimini hedefleyen, liderlik kapasitesinin güçlendirilmesini benimseyen bir programdır.',
    sessions: '8 seans ve 2 takip görüşmesinden oluşan bir paketi kapsar. (2 Takip seanslarından ücret alınmamaktadır.)'
  },
  {
    icon: UserCheck,
    title: 'Genç Mentörlüğü',
    description: 'Eğitim hayatı içinde olan bireyleri kapsar.',
    details: 'Üniversite sınavına hazırlanan gençlerin kişisel, akademik ve kariyer hedeflerine ulaşmalarını sağlayan, gençlerin kendi değerlerinin ve kişilik analizlerinin farkında olmalarını sağlayarak ona göre hedefler koymalarını teşvik eden mentörlük programıdır.',
    sessions: '8 seans ve 2 takip görüşmesinden oluşan bir paketi kapsar. (Takip seanslarından ücret alınmamaktadır.)'
  }
];

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
                  
                  {/* Koçluk sayfası için özel HTML içeriği */}
                  {isCoachingService ? (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: service.content }}
                    />
                  ) : (
                    <>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {service.content}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>

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
                  categories={isCoachingService ? coachingCategories : undefined}
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