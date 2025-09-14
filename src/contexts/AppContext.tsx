import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, SiteSettings, Application, TeamMember, HeroContent, NavigationItem } from '../types';

interface AppContextType {
  services: Service[];
  applications: Application[];
  settings: SiteSettings;
  teamMembers: TeamMember[];
  heroContent: HeroContent | null;
  navigationItems: NavigationItem[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  updateHeroContent: (hero: HeroContent) => void;
  addNavigationItem: (item: Omit<NavigationItem, 'id'>) => void;
  updateNavigationItem: (id: string, item: Partial<NavigationItem>) => void;
  deleteNavigationItem: (id: string) => void;
  refreshUnreadMessagesCount?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Default services data removed - using database instead

// const defaultSettings: SiteSettings = {
//   title: "Let's Shine - İnsan Kaynakları Danışmanlığı",
//   description: "İnsan Kaynakları Danışmanlığında Güvenilir Çözüm Ortağınız. Stratejik İnsan Kaynakları danışmanlığı, Koçluk & Mentorluk, Psikolojik Danışmanlık alanlarında profesyonel hizmet.",
//   phone: "+90 (XXX) XXX XX XX",
//   email: "info@letsshine.com",
//   address: "İzmir, Türkiye",
//   socialMedia: {},
//   smtp: {
//     host: "",
//     port: 587,
//     username: "",
//     password: "",
//     fromEmail: "info@letsshine.com"
//   }
// };


const defaultHeroContent: HeroContent = {
  id: '1',
  title: 'İnsan Odaklı İK Çözümleri ile Geleceği Şekillendirin',
  subtitle: '25+ yıllık deneyimimiz ve uzman ekibimizle, organizasyonunuzun insan kaynakları potansiyelini maksimuma çıkarıyoruz.',
  description: 'Stratejik danışmanlık, koçluk ve psikolojik destek hizmetlerimizle, kurumsal eğitimlerimizle yanınızdayız.',
  features: [
    'Stratejik İnsan Kaynakları Danışmanlığı',
    'Stratejik Danışmanlık',
    'Koçluk & Mentorluk Hizmetleri',
    'Kurumsal Psikolojik Danışmanlık ve Destek',
    'Kurumsal Eğitimler'
  ],
  stats: [
    { number: '30+', label: 'Başarılı Proje' },
    { number: '25+', label: 'Yıllık Deneyim' },
    { number: '210+', label: 'Mutlu Müşteri' }
  ],
  heroImage: '/uploads/logo1.png',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const defaultNavigationItems: NavigationItem[] = [
  { id: '1', name: 'Ana Sayfa', href: '/', order: 1, isActive: true },
  { id: '2', name: 'Ekibimiz', href: '/ekibimiz', order: 2, isActive: true },
  { id: '3', name: 'Hizmetlerimiz', href: '/hizmetler', order: 3, isActive: true },
  { id: '4', name: 'İletişim', href: '/iletisim', order: 4, isActive: true }
];

interface AppProviderProps {
  children: ReactNode;
}

// Default applications data (test için) - commented out as using database
// const defaultApplications: Application[] = [
//   {
//     id: '1',
//     name: 'Test Kullanıcı',
//     email: 'test@example.com',
//     phone: '+90 555 123 45 67',
//     serviceId: '6',
//     serviceName: 'Koçluk',
//     category: 'yeni_mezun',
//     message: 'Yeni mezun koçluk hizmeti almak istiyorum.',
//     status: 'pending',
//     createdAt: new Date()
//   }
// ];

// Default team members data - commented out as using database
// const defaultTeamMembers: TeamMember[] = [
//   {
//     id: '1',
//     name: 'Dr. Ayşe Demir',
//     title: 'Kurucu & İnsan Kaynakları Uzmanı',
//     bio: '25+ yıllık deneyimiyle İnsan Kaynakları ve Organizasyonel Gelişim alanında uzman. Stratejik İK danışmanlığı ve liderlik koçluğu konularında sertifikalı.',
//     email: 'ayse.demir@letsshine.com.tr',
//     linkedin: 'https://linkedin.com/in/ayse-demir',
//     image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
//     order: 1,
//     isActive: true,
//     expertise: ['Stratejik İK', 'Liderlik Koçluğu', 'Organizasyonel Gelişim'],
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     id: '2',
//     name: 'Mehmet Kaya',
//     title: 'Kıdemli İK Danışmanı',
//     bio: '10+ yıllık tecrübesiyle yetenek kazanımı ve performans yönetimi alanlarında uzman. Uluslararası sertifikalara sahip İK profesyoneli.',
//     email: 'mehmet.kaya@letsshine.com.tr',
//     linkedin: 'https://linkedin.com/in/mehmet-kaya',
//     image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
//     order: 2,
//     isActive: true,
//     expertise: ['Yetenek Kazanımı', 'Performans Yönetimi', 'İşe Alım'],
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     id: '3',
//     name: 'Zeynep Özkan',
//     title: 'Koçluk ve Eğitim Uzmanı',
//     bio: 'ICF sertifikalı profesyonel koç ve eğitmen. Kişisel gelişim, kariyer koçluğu ve kurumsal eğitimler konularında uzman.',
//     email: 'zeynep.ozkan@letsshine.com.tr',
//     linkedin: 'https://linkedin.com/in/zeynep-ozkan',
//     image: 'https://images.unsplash.com/photo-1494790108755-2616b612b412?w=400&h=400&fit=crop&crop=face',
//     order: 3,
//     isActive: true,
//     expertise: ['Kariyer Koçluğu', 'Kurumsal Eğitim', 'Kişisel Gelişim'],
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }
// ];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    title: "Let's Shine",
    subtitle: 'İnsan Kaynakları',
    description: 'İnsan Kaynakları Danışmanlığı',
    logo: '',
    favicon: '',
    phone: '+90 212 123 45 67',
    email: 'info@letsshine.com.tr',
    address: 'İstanbul, Türkiye',
    socialMedia: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: ''
    },
    smtp: {
      host: '',
      port: 587,
      username: '',
      password: '',
      fromEmail: 'info@letsshine.com.tr'
    }
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(defaultHeroContent);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(defaultNavigationItems);

