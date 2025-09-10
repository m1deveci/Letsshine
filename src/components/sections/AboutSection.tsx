import React from 'react'
import { Users, Lightbulb, HeartHandshake as Handshake, Headphones } from 'lucide-react'
import { useContent } from '../../hooks/useContent'

const getIcon = (iconName: string) => {
  const iconMap = {
    'fas fa-user-tie': Users,
    'fas fa-lightbulb': Lightbulb,
    'fas fa-handshake': Handshake,
    'fas fa-headset': Headphones,
  }
  
  return iconMap[iconName as keyof typeof iconMap] || Users
}

const getColorClasses = (color: string) => {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  }
  
  return colorMap[color as keyof typeof colorMap] || 'bg-primary-100 text-primary-600'
}

export const AboutSection: React.FC = () => {
  const { content } = useContent()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.about.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {content.about.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.about.features.map((feature, index) => {
                const IconComponent = getIcon(feature.icon)
                const colorClasses = getColorClasses(feature.color)
                
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Takım Çalışması"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-100 rounded-full blur-xl"></div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-xl p-6 animate-slide-up">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">10+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
            </div>
            
            <div className="absolute -top-8 -right-8 bg-white rounded-xl shadow-xl p-6 animate-slide-up">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-1">100+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}