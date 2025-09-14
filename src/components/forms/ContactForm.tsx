import React from 'react';
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
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
  subject: z.string().min(5, 'Konu en az 5 karakter olmalıdır'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır')
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

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
        <Input
          label="Telefon Numarası *"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        
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