  // Database'den veri çekme fonksiyonları
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.error('Failed to fetch settings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((service: Service) => ({
          ...service,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt)
        }));
        setServices(formattedData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((app: Application) => ({
          ...app,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt)
        }));
        setApplications(formattedData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };


  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((member: TeamMember) => ({
          ...member,
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt)
        }));
        setTeamMembers(formattedData);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  // Component mount olduğunda verileri çek
  useEffect(() => {
    fetchServices();
    fetchApplications();
    fetchSettings();
    fetchTeamMembers();
    fetchHeroContent();
  }, []);

  // Favicon'u güncelle
  useEffect(() => {
    if (settings.favicon) {
      // Mevcut favicon linklerini kaldır
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());
      
      // Yeni favicon link'i oluştur
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = settings.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
      
      // Apple touch icon için de ekle
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = settings.favicon;
      document.getElementsByTagName('head')[0].appendChild(appleLink);
    }
  }, [settings.favicon]);

  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(serviceData)
      });
      
      if (response.ok) {
        const newService = await response.json();
        setServices(prev => [...prev, {
          ...newService,
          createdAt: new Date(newService.createdAt),
          updatedAt: new Date(newService.updatedAt)
        }]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hizmet eklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(serviceData)
      });
      
      if (response.ok) {
        const updatedService = await response.json();
        setServices(prev => prev.map(service => 
          service.id === id 
            ? { ...updatedService, createdAt: new Date(updatedService.createdAt), updatedAt: new Date(updatedService.updatedAt) }
            : service
        ));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hizmet güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const deleteService = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });
      
      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hizmet silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error; // Re-throw to let the calling component handle it
    }
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

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      // Update local state immediately for UI responsiveness
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Get token from sessionStorage
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
      
      // Save to backend
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        // Update local state with server response
        setSettings(updatedData);
      } else {
        console.error('Failed to update settings on server:', response.status);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };


  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      });
      
      if (response.ok) {
        const newMember = await response.json();
        setTeamMembers(prev => [...prev, {
          ...newMember,
          createdAt: new Date(newMember.createdAt),
          updatedAt: new Date(newMember.updatedAt)
        }].sort((a, b) => a.order - b.order));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ekip üyesi eklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      });
      
      if (response.ok) {
        const updatedMember = await response.json();
        setTeamMembers(prev => prev.map(member => 
          member.id === id 
            ? { ...updatedMember, createdAt: new Date(updatedMember.createdAt), updatedAt: new Date(updatedMember.updatedAt) }
            : member
        ).sort((a, b) => a.order - b.order));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ekip üyesi güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTeamMembers(prev => prev.filter(member => member.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ekip üyesi silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  // Hero Content Management
  const fetchHeroContent = async () => {
    try {
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        setHeroContent({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        });
      } else {
        // Use default if not found
        setHeroContent(defaultHeroContent);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      setHeroContent(defaultHeroContent);
    }
  };

  const updateHeroContent = async (hero: HeroContent) => {
    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hero)
      });
      
      if (response.ok) {
        const updatedHero = await response.json();
        setHeroContent({
          ...updatedHero,
          createdAt: new Date(updatedHero.createdAt),
          updatedAt: new Date(updatedHero.updatedAt)
        });
      } else {
        throw new Error('Failed to update hero content');
      }
    } catch (error) {
      console.error('Error updating hero content:', error);
      throw error;
    }
  };

  // Navigation Management
  const addNavigationItem = (item: Omit<NavigationItem, 'id'>) => {
    const newItem: NavigationItem = {
      ...item,
      id: Date.now().toString()
    };
    setNavigationItems(prev => [...prev, newItem].sort((a, b) => a.order - b.order));
  };

  const updateNavigationItem = (id: string, item: Partial<NavigationItem>) => {
    setNavigationItems(prev => 
      prev.map(navItem => 
        navItem.id === id 
          ? { ...navItem, ...item }
          : navItem
      ).sort((a, b) => a.order - b.order)
    );
  };

  const deleteNavigationItem = (id: string) => {
    setNavigationItems(prev => prev.filter(item => item.id !== id));
  };

  // Function to refresh unread messages count (will be set by AdminLayout)
  const [refreshUnreadMessagesCount, setRefreshUnreadMessagesCount] = useState<(() => void) | undefined>(undefined);

  const value = {
    services,
    applications,
    settings,
    teamMembers,
    heroContent,
    navigationItems,
    addService,
    updateService,
    deleteService,
    addApplication,
    updateApplicationStatus,
    updateSettings,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateHeroContent,
    addNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    refreshUnreadMessagesCount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};