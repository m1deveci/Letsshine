import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-slate-100 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Let's Shine Logo" 
                  className="w-8 h-8 object-contain mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">LS</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-800">Let's Shine</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              İnsan Kaynakları alanında profesyonel danışmanlık hizmetleri sunuyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-slate-700">{settings.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-slate-700">{settings.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-slate-700">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gizlilik-politikasi" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-sartlari" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Sosyal Medya</h3>
            <div className="flex space-x-3">
              {settings.socialMedia?.linkedin && (
                <a
                  href={settings.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-blue-600 rounded-lg transition-colors duration-300 group shadow-sm border border-slate-200"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-600 group-hover:text-white" />
                </a>
              )}
              {settings.socialMedia?.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-pink-600 rounded-lg transition-colors duration-300 group shadow-sm border border-slate-200"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5 text-slate-600 group-hover:text-white" />
                </a>
              )}
              {settings.socialMedia?.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-blue-700 rounded-lg transition-colors duration-300 group shadow-sm border border-slate-200"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5 text-slate-600 group-hover:text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2025 Let's Shine. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/gizlilik-politikasi" className="text-slate-500 text-sm hover:text-blue-600">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-sartlari" className="text-slate-500 text-sm hover:text-blue-600">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;