import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Settings, Mail, Globe, Phone, MapPin, Image, Upload, Server, Users, Plus, Edit3, Trash2, Key, X, RefreshCw, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { SiteSettings } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const settingsSchema = z.object({
  title: z.string().min(1, 'Site başlığı gereklidir'),
  subtitle: z.string().min(1, 'Site alt başlığı gereklidir'),
  description: z.string().min(1, 'Site açıklaması gereklidir'),
  phone: z.string().min(1, 'Telefon numarası gereklidir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  address: z.string().min(1, 'Adres gereklidir'),
  linkedin: z.string().url('Geçerli bir LinkedIn URL\'si giriniz').optional().or(z.literal('')),
  twitter: z.string().url('Geçerli bir Twitter URL\'si giriniz').optional().or(z.literal('')),
  instagram: z.string().url('Geçerli bir Instagram URL\'si giriniz').optional().or(z.literal('')),
  facebook: z.string().url('Geçerli bir Facebook URL\'si giriniz').optional().or(z.literal('')),
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
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState<any[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingEmail, setEditingEmail] = useState<any>(null);
  const [emailFormData, setEmailFormData] = useState({
    username: '',
    password: '',
    quota: 1000,
    usedMb: 0,
    isActive: true
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{success: boolean, message: string} | null>(null);

  const { settings, updateSettings } = useApp();
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: settings.title || '',
      subtitle: settings.subtitle || '',
      description: settings.description || '',
      phone: settings.phone || '',
      email: settings.email || '',
      address: settings.address || '',
      linkedin: settings.socialMedia?.linkedin || '',
      twitter: settings.socialMedia?.twitter || '',
      instagram: settings.socialMedia?.instagram || '',
      facebook: settings.socialMedia?.facebook || '',
      smtpHost: settings.smtp?.host || '',
      smtpPort: settings.smtp?.port || 587,
      smtpUsername: settings.smtp?.username || '',
      smtpPassword: settings.smtp?.password || '',
      smtpFromEmail: settings.smtp?.fromEmail || ''
    }
  });

  // Initialize previews with existing logo/favicon
  React.useEffect(() => {
    if (settings.logo) setLogoPreview(settings.logo);
    if (settings.favicon) setFaviconPreview(settings.favicon);
  }, [settings.logo, settings.favicon]);

  // Settings değiştiğinde form default values'ları güncelle
  React.useEffect(() => {
    setValue('title', settings.title || '');
    setValue('subtitle', settings.subtitle || '');
    setValue('description', settings.description || '');
    setValue('phone', settings.phone || '');
    setValue('email', settings.email || '');
    setValue('address', settings.address || '');
    setValue('linkedin', settings.socialMedia?.linkedin || '');
    setValue('twitter', settings.socialMedia?.twitter || '');
    setValue('instagram', settings.socialMedia?.instagram || '');
    setValue('facebook', settings.socialMedia?.facebook || '');
    setValue('smtpHost', settings.smtp?.host || '');
    setValue('smtpPort', settings.smtp?.port || 587);
    setValue('smtpUsername', settings.smtp?.username || '');
    setValue('smtpPassword', settings.smtp?.password || '');
    setValue('smtpFromEmail', settings.smtp?.fromEmail || '');
  }, [settings, setValue]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    
    try {
      // Mevcut settings'i koruyarak sadece değişen alanları güncelle
      const updatedSettings: Partial<SiteSettings> = {
        ...settings, // Mevcut settings'i koru
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        socialMedia: {
          ...settings.socialMedia, // Mevcut sosyal medya ayarlarını koru
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          facebook: data.facebook || ''
        },
        smtp: {
          ...settings.smtp, // Mevcut SMTP ayarlarını koru
          host: data.smtpHost || '',
          port: data.smtpPort || 587,
          username: data.smtpUsername || '',
          password: data.smtpPassword || '',
          fromEmail: data.smtpFromEmail || data.email
        }
      };

      // API çağrısı yap
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Settings güncellenirken hata oluştu');
      }

      await response.json();
      
      // Context'i güncelle
      updateSettings(updatedSettings);
      
      // Form'u reset et ki dirty state temizlensin
      reset(data);
      
      setSuccessMessage('Ayarlar başarıyla güncellendi!');
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Settings update error:', error);
      setSuccessMessage('Ayarlar güncellenirken hata oluştu!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const logoUrl = result.url;
      
      // Update settings with the uploaded file URL
      await updateSettings({ logo: logoUrl });
      
      // Show success message
      setSuccessMessage('Logo başarıyla yüklendi ve veritabanına kaydedildi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Logo upload failed:', error);
      alert('Logo yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    // Validate file size (max 1MB for favicon)
    if (file.size > 1 * 1024 * 1024) {
      alert('Favicon dosya boyutu 1MB\'dan küçük olmalıdır.');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFaviconPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const faviconUrl = result.url;
      
      // Update settings with the uploaded file URL
      await updateSettings({ favicon: faviconUrl });
      
      // Update favicon in DOM immediately
      updateFaviconInDOM(faviconUrl);
      
      // Show success message
      setSuccessMessage('Favicon başarıyla yüklendi ve veritabanına kaydedildi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Favicon upload failed:', error);
      alert('Favicon yüklenirken hata oluştu. Lütfen tekrar deneyin.');
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

  // E-posta hesapları yönetimi fonksiyonları
  const fetchEmailAccounts = async () => {
    try {
      const response = await fetch('/api/admin/email-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmailAccounts(data);
      }
    } catch (error) {
      console.error('E-posta hesapları yüklenirken hata:', error);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      setTestEmailResult({ success: false, message: 'Test e-posta adresi gereklidir!' });
      return;
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmailAddress)) {
      setTestEmailResult({ success: false, message: 'Geçerli bir e-posta adresi giriniz!' });
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailResult(null);

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: testEmailAddress,
          smtpSettings: {
            host: watch('smtpHost'),
            port: watch('smtpPort'),
            username: watch('smtpUsername'),
            password: watch('smtpPassword'),
            fromEmail: watch('smtpFromEmail')
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestEmailResult({ 
          success: true, 
          message: `Test e-postası başarıyla gönderildi! ${testEmailAddress} adresine kontrol edin.` 
        });
      } else {
        setTestEmailResult({ 
          success: false, 
          message: result.error || 'Test e-postası gönderilirken hata oluştu!' 
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      setTestEmailResult({ 
        success: false, 
        message: 'Bağlantı hatası! SMTP ayarlarını kontrol edin.' 
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleEmailSave = async () => {
    // Frontend validasyonu
    if (!emailFormData.username.trim()) {
      setSuccessMessage('Kullanıcı adı gereklidir!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Kullanıcı adı format kontrolü
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(emailFormData.username)) {
      setSuccessMessage('Kullanıcı adı sadece harf, rakam, nokta, tire ve alt çizgi içerebilir!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Kullanıcı adı uzunluk kontrolü
    if (emailFormData.username.length < 2) {
      setSuccessMessage('Kullanıcı adı en az 2 karakter olmalıdır!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Tam e-posta adresini oluştur
    const fullEmail = `${emailFormData.username}@letsshine.com.tr`;

    // Yeni hesap için şifre kontrolü
    if (!editingEmail && !emailFormData.password.trim()) {
      setSuccessMessage('Şifre gereklidir!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Şifre uzunluk kontrolü
    if (emailFormData.password && emailFormData.password.length < 6) {
      setSuccessMessage('Şifre en az 6 karakter olmalıdır!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    // Kota kontrolü
    if (emailFormData.quota < 100 || emailFormData.quota > 10000) {
      setSuccessMessage('Kota 100 MB ile 10000 MB arasında olmalıdır!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    try {
      const url = editingEmail
        ? `/api/admin/email-accounts/${editingEmail.id}`
        : '/api/admin/email-accounts';

      const method = editingEmail ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: fullEmail,
          password: emailFormData.password,
          quota: emailFormData.quota,
          usedMb: emailFormData.usedMb,
          isActive: emailFormData.isActive
        }),
      });

      if (response.ok) {
        setSuccessMessage(editingEmail ? 'E-posta hesabı güncellendi!' : 'E-posta hesabı oluşturuldu!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowEmailModal(false);
        setEditingEmail(null);
        setEmailFormData({ username: '', password: '', quota: 1000, usedMb: 0, isActive: true });
        fetchEmailAccounts();
      } else {
        const errorData = await response.json();
        setSuccessMessage(errorData.error || 'E-posta hesabı kaydedilemedi!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('E-posta hesabı kaydetme hatası:', error);
      setSuccessMessage('E-posta hesabı kaydedilirken hata oluştu!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleEmailDelete = async (emailId: string) => {
    if (!confirm('E-posta hesabını silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/email-accounts/${emailId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('E-posta hesabı silindi!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchEmailAccounts();
      }
    } catch (error) {
      console.error('E-posta hesabı silme hatası:', error);
    }
  };

  const openEmailModal = (email = null) => {
    if (email) {
      setEditingEmail(email);
      // E-posta adresinden kullanıcı adını çıkar
      const username = email.email.split('@')[0];
      setEmailFormData({
        username: username,
        password: '',
        quota: email.quota,
        usedMb: email.usedMb || 0,
        isActive: email.isActive
      });
    } else {
      setEditingEmail(null);
      setEmailFormData({ username: '', password: '', quota: 1000, usedMb: 0, isActive: true });
    }
    setShowEmailModal(true);
  };

  // Kullanım verilerini senkronize et
  const handleSyncUsage = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/admin/email-accounts/sync-usage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Kullanım verileri güncellendi! (${data.duration})`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchEmailAccounts();
      } else {
        throw new Error('Senkronizasyon başarısız');
      }
    } catch (error) {
      console.error('Senkronizasyon hatası:', error);
      setSuccessMessage('Kullanım verileri güncellenirken hata oluştu!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // E-posta hesaplarını yükle
  React.useEffect(() => {
    if (activeTab === 'email-accounts' && token) {
      fetchEmailAccounts();
    }
  }, [activeTab, token]);

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Settings },
    { id: 'branding', name: 'Logo ve Favicon', icon: Image },
    { id: 'contact', name: 'İletişim', icon: Phone },
    { id: 'social', name: 'Sosyal Medya', icon: Users },
    { id: 'email', name: 'E-posta Ayarları', icon: Mail },
    { id: 'email-accounts', name: 'E-posta Hesapları', icon: Server }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
                  {successMessage || 'Ayarlar başarıyla kaydedildi!'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit(onSubmit as any)}>
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

                  <Input
                    label="Site Alt Başlığı"
                    {...register('subtitle')}
                    error={errors.subtitle?.message}
                    placeholder="Örn: İnsan Kaynakları Danışmanlığı"
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
                              } as unknown as React.ChangeEvent<HTMLInputElement>;
                              handleLogoUpload(event);
                            }
                          }
                        }}
                      >
                        {logoPreview ? (
                          <div className="space-y-4">
                            <img 
                              src={logoPreview} 
                              alt="Logo Preview" 
                              className="max-h-20 mx-auto object-contain"
                            />
                            <p className="text-sm text-gray-500">Mevcut Logo</p>
                            <p className="text-xs text-blue-600">Yeni logo yüklemek için tıklayın veya sürükleyin</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-10 h-10 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500">Logo yüklemek için tıklayın veya sürükleyin</p>
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

              {activeTab === 'social' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Sosyal Medya Hesapları
                    </h2>
                    <p className="text-sm text-gray-600">
                      Sosyal medya hesaplarınızın URL'lerini girin. Bu bilgiler footer'da görüntülenecektir.
                    </p>
                  </div>

                  <Input
                    label="LinkedIn URL"
                    type="url"
                    placeholder="https://linkedin.com/company/letsshine"
                    {...register('linkedin')}
                    error={errors.linkedin?.message}
                    leftIcon={<Linkedin className="w-4 h-4" />}
                  />

                  <Input
                    label="Twitter URL"
                    type="url"
                    placeholder="https://twitter.com/letsshine"
                    {...register('twitter')}
                    error={errors.twitter?.message}
                    leftIcon={<Twitter className="w-4 h-4" />}
                  />

                  <Input
                    label="Instagram URL"
                    type="url"
                    placeholder="https://instagram.com/letsshine"
                    {...register('instagram')}
                    error={errors.instagram?.message}
                    leftIcon={<Instagram className="w-4 h-4" />}
                  />

                  <Input
                    label="Facebook URL"
                    type="url"
                    placeholder="https://facebook.com/letsshine"
                    {...register('facebook')}
                    error={errors.facebook?.message}
                    leftIcon={<Facebook className="w-4 h-4" />}
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

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTestEmailModal(true)}
                      leftIcon={<Mail className="w-4 h-4" />}
                    >
                      Test E-postası Gönder
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'email-accounts' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                        <Server className="w-6 h-6 mr-2" />
                        E-posta Hesapları Yönetimi
                      </h2>
                      <p className="text-sm text-gray-600">
                        E-posta sunucunuzdaki hesapları oluşturun, düzenleyin ve yönetin
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSyncUsage}
                        isLoading={isSyncing}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSyncing ? 'Senkronize Ediliyor...' : 'Kullanım Verilerini Güncelle'}
                      </Button>
                      <Button
                        onClick={() => openEmailModal()}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Yeni Hesap
                      </Button>
                    </div>
                  </div>

                  {/* E-posta hesapları listesi */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-2">E-posta Adresi</div>
                        <div>Kota (MB)</div>
                        <div>Kullanım</div>
                        <div>Durum</div>
                        <div>Oluşturma Tarihi</div>
                        <div>İşlemler</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {emailAccounts.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Henüz e-posta hesabı bulunmuyor</p>
                          <p className="text-sm">Yeni hesap oluşturmak için yukarıdaki butonu kullanın</p>
                        </div>
                      ) : (
                        emailAccounts.map((account) => (
                          <div key={account.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="grid grid-cols-6 gap-4 items-center">
                              <div className="col-span-2 flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium text-sm">{account.email}</span>
                              </div>
                              <div className="text-sm">{account.quota} MB</div>
                              <div className="text-sm">
                                {(() => {
                                  const usedMB = account.usedMb || 0;
                                  const usagePercent = account.quota > 0 ? (usedMB / account.quota) * 100 : 0;
                                  const colorClass = usagePercent > 80 ? 'bg-red-600' : usagePercent > 60 ? 'bg-yellow-600' : 'bg-green-600';

                                  return (
                                    <>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full ${colorClass}`}
                                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500 mt-1 block">
                                        {usedMB} MB / {account.quota} MB kullanılan
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                              <div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  account.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {account.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(account.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEmailModal(account)}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded"
                                  title="Düzenle"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEmailDelete(account.id)}
                                  className="p-1 text-red-600 hover:text-red-800 rounded"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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

      {/* E-posta Hesabı Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEmail ? 'E-posta Hesabını Düzenle' : 'Yeni E-posta Hesabı'}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={emailFormData.username}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '');
                      setEmailFormData(prev => ({ ...prev, username: value }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="kullaniciadi"
                    disabled={!!editingEmail}
                    maxLength="20"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 text-sm">
                    @letsshine.com.tr
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  {emailFormData.username && (
                    <p className="text-xs text-gray-500">
                      Tam adres: <span className="font-mono">{emailFormData.username}@letsshine.com.tr</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {emailFormData.username.length}/20 karakter
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editingEmail && <span className="text-xs text-gray-500">(boş bırakılırsa değişmez)</span>}
                </label>
                <input
                  type="password"
                  value={emailFormData.password}
                  onChange={(e) => setEmailFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={editingEmail ? "Yeni şifre (opsiyonel)" : "Şifre"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota (MB)
                  </label>
                  <input
                    type="number"
                    value={emailFormData.quota}
                    onChange={(e) => setEmailFormData(prev => ({ ...prev, quota: parseInt(e.target.value) || 1000 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanılan (MB)
                  </label>
                  <input
                    type="number"
                    value={emailFormData.usedMb}
                    onChange={(e) => setEmailFormData(prev => ({ ...prev, usedMb: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max={emailFormData.quota}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={emailFormData.isActive}
                  onChange={(e) => setEmailFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Aktif
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                İptal
              </Button>
              <Button
                onClick={handleEmailSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {editingEmail ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Test E-postası Gönder
              </h3>
              <button
                onClick={() => {
                  setShowTestEmailModal(false);
                  setTestEmailAddress('');
                  setTestEmailResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test E-posta Adresi
                </label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="test@example.com"
                />
              </div>

              {testEmailResult && (
                <div className={`p-3 rounded-lg ${
                  testEmailResult.success 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="text-sm">{testEmailResult.message}</p>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={() => {
                    setShowTestEmailModal(false);
                    setTestEmailAddress('');
                    setTestEmailResult(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
                >
                  İptal
                </Button>
                <Button
                  onClick={handleTestEmail}
                  disabled={isSendingTestEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  leftIcon={<Mail className="w-4 h-4" />}
                >
                  {isSendingTestEmail ? 'Gönderiliyor...' : 'Test E-postası Gönder'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;