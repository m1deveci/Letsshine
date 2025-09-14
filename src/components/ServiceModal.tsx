import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Plus, Trash2, Image, Link, Type, Settings } from 'lucide-react';
import { Service, ServiceProperty } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import RichTextEditor from './ui/RichTextEditor';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> | Service) => void;
  service?: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    features: [] as string[],
    properties: [] as ServiceProperty[],
    icon: 'Users',
    slug: '',
    isActive: true
  });
  const [newFeature, setNewFeature] = useState('');
  const [newProperty, setNewProperty] = useState({
    key: '',
    value: '',
    type: 'text' as const,
    isRequired: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        content: service.content,
        features: service.features,
        properties: service.properties || [],
        icon: service.icon,
        slug: service.slug,
        isActive: service.isActive
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        features: [],
        properties: [],
        icon: 'Users',
        slug: '',
        isActive: true
      });
    }
  }, [service]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addProperty = () => {
    if (newProperty.key.trim() && newProperty.value.trim()) {
      const property: ServiceProperty = {
        id: Date.now().toString(),
        key: newProperty.key.trim(),
        value: newProperty.value.trim(),
        type: newProperty.type,
        isRequired: newProperty.isRequired,
        order: formData.properties.length
      };
      setFormData(prev => ({
        ...prev,
        properties: [...prev.properties, property]
      }));
      setNewProperty({
        key: '',
        value: '',
        type: 'text',
        isRequired: false
      });
    }
  };

  const removeProperty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const updateProperty = (index: number, field: keyof ServiceProperty, value: any) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.map((prop, i) =>
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (service) {
        onSave({ ...service, ...formData });
      } else {
        onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Service save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconOptions = [
    { value: 'Users', label: 'Kullanıcılar' },
    { value: 'UserSearch', label: 'Kullanıcı Arama' },
    { value: 'Target', label: 'Hedef' },
    { value: 'GraduationCap', label: 'Mezuniyet' },
    { value: 'Heart', label: 'Kalp' },
    { value: 'MessageCircle', label: 'Mesaj' },
    { value: 'DollarSign', label: 'Para' },
    { value: 'Star', label: 'Yıldız' },
    { value: 'Award', label: 'Ödül' },
    { value: 'Briefcase', label: 'Çanta' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-100"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  {service ? (
                    <>
                      <Image className="w-6 h-6 mr-3 text-blue-600" />
                      Hizmet Düzenle
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 mr-3 text-green-600" />
                      Yeni Hizmet Ekle
                    </>
                  )}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {service ? 'Mevcut hizmeti düzenleyin' : 'Yeni bir hizmet oluşturun'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all duration-200 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Hizmet Başlığı *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Örn: İnsan Kaynakları Danışmanlığı"
                      required
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      URL Slug *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="insan-kaynaklari-danismanligi"
                      required
                    />
                    <p className="text-xs text-gray-500">URL'de görünecek kısım</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Kısa Açıklama *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Hizmetin kısa ve öz açıklamasını yazın..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Bu açıklama hizmet kartlarında görünecek</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Detaylı İçerik
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Hizmetin detaylı açıklamasını yazın..."
                    height={250}
                    className="mb-4"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İkon
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Aktif
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Özellikler
                  </label>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Yeni özellik ekleyin (örn: 7/24 Destek)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addFeature}
                        variant="secondary"
                        disabled={!newFeature.trim()}
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Ekle
                      </Button>
                    </div>
                    
                    {formData.features.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                          {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700 font-medium">{feature}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Özelliği kaldır"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Properties Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Hizmet Özellikleri
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Input
                          value={newProperty.key}
                          onChange={(e) => setNewProperty(prev => ({ ...prev, key: e.target.value }))}
                          placeholder="Özellik adı (örn: Süre, Fiyat)"
                        />
                      </div>
                      <div>
                        <Input
                          value={newProperty.value}
                          onChange={(e) => setNewProperty(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Değer"
                        />
                      </div>
                      <div>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newProperty.type}
                          onChange={(e) => setNewProperty(prev => ({ ...prev, type: e.target.value as ServiceProperty['type'] }))}
                        >
                          <option value="text">Metin</option>
                          <option value="number">Sayı</option>
                          <option value="boolean">Evet/Hayır</option>
                          <option value="url">URL</option>
                          <option value="email">E-posta</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProperty.isRequired}
                          onChange={(e) => setNewProperty(prev => ({ ...prev, isRequired: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Zorunlu özellik</span>
                      </label>
                      <Button
                        type="button"
                        onClick={addProperty}
                        variant="secondary"
                        disabled={!newProperty.key.trim() || !newProperty.value.trim()}
                        leftIcon={<Plus className="w-4 h-4" />}
                        size="sm"
                      >
                        Özellik Ekle
                      </Button>
                    </div>

                    {formData.properties.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                          {formData.properties.map((property, index) => (
                            <div key={property.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                  value={property.key}
                                  onChange={(e) => updateProperty(index, 'key', e.target.value)}
                                  placeholder="Özellik adı"
                                  size="sm"
                                />
                                <Input
                                  value={property.value}
                                  onChange={(e) => updateProperty(index, 'value', e.target.value)}
                                  placeholder="Değer"
                                  size="sm"
                                />
                                <select
                                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={property.type}
                                  onChange={(e) => updateProperty(index, 'type', e.target.value)}
                                >
                                  <option value="text">Metin</option>
                                  <option value="number">Sayı</option>
                                  <option value="boolean">Evet/Hayır</option>
                                  <option value="url">URL</option>
                                  <option value="email">E-posta</option>
                                </select>
                              </div>
                              <div className="flex items-center ml-3 space-x-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={property.isRequired}
                                    onChange={(e) => updateProperty(index, 'isRequired', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 text-xs"
                                  />
                                  <span className="ml-1 text-xs text-gray-600">Zorunlu</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeProperty(index)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                  title="Özelliği kaldır"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 bg-gray-50 -mx-8 -mb-8 px-8 py-6 rounded-b-2xl">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-6 py-2.5"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isLoading ? 'Kaydediliyor...' : (service ? 'Güncelle' : 'Hizmet Ekle')}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;