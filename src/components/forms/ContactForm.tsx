import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string()
    .min(1, 'Telefon numarası gereklidir')
    .refine((val) => {
      // Boşlukları ve özel karakterleri kaldır
      const cleanPhone = val.replace(/\D/g, '');
      // 10 veya 11 haneli olmalı
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }, 'Geçerli bir telefon numarası giriniz'),
  subject: z.string().min(5, 'Konu en az 5 karakter olmalıdır'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır')
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [phoneValue, setPhoneValue] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

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

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Form submission failed');
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Adınız Soyadınız *"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="E-posta Adresi *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon Numarası *
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
          label="Konu *"
          {...register('subject')}
          error={errors.subject?.message}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Mesajınız *
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={4}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Nasıl yardımcı olabiliriz?"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        leftIcon={<Send className="w-5 h-5" />}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
      </Button>
    </form>
  );
};

export default ContactForm;