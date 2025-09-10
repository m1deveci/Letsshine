export interface Service {
  id: string;
  title: string;
  description: string;
  content: string;
  features: string[];
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
  message?: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  createdAt: Date;
}

export interface SiteSettings {
  title: string;
  description: string;
  logo?: string;
  favicon?: string;
  phone: string;
  email: string;
  address: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
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

export interface AboutContent {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // Rich text content
  heroImage?: string;
  sections: AboutSection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string; // Rich text content
  image?: string;
  order: number;
  type: 'text' | 'image-text' | 'text-image' | 'full-image';
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  image?: string;
  order: number;
  isActive: boolean;
  expertise: string[];
  createdAt: Date;
  updatedAt: Date;
}