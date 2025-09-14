import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Service } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const applicationSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string()
    .min(1, 'Telefon numarası gereklidir')
    .refine((val) => {
      // Boşlukları ve özel karakterleri kaldır
      const cleanPhone = val.replace(/\D/g, '');
      // 11 haneli olmalı ve 0 ile başlamalı
      return cleanPhone.length === 11 && cleanPhone.startsWith('0');
    }, 'Geçerli bir Türkiye telefon numarası giriniz (05xxxxxxxxx)'),
  category: z.string().optional(),
  selectedFeatures: z.array(z.string()).optional(),
  message: z.string().optional()
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ServiceApplicationFormProps {
  service: Service;
  categories?: { value: string; label: string }[];
}

const ServiceApplicationForm: React.FC<ServiceApplicationFormProps> = ({ 
  service, 
  categories = [] 
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [phoneValue, setPhoneValue] = useState('');
  const { addApplication } = useApp();

  // Telefon numarası maskeleme fonksiyonu
  const formatPhoneNumber = (value: string) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, '');
    
    // Maksimum 11 haneli olsun
    const truncated = numbers.slice(0, 11);
    
    // Türk telefon formatına göre maskele: 0 (5xx) xxx xx xx
    if (truncated.length >= 4) {
      let formatted = truncated;
      if (truncated.length >= 7) {
        formatted = `${truncated.slice(0, 4)} ${truncated.slice(4, 7)} ${truncated.slice(7, 9)} ${truncated.slice(9, 11)}`;
      } else if (truncated.length >= 4) {
        formatted = `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
      }
      return formatted.trim();
    }
    
    return truncated;
  };

  // Telefon numarası değişiklik handler'ı
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
    
    // Sadece rakamları form'a gönder
    const numbersOnly = formatted.replace(/\D/g, '');
    setValue('phone', numbersOnly);
  };
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema)
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // API'ye gönder
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          serviceId: service.id,
          serviceName: service.title,
          category: data.category,
          selectedFeatures: selectedFeatures,
          message: data.message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      
      // Context'e de ekle (gerçek zamanlı güncelleme için)
      addApplication({
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceId: service.id,
        serviceName: service.title,
        category: data.category,
        selectedFeatures: selectedFeatures,
        message: data.message
      });

      reset();
      setSelectedFeatures([]);
      setPhoneValue('');
      setIsSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      // Hata durumunda kullanıcıya bilgi ver
      const errorMessage = error instanceof Error ? error.message : 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
      alert(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <Card className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Başvurunuz Alındı!
            </h3>
            <p className="text-gray-600">
              Talebiniz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Send className="w-5 h-5 mr-2 text-blue-600" />
          Hizmet Talebi
        </h3>
        <p className="text-gray-600">
          Hizmet başvuru formunu doldurun.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Adınız Soyadınız *"
          {...register('name')}
          error={errors.name?.message}
        />

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            GSM No *
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            value={phoneValue}
            onChange={handlePhoneChange}
            placeholder="05xx xxx xx xx"
            maxLength={14}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <Input
          label="E-posta Adresi *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        {categories.length > 0 && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Hizmet Kategorisi {categories.length > 0 && '*'}
            </label>
            <select
              {...register('category')}
              id="category"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seçiniz...</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        )}

        {/* Hizmet Özellikleri */}
        {service.features && service.features.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hizmet Özellikleri (İlgilendiğiniz alanları seçiniz)
            </label>
            <div className="space-y-2">
              {service.features.map((feature, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures(prev => [...prev, feature]);
                      } else {
                        setSelectedFeatures(prev => prev.filter(f => f !== feature));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Ek Bilgiler
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={3}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Hizmet detaylarınız hakkında bilgi verebilirsiniz..."
          />
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Send className="w-5 h-5" />}
          className="w-full"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Talep Gönder'}
        </Button>
      </form>
    </Card>
  );
};

export default ServiceApplicationForm;