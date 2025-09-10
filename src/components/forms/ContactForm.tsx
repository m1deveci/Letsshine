import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  company: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
})

type ContactFormData = z.infer<typeof contactSchema>

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Form data:', data)
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modern-card p-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
          <Send className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900">
        Bize Ulaşın
        </h3>
      </div>
      
      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
        Formu doldurarak bizimle iletişime geçin. 24 saat içinde size dönüş yapacağız.
      </p>

      {submitStatus === 'success' && (
        <div className="mb-8 p-6 bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-2xl">
          <p className="text-success-800 font-semibold">
            Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
          <p className="text-red-800 font-semibold">
            Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-3">
              Ad Soyad *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="form-input"
              placeholder="Adınızı giriniz"
            />
            {errors.name && (
              <p className="form-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
              E-posta *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="form-input"
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3">
              Telefon *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="form-input"
              placeholder="+90 (XXX) XXX XX XX"
            />
            {errors.phone && (
              <p className="form-error">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-bold text-gray-800 mb-3">
              Şirket *
            </label>
            <input
              {...register('company')}
              type="text"
              id="company"
              className="form-input"
              placeholder="Şirket adınız"
            />
            {errors.company && (
              <p className="form-error">{errors.company.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-800 mb-3">
            Mesaj *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="form-textarea"
            placeholder="İhtiyaçlarınızı detaylı olarak açıklayınız..."
          />
          {errors.message && (
            <p className="form-error">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 hover:shadow-colored hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Gönderiliyor...</span>
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              <span>Mesaj Gönder</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}