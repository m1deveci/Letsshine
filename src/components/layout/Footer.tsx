import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Footer: React.FC = () => {
  const { settings, services } = useApp();

  const serviceCategories = [
    'İşe Alım',
    'Eğitim',
    'Motivasyonel Faaliyetler',
    'Organizasyonel Yapılanma',
    'Performans ve Gelişim',
    'Ücretlendirme'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <h3 className="text-lg font-bold">Let's Shine</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              İnsan Kaynakları alanında profesyonel danışmanlık hizmetleri sunuyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">{settings.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">{settings.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {serviceCategories.map((service) => (
                <li key={service}>
                  <span className="text-gray-300 text-sm hover:text-white transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 text-sm hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="text-gray-300 text-sm hover:text-white transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-gray-300 text-sm hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gizlilik-politikasi" className="text-gray-300 text-sm hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-sartlari" className="text-gray-300 text-sm hover:text-white transition-colors">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Let's Shine. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/gizlilik-politikasi" className="text-gray-400 text-sm hover:text-white">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-sartlari" className="text-gray-400 text-sm hover:text-white">
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