import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Users, TrendingUp, Award, BookOpen, Heart, Handshake, DollarSign } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  link: string
  external?: boolean
}

interface ServiceCardProps {
  service: Service
}

const getIcon = (iconName: string) => {
  const iconMap = {
    'fas fa-user-tie': Users,
    'fas fa-search-dollar': TrendingUp,
    'fas fa-chart-line': TrendingUp,
    'fas fa-graduation-cap': BookOpen,
    'fas fa-user-clock': Heart,
    'fas fa-handshake': Handshake,
    'fas fa-dollar-sign': DollarSign,
  }
  
  return iconMap[iconName as keyof typeof iconMap] || Users
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = getIcon(service.icon)

  const cardContent = (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 h-full flex flex-col group">
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
          Detayları Görün
        </span>
        {service.external ? (
          <ExternalLink className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
        ) : (
          <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </div>
  )

  if (service.external) {
    return (
      <a
        href={service.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {cardContent}
      </a>
    )
  }

  return (
    <Link to={service.link} className="block h-full">
      {cardContent}
    </Link>
  )
}