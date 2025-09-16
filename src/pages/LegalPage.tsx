import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalPage as LegalPageType } from '../types';

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LegalPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/legal-pages/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Sayfa bulunamadı');
          } else {
            setError('Sayfa yüklenirken bir hata oluştu');
          }
          return;
        }
        
        const data = await response.json();
        setPage(data);
      } catch (err) {
        console.error('Error fetching legal page:', err);
        setError('Sayfa yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız sayfa mevcut değil.'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Ana Sayfa
              </Link>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Son güncelleme: {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border p-8"
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
                <p className="text-gray-600 mt-1">Yasal bilgilendirme sayfası</p>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: page.content }}
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Let's Shine İnsan Kaynakları Danışmanlığı</span>
              </div>
              <div>
                Oluşturulma: {new Date(page.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;
