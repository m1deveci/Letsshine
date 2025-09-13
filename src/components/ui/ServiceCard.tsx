import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Users, TrendingUp, BookOpen, Heart, HeartHandshake as Handshake, DollarSign } from 'lucide-react'

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
    <div className="modern-card p-8 h-full flex flex-col group hover:-translate-y-3 hover:shadow-colored">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-colored">
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100/80">
        <span className="text-primary-600 font-bold text-lg group-hover:text-primary-700 transition-colors duration-300">
          Detayları Görün
        </span>
        {service.external ? (
          <ExternalLink className="w-6 h-6 text-primary-600 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
        ) : (
          <ArrowRight className="w-6 h-6 text-primary-600 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
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