import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Home, Plus, Trash2, Upload, Image } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { HeroContent } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const heroSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  subtitle: z.string().min(1, 'Alt başlık gereklidir'),
  description: z.string().optional(),
  heroImage: z.string().optional()
});

type HeroFormData = z.infer<typeof heroSchema>;

const HeroManagement: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const { heroContent, updateHeroContent } = useApp();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: heroContent?.title || '',
      subtitle: heroContent?.subtitle || '',
      description: heroContent?.description || '',
      heroImage: heroContent?.heroImage || ''
    }
  });

  const watchedHeroImage = watch('heroImage');

  const onSubmit = async (data: HeroFormData) => {
    setIsSaving(true);
    try {
      const updatedHero: HeroContent = {
        ...heroContent!,
        ...data,
        updatedAt: new Date()
      };
      
      updateHeroContent(updatedHero);
      
      setSuccessMessage('Hero içeriği başarıyla güncellendi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating hero content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setValue('heroImage', result);
    };
    reader.readAsDataURL(file);
  };

  const addFeature = () => {
    const currentFeatures = heroContent?.features || [];
    const newFeature = prompt('Yeni özellik ekleyin:');
    if (newFeature && newFeature.trim()) {
      const updatedHero: HeroContent = {
        ...heroContent!,
        features: [...currentFeatures, newFeature.trim()],
        updatedAt: new Date()
      };
      updateHeroContent(updatedHero);
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = heroContent?.features || [];
    const updatedFeatures = currentFeatures.filter((_, i) => i !== index);
    const updatedHero: HeroContent = {
      ...heroContent!,
      features: updatedFeatures,
      updatedAt: new Date()
    };
    updateHeroContent(updatedHero);
  };

  const addStat = () => {
    const currentStats = heroContent?.stats || [];
    const number = prompt('İstatistik sayısı (örn: 30+):');
    const label = prompt('İstatistik etiketi (örn: Başarılı Proje):');
    if (number && label && number.trim() && label.trim()) {
      const updatedHero: HeroContent = {
        ...heroContent!,
        stats: [...currentStats, { number: number.trim(), label: label.trim() }],
        updatedAt: new Date()
      };
      updateHeroContent(updatedHero);
    }
  };

  const removeStat = (index: number) => {
    const currentStats = heroContent?.stats || [];
    const updatedStats = currentStats.filter((_, i) => i !== index);
    const updatedHero: HeroContent = {
      ...heroContent!,
      stats: updatedStats,
      updatedAt: new Date()
    };
    updateHeroContent(updatedHero);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Home className="w-8 h-8 mr-3 text-blue-600" />
          Ana Sayfa Yönetimi
        </h1>
        <p className="text-gray-600">
          Ana sayfa hero bölümünün içeriğini düzenleyin
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="w-6 h-6 mr-2" />
                Hero İçeriği
              </h2>
            </div>

            <Input
              label="Ana Başlık"
              {...register('title')}
              error={errors.title?.message}
              placeholder="İnsan Odaklı İK Çözümleri ile Geleceği Şekillendirin"
            />

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Başlık
              </label>
              <textarea
                {...register('subtitle')}
                id="subtitle"
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="25+ yıllık deneyimimiz ve uzman ekibimizle..."
              />
              {errors.subtitle && (
                <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={2}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Stratejik danışmanlık, koçluk ve psikolojik destek hizmetlerimizle..."
              />
            </div>

            {/* Hero Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Hero Görseli</h3>
              
              <div 
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    const file = files[0];
                    if (file.type.startsWith('image/')) {
                      const event = {
                        target: { files: [file] }
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleImageUpload(event);
                    }
                  }
                }}
              >
                {watchedHeroImage ? (
                  <div className="space-y-4">
                    <img 
                      src={watchedHeroImage} 
                      alt="Hero Preview" 
                      className="max-h-32 mx-auto object-contain"
                    />
                    <p className="text-sm text-gray-500">Mevcut Hero Görseli</p>
                    <p className="text-xs text-blue-600">Yeni görsel yüklemek için tıklayın veya sürükleyin</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Hero görseli yüklemek için tıklayın veya sürükleyin</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Önerilen boyut: 1200x600px | Desteklenen formatlar: JPG, PNG, SVG
              </p>
            </div>

            {/* Features Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Özellikler</h3>
                <Button type="button" variant="outline" size="sm" onClick={addFeature} leftIcon={<Plus className="w-4 h-4" />}>
                  Özellik Ekle
                </Button>
              </div>
              
              <div className="space-y-2">
                {heroContent?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">İstatistikler</h3>
                <Button type="button" variant="outline" size="sm" onClick={addStat} leftIcon={<Plus className="w-4 h-4" />}>
                  İstatistik Ekle
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heroContent?.stats?.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">{stat.number}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStat(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-gray-600">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                size="lg"
                disabled={!isDirty || isSaving}
                leftIcon={<Save className="w-5 h-5" />}
              >
                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default HeroManagement;
