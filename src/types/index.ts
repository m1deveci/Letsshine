export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tooltip?: string;
  value: string;
}

export interface ServiceProperty {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'url' | 'email';
  isRequired?: boolean;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  content: string;
  features: string[];
  properties?: ServiceProperty[];
  categories?: ServiceCategory[];
  icon: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  category?: string;
  selectedFeatures?: string[];
  message?: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  createdAt: Date;
}

export interface SiteSettings {
  title: string;
  subtitle?: string;
  description: string;
  logo?: string;
  favicon?: string;
  phone: string;
  email: string;
  address: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
}


export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  image?: string;
  role: 'founder' | 'consultant';
  parentId?: number;
  orderIndex: number;
  isActive: boolean;
  expertise: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
  readStatus: boolean;
  replyStatus: boolean;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: {
    number: string;
    label: string;
  }[];
  heroImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  isExternal?: boolean;
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutSlogan {
  category: string;
  items: string[];
}

export interface AboutContent {
  id?: string;
  manifesto: string;
  mission: string;
  vision: string;
  values: AboutValue[];
  slogans: AboutSlogan[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}