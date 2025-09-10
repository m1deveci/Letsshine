import { useState, useEffect } from 'react'
import contentData from '../data/content.json'

export interface ContentData {
  site: {
    name: string
    title: string
    description: string
    keywords: string
    logo: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  navigation: {
    main: Array<{
      name: string
      path: string
      dropdown?: boolean
    }>
    services: Array<{
      name: string
      path: string
      external?: boolean
    }>
  }
  hero: {
    title: string
    subtitle: string
    image: string
    buttons: Array<{
      text: string
      link: string
      type: string
    }>
  }
  services: Array<{
    id: string
    title: string
    description: string
    icon: string
    features: string[]
    link: string
    external?: boolean
  }>
  about: {
    title: string
    description: string
    features: Array<{
      title: string
      description: string
      icon: string
      color: string
    }>
  }
  social: {
    facebook: string
    twitter: string
    linkedin: string
    instagram: string
  }
}

export const useContent = () => {
  const [content, setContent] = useState<ContentData>(contentData as ContentData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Content is already loaded from JSON file
    // This hook can be extended to fetch from API in the future
    setLoading(false)
    setError(null)
  }, [])

  return {
    content,
    loading,
    error,
    refetch: () => {
      // Placeholder for future API refetch functionality
      setContent(contentData as ContentData)
    }
  }
}