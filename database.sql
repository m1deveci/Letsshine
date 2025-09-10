-- Let's Shine Database Schema
-- PostgreSQL Database Creation Script

-- Users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    icon VARCHAR(100) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service_id INTEGER REFERENCES services(id),
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, role) VALUES 
('admin@letsshine.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyc5rfjlxXIjd1MTGQXGFW', 'admin');

-- Insert default services
INSERT INTO services (title, description, content, features, icon, slug) VALUES 
('İK Danışmanlığı', 
 'İş stratejinize uygun insan kaynakları politikaları ve süreç tasarımı',
 'Stratejik İnsan Kaynakları danışmanlığı ile şirketinizin insan kaynakları süreçlerini optimize ediyoruz.',
 '["İK Strateji Planlaması", "Organizasyonel Yapılanma", "Çalışan El Kitabı", "Ücret Yönetimi"]',
 'Users',
 'ik-danismanligi'),

('Yetkinlik Bazlı İşe Alım',
 'İş analizlerine dayalı, bilimsel yöntemlerle yetenek avı',
 'Modern işe alım teknikleriyle doğru yetenek seçimi yapmanızı sağlıyoruz.',
 '["Yetkinlik Haritalama", "Assessment Center", "Psikometrik Değerlendirme"]',
 'UserSearch',
 'yetkinlik-bazli-ise-alim'),

('Performans Yönetimi',
 'Çalışan performansını artırmaya yönelik bütünsel sistemler',
 'Performans değerlendirme sistemleriyle çalışan verimliliğini artırın.',
 '["KPI Tasarımı", "360° Değerlendirme", "Geri Bildirim Kültürü"]',
 'Target',
 'performans-yonetimi'),

('Kurumsal Eğitimler',
 'İş sonuçlarını doğrudan etkileyen ölçülebilir eğitim programları',
 'Özelleştirilmiş eğitim programlarıyla takım performansınızı artırın.',
 '["Liderlik Eğitimleri", "Satış Eğitimleri", "Kişisel Gelişim"]',
 'GraduationCap',
 'kurumsal-egitimler'),

('Çalışan Deneyimi',
 'Yeteneği elde tutmaya yönelik bütünsel çalışan deneyimi tasarımı',
 'Çalışan memnuniyetini artırarak yetenekleri şirketinizde tutun.',
 '["Employer Branding", "Çalışan Bağlılığı", "İş-Yaşam Dengesi"]',
 'Heart',
 'calisan-deneyimi'),

('Koçluk',
 'Bireysel ve profesyonel gelişim koçluğu hizmetleri',
 'Yeni Mezun, Uzman, Emeklilik Sonrası İkinci Kariyer Hizmetleri',
 '["Yeni Mezun Kariyer Koçluğu", "Uzman Gelişim Koçluğu", "Yönetici Koçluğu", "Takım Koçluğu", "Emeklilik Sonrası İkinci Kariyer Koçluğu", "Sporcu Performans Koçluğu", "Genç Mentörlüğü"]',
 'MessageCircle',
 'kocluk'),

('Ücretlendirme',
 'Şirketlere özel adil ve sürdürülebilir ücret yönetimi',
 'Ücret yapınızı adil ve rekabetçi hale getirin.',
 '["Ücret Skalası Oluşturma", "Pazar Araştırması", "İş Değerlendirme", "Yan Haklar Sistemi", "Performans Bazlı Ücretlendirme"]',
 'DollarSign',
 'ucretlendirme');

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('site_info', '{
  "title": "Let''s Shine - İnsan Kaynakları Danışmanlığı",
  "description": "İnsan Kaynakları Danışmanlığında Güvenilir Çözüm Ortağınız. Stratejik İnsan Kaynakları danışmanlığı, Koçluk & Mentorluk, Psikolojik Danışmanlık alanlarında profesyonel hizmet.",
  "phone": "+90 (XXX) XXX XX XX",
  "email": "info@letsshine.com",
  "address": "İzmir, Türkiye"
}'),
('social_media', '{
  "linkedin": "",
  "twitter": "",
  "instagram": ""
}'),
('smtp_config', '{
  "host": "",
  "port": 587,
  "username": "",
  "password": "",
  "fromEmail": "info@letsshine.com"
}');

-- Create indexes for better performance
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_applications_service_id ON applications(service_id);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();