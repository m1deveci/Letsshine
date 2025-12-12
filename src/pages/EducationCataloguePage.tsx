import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, BookOpen, CheckCircle } from 'lucide-react';

const EducationCataloguePage: React.FC = () => {
  const pdfUrl = '/uploads/education_catalogue.pdf';
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const handleDownload = async () => {
    try {
      setDownloadProgress(0);

      const response = await fetch(pdfUrl);
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || 0);

      if (!reader) {
        throw new Error('Failed to get reader');
      }

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const progress = Math.round((receivedLength / contentLength) * 100);
        setDownloadProgress(progress);
      }

      const blob = new Blob(chunks, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Letsshine_Egitim_Katalogu.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setTimeout(() => setDownloadProgress(null), 2000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadProgress(null);
      // Fallback to simple download
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Eğitim Programlarımız
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
              Eğitim Kataloğu
            </h1>

            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-4">
              İşletmenizin ihtiyaçlarına özel hazırlanmış kapsamlı eğitim programlarımızı inceleyin.
            </p>

            <p className="text-sm text-slate-500 mb-8">
              PDF Boyutu: 80.5 MB • Tüm eğitim programlarımız detaylı olarak açıklanmıştır
            </p>

            {/* Download Button with Progress */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleDownload}
                disabled={downloadProgress !== null}
                className="relative inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {downloadProgress !== null ? (
                  <>
                    {downloadProgress === 100 ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <Download className="w-5 h-5 mr-2 animate-bounce" />
                    )}
                    {downloadProgress === 100 ? 'İndirme Tamamlandı!' : `İndiriliyor... %${downloadProgress}`}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Kataloğu İndir (80.5 MB)
                  </>
                )}

                {/* Progress Bar */}
                {downloadProgress !== null && downloadProgress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-800 rounded-b-lg overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
              </button>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Yeni Sekmede Aç
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PDF Preview Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Katalog Önizlemesi</h2>
            <p className="text-gray-600">
              Eğitim kataloğumuzu aşağıda önizleyebilir veya yukarıdaki butonlardan indirip detaylı inceleyebilirsiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="aspect-[8.5/11] w-full bg-gray-100 flex items-center justify-center">
              <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
                style={{ minHeight: '800px' }}
              >
                <div className="p-12 text-center">
                  <FileText className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    PDF Görüntüleyici Kullanılamıyor
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Tarayıcınız PDF önizlemeyi desteklemiyor. Lütfen yukarıdaki butonları kullanarak kataloğu indirin veya yeni sekmede açın.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Kataloğu İndir (80.5 MB)
                    </button>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Yeni Sekmede Aç
                    </a>
                  </div>
                </div>
              </object>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kapsamlı İçerik</h3>
              <p className="text-sm text-gray-600">
                Tüm eğitim programlarımız detaylı olarak açıklanmıştır
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Güncel Bilgiler</h3>
              <p className="text-sm text-gray-600">
                En son eğitim programlarımız ve içerikleri
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kolay Erişim</h3>
              <p className="text-sm text-gray-600">
                İndirin ve istediğiniz zaman inceleyin
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EducationCataloguePage;
