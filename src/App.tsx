import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { ContactPage } from './pages/ContactPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/egitim" element={<ServiceDetailPage serviceId="egitim" />} />
        <Route path="/motivasyon" element={<ServiceDetailPage serviceId="calisan-deneyimi" />} />
        <Route path="/organizasyon" element={<ServiceDetailPage serviceId="ik-danismanligi" />} />
        <Route path="/performans" element={<ServiceDetailPage serviceId="performans" />} />
        <Route path="/kocluk" element={<ServiceDetailPage serviceId="kocluk" />} />
        <Route path="/psikolojik-danismanlik" element={<ServiceDetailPage serviceId="psikolojik-danismanlik" />} />
        <Route path="/ucretlendirme" element={<ServiceDetailPage serviceId="ucretlendirme" />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  )
}

export default App