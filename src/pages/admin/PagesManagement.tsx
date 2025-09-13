import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Settings, Layout, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PagesManagement: React.FC = () => {
  const pages = [
    {
      id: 'hero',
      title: 'Ana Sayfa (Hero)',
      description: 'Ana sayfa hero bölümü içeriğini yönetin',
      icon: Layout,
      path: '/admin/pages/hero',
      color: 'bg-blue-500'
    },
    {
      id: 'navigation',
      title: 'Menü Yönetimi',
      description: 'Header menü öğelerini yönetin',
      icon: Navigation,
      path: '/admin/pages/navigation',
      color: 'bg-green-500'
    },
    {
      id: 'about',
      title: 'Hakkımızda',
      description: 'Hakkımızda sayfası içeriğini yönetin',
      icon: FileText,
      path: '/admin/about',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sayfa Yönetimi</h1>
        <p className="text-gray-600">Sitenizin sayfalarını ve içeriklerini yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center mr-4`}>
                    <page.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{page.description}</p>
                
                <Link to={page.path}>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    leftIcon={<Edit className="w-4 h-4" />}
                  >
                    Düzenle
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/settings">
                <Button 
                  variant="outline" 
                  className="w-full"
                  leftIcon={<Settings className="w-4 h-4" />}
                >
                  Site Ayarları
                </Button>
              </Link>
              <Link to="/admin/services">
                <Button 
                  variant="outline" 
                  className="w-full"
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Hizmetler
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PagesManagement;
