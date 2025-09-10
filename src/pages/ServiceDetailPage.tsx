import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Phone, Mail } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { ContactForm } from '../components/forms/ContactForm'

interface ServiceDetailPageProps {
  serviceId?: string
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId: propServiceId }) => {
  const { serviceId: paramServiceId } = useParams<{ serviceId: string }>()
  const serviceId = propServiceId || paramServiceId
  const { content } = useContent()

  const service = content.services.find(s => s.id === serviceId)

  if (!service) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hizmet Bulunamadı
          </h1>
          <Link to="/services" className="btn-primary">
            Hizmetlere Dön
          </Link>
        </div>
      </div>
    )
  }

  // Extended service details based on service type
  const getServiceDetails = (serviceId: string) => {
    const details = {
      'ik-danismanligi': {
        longDescription: 'İş stratejinize uygun insan kaynakları politikaları ve süreç tasarımı ile organizasyonunuzu güçlendiriyoruz. Modern İK yaklaşımları ile çalışan memnuniyetini artırırken, operasyonel verimliliği de maksimize ediyoruz.',
        benefits: [
          'Stratejik İK planlaması ve roadmap oluşturma',
          'Organizasyonel yapı analizi ve optimizasyonu',
          'İK politikaları ve prosedürlerin geliştirilmesi',
          'Çalışan el kitabı hazırlanması',
          'İK süreçlerinin dijitalleştirilmesi',
          'Performans yönetim sistemlerinin kurulması'
        ],
        process: [
          'Mevcut durum analizi ve ihtiyaç tespiti',
          'İK stratejisi ve hedeflerin belirlenmesi',
          'Süreç tasarımı ve dokümantasyon',
          'Uygulama planının hazırlanması',
          'Pilot uygulama ve test süreçleri',
          'Tam implementasyon ve izleme'
        ]
      },
      'egitim': {
        longDescription: 'İş sonuçlarını doğrudan etkileyen ölçülebilir eğitim programları ile çalışanlarınızın potansiyelini ortaya çıkarıyoruz. Teorik bilgiyi pratiğe dönüştüren interaktif eğitim metodolojilerimizle kalıcı öğrenme sağlıyoruz.',
        benefits: [
          'Liderlik ve yönetim becerileri geliştirme',
          'Satış teknikleri ve müşteri ilişkileri',
          'İletişim ve sunum becerileri',
          'Takım çalışması ve motivasyon',
          'Stres yönetimi ve iş-yaşam dengesi',
          'Dijital dönüşüm ve teknoloji adaptasyonu'
        ],
        process: [
          'Eğitim ihtiyaç analizi (TNA)',
          'Özelleştirilmiş müfredat geliştirme',
          'Eğitim materyallerinin hazırlanması',
          'Pilot eğitim ve geri bildirim alma',
          'Ana eğitim programının uygulanması',
          'Etkinlik ölçümü ve raporlama'
        ]
      },
      'performans': {
        longDescription: 'Çalışan performansını artırmaya yönelik bütünsel sistemler kurarak, bireysel ve organizasyonel başarıyı destekliyoruz. Objektif değerlendirme kriterleri ve sürekli gelişim odaklı yaklaşımımızla performans kültürü oluşturuyoruz.',
        benefits: [
          'KPI ve OKR sistemlerinin tasarlanması',
          '360 derece performans değerlendirme',
          'Sürekli geri bildirim kültürünün oluşturulması',
          'Kariyer planlama ve gelişim yolları',
          'Yetenek yönetimi ve succession planning',
          'Performans bazlı ödüllendirme sistemleri'
        ],
        process: [
          'Mevcut performans sisteminin analizi',
          'Performans kriterlerinin belirlenmesi',
          'Değerlendirme araçlarının geliştirilmesi',
          'Yönetici ve çalışan eğitimleri',
          'Sistem implementasyonu',
          'Sürekli iyileştirme ve optimizasyon'
        ]
      },
      'calisan-deneyimi': {
        longDescription: 'Yeteneği elde tutmaya yönelik bütünsel çalışan deneyimi tasarımı ile organizasyonunuzu tercih edilen işveren haline getiriyoruz. İşe alımdan ayrılığa kadar tüm süreçlerde pozitif deneyim yaratıyoruz.',
        benefits: [
          'Employer branding stratejileri',
          'Çalışan bağlılığı programları',
          'İş-yaşam dengesi politikaları',
          'Çalışan deneyimi ölçümü ve analizi',
          'İç iletişim stratejileri',
          'Çalışan refahı ve wellness programları'
        ],
        process: [
          'Çalışan deneyimi journey mapping',
          'Mevcut durumun analizi ve gap tespiti',
          'Deneyim stratejisinin geliştirilmesi',
          'Touchpoint optimizasyonu',
          'Pilot uygulamalar',
          'Sürekli ölçüm ve iyileştirme'
        ]
      },
      'kocluk': {
        longDescription: 'Bireysel ve profesyonel gelişim için koçluk hizmetleri sunarak, kişilerin potansiyellerini keşfetmelerine ve hedeflerine ulaşmalarına destek oluyoruz. Farklı kariyer aşamalarında özelleştirilmiş koçluk programları geliştiriyoruz.',
        benefits: [
          'Yeni mezun koçluk programları',
          'Uzman seviye kariyer koçluğu',
          'Liderlik koçluğu',
          'Emeklilik sonrası kariyer danışmanlığı',
          'Kişisel gelişim koçluğu',
          'Executive coaching'
        ],
        process: [
          'Koçluk ihtiyacının belirlenmesi',
          'Hedef ve beklentilerin netleştirilmesi',
          'Koçluk planının oluşturulması',
          'Düzenli koçluk seansları',
          'İlerleme takibi ve değerlendirme',
          'Sürdürülebilir gelişim planı'
        ]
      },
      'ucretlendirme': {
        longDescription: 'Şirketlere özel adil ve sürdürülebilir ücret yönetimi sistemleri kurarak, çalışan memnuniyetini artırırken maliyetleri optimize ediyoruz. Pazar araştırmaları ve iş değerlendirme metodolojileri ile objektif ücret yapıları oluşturuyoruz.',
        benefits: [
          'Ücret skalası oluşturma ve yönetimi',
          'Pazar araştırması ve benchmarking',
          'İş değerlendirme ve grading',
          'Yan haklar sistemi tasarımı',
          'Performans bazlı ücretlendirme',
          'Ücret bütçe planlaması'
        ],
        process: [
          'Mevcut ücret yapısının analizi',
          'Pazar araştırması ve veri toplama',
          'İş değerlendirme çalışması',
          'Ücret skalasının tasarlanması',
          'Uygulama planının hazırlanması',
          'İzleme ve güncelleme süreçleri'
        ]
      }
    }

    return details[serviceId as keyof typeof details] || {
      longDescription: service.description,
      benefits: service.features,
      process: []
    }
  }

  const serviceDetails = getServiceDetails(serviceId)

  return (
    <div className="pt-20 animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/services"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Hizmetlere Dön</span>
            </Link>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            {serviceDetails.longDescription}
          </p>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Benefits */}
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Neler Sunuyoruz?
              </h2>
              <div className="space-y-4">
                {serviceDetails.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            {serviceDetails.process.length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Çalışma Sürecimiz
                </h2>
                <div className="space-y-6">
                  {serviceDetails.process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <ContactForm />
            </div>

            {/* Quick Contact */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Hemen Başlayalım
                </h3>
                <p className="text-gray-600 mb-8">
                  {service.title} hizmetimiz hakkında detaylı bilgi almak ve 
                  ücretsiz danışmanlık için bizimle iletişime geçin.
                </p>

                <div className="space-y-4">
                  <a
                    href={`tel:${content.contact.phone}`}
                    className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Phone className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Telefon</p>
                      <p className="text-primary-600">{content.contact.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${content.contact.email}`}
                    className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Mail className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">E-posta</p>
                      <p className="text-primary-600">{content.contact.email}</p>
                    </div>
                  </a>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white">
                  <p className="font-semibold mb-2">Ücretsiz Danışmanlık</p>
                  <p className="text-sm text-white/90">
                    İlk görüşme tamamen ücretsizdir. İhtiyaçlarınızı analiz ederek 
                    size özel çözüm önerilerimizi sunuyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}