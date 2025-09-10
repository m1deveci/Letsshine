import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, SiteSettings, Application, AboutContent, AboutSection, TeamMember } from '../types';

interface AppContextType {
  services: Service[];
  applications: Application[];
  settings: SiteSettings;
  aboutContent: AboutContent | null;
  teamMembers: TeamMember[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateAboutContent: (about: AboutContent) => void;
  addAboutSection: (section: Omit<AboutSection, 'id'>) => void;
  updateAboutSection: (id: string, section: Partial<AboutSection>) => void;
  deleteAboutSection: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Default services data
const defaultServices: Service[] = [
  {
    id: '1',
    title: 'İK Danışmanlığı',
    description: 'İş stratejinize uygun insan kaynakları politikaları ve süreç tasarımı',
    content: 'Stratejik İnsan Kaynakları danışmanlığı ile şirketinizin insan kaynakları süreçlerini optimize ediyoruz.',
    features: ['İK Strateji Planlaması', 'Organizasyonel Yapılanma', 'Çalışan El Kitabı', 'Ücret Yönetimi'],
    icon: 'Users',
    slug: 'ik-danismanligi',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Yetkinlik Bazlı İşe Alım',
    description: 'İş analizlerine dayalı, bilimsel yöntemlerle yetenek avı',
    content: 'Modern işe alım teknikleriyle doğru yetenek seçimi yapmanızı sağlıyoruz.',
    features: ['Yetkinlik Haritalama', 'Assessment Center', 'Psikometrik Değerlendirme'],
    icon: 'UserSearch',
    slug: 'yetkinlik-bazli-ise-alim',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Performans Yönetimi',
    description: 'Çalışan performansını artırmaya yönelik bütünsel sistemler',
    content: 'Performans değerlendirme sistemleriyle çalışan verimliliğini artırın.',
    features: ['KPI Tasarımı', '360° Değerlendirme', 'Geri Bildirim Kültürü'],
    icon: 'Target',
    slug: 'performans-yonetimi',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Kurumsal Eğitimler',
    description: 'İş sonuçlarını doğrudan etkileyen ölçülebilir eğitim programları',
    content: 'Özelleştirilmiş eğitim programlarıyla takım performansınızı artırın.',
    features: ['Liderlik Eğitimleri', 'Satış Eğitimleri', 'Kişisel Gelişim'],
    icon: 'GraduationCap',
    slug: 'kurumsal-egitimler',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Çalışan Deneyimi',
    description: 'Yeteneği elde tutmaya yönelik bütünsel çalışan deneyimi tasarımı',
    content: 'Çalışan memnuniyetini artırarak yetenekleri şirketinizde tutun.',
    features: ['Employer Branding', 'Çalışan Bağlılığı', 'İş-Yaşam Dengesi'],
    icon: 'Heart',
    slug: 'calisan-deneyimi',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    title: 'Koçluk',
    description: 'Kişisel ve profesyonel gelişiminiz için özelleştirilmiş koçluk hizmetleri',
    content: `<div class="coaching-services">
      <div class="hero-section">
        <h2 class="section-title">Koçluk Hizmetlerimiz</h2>
        <p class="section-subtitle">Farklı yaşam dönemlerinde ve kariyer aşamalarında size özel koçluk desteği</p>
      </div>
      
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h3>Yeni Mezun Koçluğu</h3>
          <p>Kariyer yolculuğuna doğru adımlarla başlamanız için rehberlik ve destek</p>
          <ul>
            <li>Kariyer yönlendirme ve planlama</li>
            <li>İş arama stratejileri</li>
            <li>Mülakat hazırlığı</li>
            <li>Profesyonel kimlik geliştirme</li>
            <li>Network kurma teknikleri</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <h3>Uzman Koçluğu</h3>
          <p>Kariyerinizde bir üst seviyeye çıkmak için stratejik rehberlik</p>
          <ul>
            <li>Kariyer geçiş yönetimi</li>
            <li>Liderlik becerilerini geliştirme</li>
            <li>İş-yaşam dengesi kurma</li>
            <li>Performans optimizasyonu</li>
            <li>Stres yönetimi teknikleri</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-user-clock"></i>
          </div>
          <h3>Emeklilik Sonrası İkinci Kariyer</h3>
          <p>Emeklilik sonrası yeni kariyer fırsatları için rehberlik</p>
          <ul>
            <li>İkinci kariyer planlaması</li>
            <li>Yetenek ve deneyim değerlendirmesi</li>
            <li>Yaşam amacı keşfi</li>
            <li>Girişimcilik desteği</li>
            <li>Mentorluk becerilerini geliştirme</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-users"></i>
          </div>
          <h3>Yönetici Koçluğu</h3>
          <p>Liderlik kapasitesini geliştirmek isteyen yöneticiler için</p>
          <ul>
            <li>Liderlik tarzı geliştirme</li>
            <li>Takım yönetimi becerileri</li>
            <li>Karar verme süreçlerini güçlendirme</li>
            <li>İletişim becerilerini artırma</li>
            <li>Değişim yönetimi</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-running"></i>
          </div>
          <h3>Sporcu Performans Koçluğu</h3>
          <p>Sporcuların zihinsel ve fiziksel performansını artırmaya yönelik koçluk</p>
          <ul>
            <li>Mental dayanıklılık geliştirme</li>
            <li>Odaklanma teknikleri</li>
            <li>Motivasyon artırma</li>
            <li>Stresle başa çıkma</li>
            <li>Hedef belirleme ve takip</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-child"></i>
          </div>
          <h3>Genç Mentörlüğü</h3>
          <p>Gençlerin kişisel gelişimi ve geleceğe hazırlanması için rehberlik</p>
          <ul>
            <li>Kişisel değerleri keşfetme</li>
            <li>Hedef belirleme ve planlama</li>
            <li>İletişim becerilerini geliştirme</li>
            <li>Öz güven artırma</li>
            <li>Sosyal beceriler geliştirme</li>
          </ul>
        </div>
        
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-handshake"></i>
          </div>
          <h3>Takım Koçluğu</h3>
          <p>Takımların sinerjisini artırarak ortak hedeflere ulaşmalarında destek</p>
          <ul>
            <li>Takım dinamiklerini güçlendirme</li>
            <li>İletişim kanallarını optimize etme</li>
            <li>Çatışma çözme teknikleri</li>
            <li>Ortak vizyon oluşturma</li>
            <li>Performans artırma stratejileri</li>
          </ul>
        </div>
      </div>
      
      <div class="coaching-approach">
        <h3>Koçluk Yaklaşımımız</h3>
        <div class="approach-grid">
          <div class="approach-item">
            <h4>Kişiye Özel</h4>
            <p>Her birey benzersizdir. Koçluk sürecimizi tamamen sizin ihtiyaçlarınıza göre tasarlıyoruz.</p>
          </div>
          <div class="approach-item">
            <h4>Sonuç Odaklı</h4>
            <p>Belirlenen hedeflere ulaşmak için somut ve ölçülebilir adımlar atıyoruz.</p>
          </div>
          <div class="approach-item">
            <h4>Sürdürülebilir</h4>
            <p>Kalıcı değişim yaratmak için uzun vadeli destek ve takip sağlıyoruz.</p>
          </div>
        </div>
      </div>
      
      <div class="process-section">
        <h3>Koçluk Süreci</h3>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <h4>Keşif ve Değerlendirme</h4>
            <p>Mevcut durumunuzu ve hedeflerinizi belirlemek için detaylı görüşme</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h4>Plan Oluşturma</h4>
            <p>Size özel koçluk programı ve eylem planı hazırlama</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h4>Uygulama</h4>
            <p>Düzenli seanslarla hedefe yönelik adımları atma</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h4>Takip ve Değerlendirme</h4>
            <p>İlerlemenizi izleme ve gerekli düzenlemeleri yapma</p>
          </div>
        </div>
      </div>
    </div>`,
    features: ['Yeni Mezun Kariyer Koçluğu', 'Uzman Gelişim Koçluğu', 'Yönetici Koçluğu', 'Takım Koçluğu', 'Emeklilik Sonrası İkinci Kariyer Koçluğu', 'Sporcu Performans Koçluğu', 'Genç Mentörlüğü'],
    icon: 'MessageCircle',
    slug: 'kocluk',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    title: 'Ücretlendirme',
    description: 'Şirketlere özel adil ve sürdürülebilir ücret yönetimi',
    content: 'Ücret yapınızı adil ve rekabetçi hale getirin.',
    features: ['Ücret Skalası Oluşturma', 'Pazar Araştırması', 'İş Değerlendirme', 'Yan Haklar Sistemi', 'Performans Bazlı Ücretlendirme'],
    icon: 'DollarSign',
    slug: 'ucretlendirme',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const defaultSettings: SiteSettings = {
  title: "Let's Shine - İnsan Kaynakları Danışmanlığı",
  description: "İnsan Kaynakları Danışmanlığında Güvenilir Çözüm Ortağınız. Stratejik İnsan Kaynakları danışmanlığı, Koçluk & Mentorluk, Psikolojik Danışmanlık alanlarında profesyonel hizmet.",
  phone: "+90 (XXX) XXX XX XX",
  email: "info@letsshine.com",
  address: "İzmir, Türkiye",
  socialMedia: {},
  smtp: {
    host: "",
    port: 587,
    username: "",
    password: "",
    fromEmail: "info@letsshine.com"
  }
};

const defaultAboutContent: AboutContent = {
  id: '1',
  title: 'Hakkımızda',
  subtitle: 'İnsan Kaynakları alanında güvenilir çözüm ortağınız',
  content: '<p>Let\'s Shine olarak, insan kaynakları alanında profesyonel danışmanlık hizmetleri sunuyoruz. Yılların verdiği deneyim ve modern yaklaşımlarla, organizasyonların en değerli varlığı olan insan kaynağını optimize etmeye odaklanıyoruz.</p>',
  sections: [
    {
      id: '1',
      title: 'Misyonumuz',
      content: '<p>İnsan odaklı yaklaşımımızla, organizasyonların sürdürülebilir başarıya ulaşması için stratejik insan kaynakları çözümleri geliştirmek ve uygulamaktır.</p>',
      order: 1,
      type: 'text'
    },
    {
      id: '2',
      title: 'Vizyonumuz',
      content: '<p>İnsan kaynakları danışmanlığında öncü ve güvenilir bir marka olmak, müşterilerimizin iş sonuçlarına doğrudan katkı sağlayan çözümler sunmaktır.</p>',
      order: 2,
      type: 'text'
    }
  ],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

interface AppProviderProps {
  children: ReactNode;
}

// Default applications data (test için)
const defaultApplications: Application[] = [
  {
    id: '1',
    name: 'Test Kullanıcı',
    email: 'test@example.com',
    phone: '+90 555 123 45 67',
    serviceId: '6',
    serviceName: 'Koçluk',
    category: 'yeni_mezun',
    message: 'Yeni mezun koçluk hizmeti almak istiyorum.',
    status: 'pending',
    createdAt: new Date()
  }
];

// Default team members data
const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Ayşe Demir',
    title: 'Kurucu & İnsan Kaynakları Uzmanı',
    bio: '15+ yıllık deneyimiyle İnsan Kaynakları ve Organizasyonel Gelişim alanında uzman. Stratejik İK danışmanlığı ve liderlik koçluğu konularında sertifikalı.',
    email: 'ayse.demir@letsshine.com.tr',
    linkedin: 'https://linkedin.com/in/ayse-demir',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    order: 1,
    isActive: true,
    expertise: ['Stratejik İK', 'Liderlik Koçluğu', 'Organizasyonel Gelişim'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    title: 'Kıdemli İK Danışmanı',
    bio: '10+ yıllık tecrübesiyle yetenek kazanımı ve performans yönetimi alanlarında uzman. Uluslararası sertifikalara sahip İK profesyoneli.',
    email: 'mehmet.kaya@letsshine.com.tr',
    linkedin: 'https://linkedin.com/in/mehmet-kaya',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    order: 2,
    isActive: true,
    expertise: ['Yetenek Kazanımı', 'Performans Yönetimi', 'İşe Alım'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Zeynep Özkan',
    title: 'Koçluk ve Eğitim Uzmanı',
    bio: 'ICF sertifikalı profesyonel koç ve eğitmen. Kişisel gelişim, kariyer koçluğu ve kurumsal eğitimler konularında uzman.',
    email: 'zeynep.ozkan@letsshine.com.tr',
    linkedin: 'https://linkedin.com/in/zeynep-ozkan',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b412?w=400&h=400&fit=crop&crop=face',
    order: 3,
    isActive: true,
    expertise: ['Kariyer Koçluğu', 'Kurumsal Eğitim', 'Kişisel Gelişim'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [applications, setApplications] = useState<Application[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(defaultAboutContent);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);

  const addService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, ...serviceData, updatedAt: new Date() }
        : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const addApplication = (applicationData: Omit<Application, 'id' | 'createdAt' | 'status'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date()
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateAboutContent = (newAboutContent: AboutContent) => {
    setAboutContent({ ...newAboutContent, updatedAt: new Date() });
  };

  const addAboutSection = (sectionData: Omit<AboutSection, 'id'>) => {
    if (!aboutContent) return;
    
    const newSection: AboutSection = {
      ...sectionData,
      id: Date.now().toString()
    };
    
    setAboutContent(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSection].sort((a, b) => a.order - b.order),
      updatedAt: new Date()
    } : null);
  };

  const updateAboutSection = (id: string, sectionData: Partial<AboutSection>) => {
    if (!aboutContent) return;
    
    setAboutContent(prev => prev ? {
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, ...sectionData } : section
      ).sort((a, b) => a.order - b.order),
      updatedAt: new Date()
    } : null);
  };

  const deleteAboutSection = (id: string) => {
    if (!aboutContent) return;
    
    setAboutContent(prev => prev ? {
      ...prev,
      sections: prev.sections.filter(section => section.id !== id),
      updatedAt: new Date()
    } : null);
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTeamMembers(prev => [...prev, newMember].sort((a, b) => a.order - b.order));
  };

  const updateTeamMember = (id: string, memberData: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, ...memberData, updatedAt: new Date() }
        : member
    ).sort((a, b) => a.order - b.order));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const value = {
    services,
    applications,
    settings,
    aboutContent,
    teamMembers,
    addService,
    updateService,
    deleteService,
    addApplication,
    updateApplicationStatus,
    updateSettings,
    updateAboutContent,
    addAboutSection,
    updateAboutSection,
    deleteAboutSection,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};