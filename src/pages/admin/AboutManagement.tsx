import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, FileText, Heart, Target, Eye, Star, Lightbulb } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const aboutSchema = z.object({
  manifesto: z.string().min(1, 'Manifesto gereklidir'),
  mission: z.string().min(1, 'Misyon gereklidir'),
  vision: z.string().min(1, 'Vizyon gereklidir'),
  values: z.array(z.object({
    icon: z.string(),
    title: z.string().min(1, 'Değer başlığı gereklidir'),
    description: z.string().min(1, 'Değer açıklaması gereklidir')
  })).min(1, 'En az bir değer gereklidir'),
  slogans: z.array(z.object({
    category: z.string().min(1, 'Kategori gereklidir'),
    items: z.array(z.string().min(1, 'Slogan gereklidir'))
  })).min(1, 'En az bir slogan kategorisi gereklidir')
});

type AboutFormData = z.infer<typeof aboutSchema>;

const AboutManagement: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { aboutContent, updateAboutContent } = useApp();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      manifesto: '',
      mission: '',
      vision: '',
      values: [
        {
          icon: 'Heart',
          title: 'Samimiyet',
          description: 'İnsanlara kalpten yaklaşır, her ilişkimizi içtenlikle kurarız.'
        },
        {
          icon: 'Shield',
          title: 'Güven',
          description: 'Bize emanet edilen her yolculuğun sorumluluğunu taşıyarak güven inşa ederiz.'
        },
        {
          icon: 'Zap',
          title: 'Çeviklik',
          description: 'Hayatın hızlı değişimine uyum sağlarken, en uygun çözümleri vakit kaybetmeden üretiriz.'
        },
        {
          icon: 'Users',
          title: 'İnsana Değer',
          description: 'İnsanların gerçek ihtiyaçlarını duyar, onların potansiyellerine ışık tutarız.'
        },
        {
          icon: 'Lightbulb',
          title: 'İlham Verme',
          description: 'Her temasımızda gelişime, dönüşüme ve umuda vesile olmayı hedefleriz.'
        },
        {
          icon: 'Award',
          title: 'Sürdürülebilir Gelişim',
          description: 'Bugünü dönüştürürken, geleceğe kalıcı bir değer bırakırız.'
        }
      ],
      slogans: [
        {
          category: 'İlham Verici / Duygusal',
          items: [
            'İnsana dokun, geleceği dönüştür.',
            'Her yolculuk bir keşif, biz yanınızdayız.',
            'Güvenle, samimiyetle, birlikte büyüyoruz.'
          ]
        },
        {
          category: 'Dinamik / Çevik',
          items: [
            'Hızlı düşün, doğru çöz, birlikte kazan.',
            'Çevik adımlar, kalıcı sonuçlar.',
            'Her ihtiyaç için en doğru çözüm, en kısa yoldan.'
          ]
        },
        {
          category: 'Kurumsal & Anlamlı',
          items: [
            'İnsanı anlayarak, potansiyeli ortaya çıkarıyoruz.',
            'Kurumlara güç, bireylere ilham katıyoruz.',
            'Samimiyetle gelişim, güvenle dönüşüm.'
          ]
        }
      ]
    }
  });

  // aboutContent yüklendiğinde form değerlerini güncelle
  useEffect(() => {
    if (aboutContent) {
      reset({
        manifesto: aboutContent.manifesto || '',
        mission: aboutContent.mission || '',
        vision: aboutContent.vision || '',
        values: aboutContent.values || [
          {
            icon: 'Heart',
            title: 'Samimiyet',
            description: 'İnsanlara kalpten yaklaşır, her ilişkimizi içtenlikle kurarız.'
          },
          {
            icon: 'Shield',
            title: 'Güven',
            description: 'Bize emanet edilen her yolculuğun sorumluluğunu taşıyarak güven inşa ederiz.'
          },
          {
            icon: 'Zap',
            title: 'Çeviklik',
            description: 'Hayatın hızlı değişimine uyum sağlarken, en uygun çözümleri vakit kaybetmeden üretiriz.'
          },
          {
            icon: 'Users',
            title: 'İnsana Değer',
            description: 'İnsanların gerçek ihtiyaçlarını duyar, onların potansiyellerine ışık tutarız.'
          },
          {
            icon: 'Lightbulb',
            title: 'İlham Verme',
            description: 'Her temasımızda gelişime, dönüşüme ve umuda vesile olmayı hedefleriz.'
          },
          {
            icon: 'Award',
            title: 'Sürdürülebilir Gelişim',
            description: 'Bugünü dönüştürürken, geleceğe kalıcı bir değer bırakırız.'
          }
        ],
        slogans: aboutContent.slogans || [
          {
            category: 'İlham Verici / Duygusal',
            items: [
              'İnsana dokun, geleceği dönüştür.',
              'Her yolculuk bir keşif, biz yanınızdayız.',
              'Güvenle, samimiyetle, birlikte büyüyoruz.'
            ]
          },
          {
            category: 'Dinamik / Çevik',
            items: [
              'Hızlı düşün, doğru çöz, birlikte kazan.',
              'Çevik adımlar, kalıcı sonuçlar.',
              'Her ihtiyaç için en doğru çözüm, en kısa yoldan.'
            ]
          }
        ]
      });
    }
  }, [aboutContent, reset]);

  const watchedValues = watch('values');
  const watchedSlogans = watch('slogans');

  const onSubmit = async (data: AboutFormData) => {
    setIsSaving(true);
    try {
      // Check if user is authenticated
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      const updatedAbout = {
        ...aboutContent,
        ...data,
        isActive: aboutContent?.isActive ?? true,
        createdAt: aboutContent?.createdAt ?? new Date(),
        updatedAt: new Date()
      };

      await updateAboutContent(updatedAbout);

      setSuccessMessage('Hakkımızda içeriği başarıyla güncellendi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating about content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Hakkımızda içeriği güncellenirken hata oluştu!';
      setSuccessMessage(errorMessage);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const addValue = () => {
    const newValues = [...watchedValues, { icon: 'Heart', title: '', description: '' }];
    setValue('values', newValues, { shouldDirty: true });
  };

  const removeValue = (index: number) => {
    const newValues = watchedValues.filter((_, i) => i !== index);
    setValue('values', newValues, { shouldDirty: true });
  };

  const addSloganCategory = () => {
    const newSlogans = [...watchedSlogans, { category: '', items: [''] }];
    setValue('slogans', newSlogans, { shouldDirty: true });
  };

  const removeSloganCategory = (index: number) => {
    const newSlogans = watchedSlogans.filter((_, i) => i !== index);
    setValue('slogans', newSlogans, { shouldDirty: true });
  };

  const addSloganItem = (categoryIndex: number) => {
    const newSlogans = [...watchedSlogans];
    newSlogans[categoryIndex].items.push('');
    setValue('slogans', newSlogans, { shouldDirty: true });
  };

  const removeSloganItem = (categoryIndex: number, itemIndex: number) => {
    const newSlogans = [...watchedSlogans];
    newSlogans[categoryIndex].items = newSlogans[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setValue('slogans', newSlogans, { shouldDirty: true });
  };

  const iconOptions = [
    { value: 'Heart', label: 'Kalp' },
    { value: 'Shield', label: 'Kalkan' },
    { value: 'Zap', label: 'Şimşek' },
    { value: 'Users', label: 'Kullanıcılar' },
    { value: 'Lightbulb', label: 'Ampul' },
    { value: 'Award', label: 'Ödül' },
    { value: 'Target', label: 'Hedef' },
    { value: 'Eye', label: 'Göz' },
    { value: 'Star', label: 'Yıldız' },
    { value: 'Globe', label: 'Dünya' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-purple-600" />
          Hakkımızda Sayfası Yönetimi
        </h1>
        <p className="text-gray-600">
          Hakkımızda sayfasının içeriğini düzenleyin
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
        <div className="space-y-8">
          {/* Manifesto */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Manifesto
              </h2>
              <textarea
                {...register('manifesto')}
                rows={8}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Manifesto içeriğini buraya yazın..."
              />
              {errors.manifesto && (
                <p className="mt-1 text-sm text-red-600">{errors.manifesto.message}</p>
              )}
            </div>
          </Card>

          {/* Mission */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Misyon
              </h2>
              <textarea
                {...register('mission')}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Misyon açıklamasını buraya yazın..."
              />
              {errors.mission && (
                <p className="mt-1 text-sm text-red-600">{errors.mission.message}</p>
              )}
            </div>
          </Card>

          {/* Vision */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-500" />
                Vizyon
              </h2>
              <textarea
                {...register('vision')}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Vizyon açıklamasını buraya yazın..."
              />
              {errors.vision && (
                <p className="mt-1 text-sm text-red-600">{errors.vision.message}</p>
              )}
            </div>
          </Card>

          {/* Values */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Değerlerimiz
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addValue}
                >
                  Değer Ekle
                </Button>
              </div>
              
              <div className="space-y-4">
                {watchedValues.map((_, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İkon
                        </label>
                        <select
                          {...register(`values.${index}.icon`)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Başlık
                        </label>
                        <input
                          {...register(`values.${index}.title`)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Değer başlığı"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeValue(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Kaldır
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <textarea
                        {...register(`values.${index}.description`)}
                        rows={2}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Değer açıklaması"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errors.values && (
                <p className="mt-1 text-sm text-red-600">{errors.values.message}</p>
              )}
            </div>
          </Card>

          {/* Slogans */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
                  Sloganlar
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSloganCategory}
                >
                  Kategori Ekle
                </Button>
              </div>
              
              <div className="space-y-6">
                {watchedSlogans.map((slogan, categoryIndex) => (
                  <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        {...register(`slogans.${categoryIndex}.category`)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Kategori adı"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSloganCategory(categoryIndex)}
                        className="text-red-600 hover:text-red-700 ml-4"
                      >
                        Kategoriyi Kaldır
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {slogan.items.map((_, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                          <input
                            {...register(`slogans.${categoryIndex}.items.${itemIndex}`)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Slogan metni"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSloganItem(categoryIndex, itemIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Kaldır
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSloganItem(categoryIndex)}
                        className="mt-2"
                      >
                        Slogan Ekle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.slogans && (
                <p className="mt-1 text-sm text-red-600">{errors.slogans.message}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AboutManagement;
