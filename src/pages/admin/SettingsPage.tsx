import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Settings, Mail, Globe, Phone, MapPin, Image, Upload } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { SiteSettings } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const settingsSchema = z.object({
  title: z.string().min(1, 'Site başlığı gereklidir'),
  description: z.string().min(1, 'Site açıklaması gereklidir'),
  phone: z.string().min(1, 'Telefon numarası gereklidir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  address: z.string().min(1, 'Adres gereklidir'),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpFromEmail: z.string().optional()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  const { settings, updateSettings } = useApp();

  // Initialize previews with existing logo/favicon
  React.useEffect(() => {
    if (settings.logo) setLogoPreview(settings.logo);
    if (settings.favicon) setFaviconPreview(settings.favicon);
  }, [settings.logo, settings.favicon]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: settings.title,
      description: settings.description,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      smtpHost: settings.smtp.host,
      smtpPort: settings.smtp.port,
      smtpUsername: settings.smtp.username,
      smtpPassword: settings.smtp.password,
      smtpFromEmail: settings.smtp.fromEmail
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSettings: Partial<SiteSettings> = {
        title: data.title,
        description: data.description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        smtp: {
          host: data.smtpHost || '',
          port: data.smtpPort || 587,
          username: data.smtpUsername || '',
          password: data.smtpPassword || '',
          fromEmail: data.smtpFromEmail || data.email
        }
      };

      updateSettings(updatedSettings);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Settings update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      
      // Update settings immediately with the preview URL
      updateSettings({ logo: result });
    };
    reader.readAsDataURL(file);

    // In a real app, you would upload to a server here
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      // Simulate server upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Logo upload failed:', error);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setFaviconPreview(result);
      
      // Update settings immediately with the preview URL
      updateSettings({ favicon: result });
      
      // Update favicon in DOM immediately
      updateFaviconInDOM(result);
    };
    reader.readAsDataURL(file);

    // In a real app, you would upload to a server here
    try {
      const formData = new FormData();
      formData.append('favicon', file);
      
      // Simulate server upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Favicon upload failed:', error);
    }
  };

  const updateFaviconInDOM = (faviconUrl: string) => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;
  };

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Settings },
    { id: 'branding', name: 'Logo ve Favicon', icon: Image },
    { id: 'contact', name: 'İletişim', icon: Phone },
    { id: 'email', name: 'E-posta Ayarları', icon: Mail }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Site Ayarları
        </h1>
        <p className="text-gray-600">
          Web sitenizin genel ayarlarını ve yapılandırmalarını yönetin
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
                  Ayarlar başarıyla kaydedildi!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-6 h-6 mr-2" />
                      Genel Ayarlar
                    </h2>
                  </div>

                  <Input
                    label="Site Başlığı"
                    {...register('title')}
                    error={errors.title?.message}
                  />

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Açıklaması
                    </label>
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'branding' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Image className="w-6 h-6 mr-2" />
                      Logo ve Favicon
                    </h2>
                    <p className="text-sm text-gray-600">
                      Sitenizin görsel kimliğini oluşturan logo ve favicon dosyalarını yükleyin
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Site Logosu</h3>
                      
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {logoPreview ? (
                          <div className="space-y-4">
                            <img 
                              src={logoPreview} 
                              alt="Logo Preview" 
                              className="max-h-20 mx-auto object-contain"
                            />
                            <p className="text-sm text-gray-500">Mevcut Logo</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-10 h-10 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500">Logo yüklemek için tıklayın</p>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Önerilen boyut: 200x60px | Desteklenen formatlar: JPG, PNG, SVG
                      </p>
                    </div>

                    {/* Favicon Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Favicon</h3>
                      
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {faviconPreview ? (
                          <div className="space-y-4">
                            <img 
                              src={faviconPreview} 
                              alt="Favicon Preview" 
                              className="w-8 h-8 mx-auto object-contain"
                            />
                            <p className="text-sm text-gray-500">Mevcut Favicon</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-10 h-10 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500">Favicon yüklemek için tıklayın</p>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Önerilen boyut: 32x32px veya 16x16px | Desteklenen formatlar: ICO, PNG
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900">
                          Logo ve Favicon Kullanımı
                        </h4>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Logo: Header'da ve tüm sayfalarda görüntülenir</li>
                            <li>Favicon: Browser sekmesinde ve bookmark'larda görüntülenir</li>
                            <li>Değişiklikler anında tüm sitede etkili olur</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-6 h-6 mr-2" />
                      İletişim Bilgileri
                    </h2>
                  </div>

                  <Input
                    label="Telefon"
                    {...register('phone')}
                    error={errors.phone?.message}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />

                  <Input
                    label="E-posta"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />

                  <Input
                    label="Adres"
                    {...register('address')}
                    error={errors.address?.message}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </motion.div>
              )}

              {activeTab === 'email' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-6 h-6 mr-2" />
                      SMTP E-posta Ayarları
                    </h2>
                    <p className="text-sm text-gray-600">
                      E-posta gönderim işlemleri için SMTP ayarlarını yapılandırın
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="SMTP Host"
                      {...register('smtpHost')}
                      error={errors.smtpHost?.message}
                      placeholder="smtp.gmail.com"
                    />

                    <Input
                      label="SMTP Port"
                      type="number"
                      {...register('smtpPort')}
                      error={errors.smtpPort?.message}
                      placeholder="587"
                    />
                  </div>

                  <Input
                    label="Kullanıcı Adı"
                    {...register('smtpUsername')}
                    error={errors.smtpUsername?.message}
                  />

                  <Input
                    label="Şifre"
                    type="password"
                    {...register('smtpPassword')}
                    error={errors.smtpPassword?.message}
                  />

                  <Input
                    label="Gönderen E-posta"
                    type="email"
                    {...register('smtpFromEmail')}
                    error={errors.smtpFromEmail?.message}
                    placeholder="noreply@letsshine.com"
                  />
                </motion.div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  disabled={!isDirty}
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;