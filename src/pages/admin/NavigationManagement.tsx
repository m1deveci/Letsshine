import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Navigation, Plus, Trash2, Edit, GripVertical } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NavigationItem } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const navigationSchema = z.object({
  name: z.string().min(1, 'Menü adı gereklidir'),
  href: z.string().min(1, 'URL gereklidir'),
  order: z.coerce.number().min(1, 'Sıra numarası gereklidir'),
  isActive: z.boolean(),
  isExternal: z.boolean().optional()
});

type NavigationFormData = z.infer<typeof navigationSchema>;

const NavigationManagement: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { navigationItems, addNavigationItem, updateNavigationItem, deleteNavigationItem } = useApp();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<NavigationFormData>({
    resolver: zodResolver(navigationSchema),
    defaultValues: {
      name: '',
      href: '',
      order: navigationItems.length + 1,
      isActive: true,
      isExternal: false
    }
  });

  const onSubmit = async (data: NavigationFormData) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        // Update existing item
        updateNavigationItem(editingItem.id, data);
        setSuccessMessage('Menü öğesi başarıyla güncellendi!');
      } else {
        // Add new item
        addNavigationItem(data);
        setSuccessMessage('Yeni menü öğesi başarıyla eklendi!');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
      
      reset();
      setEditingItem(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving navigation item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setValue('name', item.name);
    setValue('href', item.href);
    setValue('order', item.order);
    setValue('isActive', item.isActive);
    setValue('isExternal', item.isExternal || false);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      deleteNavigationItem(id);
      setSuccessMessage('Menü öğesi başarıyla silindi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    reset();
    setEditingItem(null);
    setShowAddForm(true);
    setValue('order', navigationItems.length + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Navigation className="w-8 h-8 mr-3 text-blue-600" />
          Menü Yönetimi
        </h1>
        <p className="text-gray-600">
          Header menü öğelerini düzenleyin ve yönetin
        </p>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Save className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingItem ? 'Menü Öğesini Düzenle' : 'Yeni Menü Öğesi Ekle'}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Menü Adı"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Ana Sayfa"
                  />
                  
                  <Input
                    label="URL"
                    {...register('href')}
                    error={errors.href?.message}
                    placeholder="/"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                      Sıra Numarası
                    </label>
                    <input
                      {...register('order')}
                      type="number"
                      min="1"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.order && (
                      <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        {...register('isActive')}
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Aktif</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        {...register('isExternal')}
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Dış Link</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty || isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    {isSaving ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Ekle')}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Navigation Items List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mevcut Menü Öğeleri</h2>
            <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
              Yeni Menü Ekle
            </Button>
          </div>

          <div className="space-y-3">
            {navigationItems
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {!item.isActive && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Pasif
                          </span>
                        )}
                        {item.isExternal && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Dış Link
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{item.href}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sıra: {item.order}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>

          {navigationItems.length === 0 && (
            <div className="text-center py-8">
              <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Henüz menü öğesi eklenmemiş.</p>
              <Button onClick={handleAddNew} className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
                İlk Menü Öğesini Ekle
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NavigationManagement;
