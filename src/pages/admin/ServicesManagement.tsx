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
import Swal from 'sweetalert2';

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

  const handleDelete = async (serviceId: string) => {
    const result = await Swal.fire({
      title: 'Hizmeti Sil',
      text: 'Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteService(serviceId);
        await Swal.fire({
          title: 'Silindi!',
          text: 'Hizmet başarıyla silindi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Hizmet silinirken hata oluştu.';
        await Swal.fire({
          title: 'Hata!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      }
    }
  };

  const handleSave = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> | Service) => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Hizmet başarıyla güncellendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await addService(serviceData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Yeni hizmet başarıyla eklendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Hizmet kaydedilirken hata oluştu.';
      await Swal.fire({
        title: 'Hata!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
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
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <Input
                placeholder="Hizmet ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center justify-center sm:justify-start">
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
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

            {/* Properties Section */}
            {service.properties && service.properties.length > 0 && (
              <div className="border-t border-gray-200 pt-3 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Hizmet Özellikleri:</p>
                <div className="space-y-1">
                  {service.properties.slice(0, 2).map((property, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">{property.key}:</span>
                      <span className="text-blue-600 font-semibold">{property.value}</span>
                    </div>
                  ))}
                  {service.properties.length > 2 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{service.properties.length - 2} diğer özellik
                    </p>
                  )}
                </div>
              </div>
            )}

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