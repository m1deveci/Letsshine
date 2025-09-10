import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Service } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import ServiceModal from '../../components/ServiceModal';

const ServicesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { services, addService, updateService, deleteService } = useApp();

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || service.isActive;
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = (service: Service) => {
    updateService(service.id, { isActive: !service.isActive });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      deleteService(serviceId);
    }
  };

  const handleSave = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> | Service) => {
    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService(serviceData);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hizmet Yönetimi
          </h1>
          <p className="text-gray-600">
            Hizmetlerinizi yönetin, düzenleyin ve yenilerini ekleyin
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
        >
          Yeni Hizmet Ekle
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Hizmet ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Pasif hizmetleri göster
                </span>
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredServices.map((service) => (
          <Card key={service.id} className={`${!service.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {service.description}
                </p>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`p-2 rounded-md transition-colors ${
                    service.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={service.isActive ? 'Pasif yap' : 'Aktif yap'}
                >
                  {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                  {feature}
                </div>
              ))}
              {service.features.length > 3 && (
                <p className="text-sm text-gray-500 ml-3.5">
                  +{service.features.length - 3} diğer özellik
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Slug: {service.slug}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                service.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {service.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </Card>
        ))}
      </motion.div>

      {filteredServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">
            {searchTerm ? 'Arama kriterlerinize uygun hizmet bulunamadı' : 'Henüz hizmet eklenmemiş'}
          </p>
        </motion.div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSave}
        service={editingService}
      />
    </div>
  );
};

export default ServicesManagement;