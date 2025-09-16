import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, FileText, Save, X } from 'lucide-react';
import { LegalPage } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Swal from 'sweetalert2';

const LegalPagesManagement: React.FC = () => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/legal-pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching legal pages:', error);
      Swal.fire('Hata', 'Yasal sayfalar yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      order: pages.length,
      isActive: true
    });
  };

  const handleEdit = (page: LegalPage) => {
    setEditingPage(page);
    setIsCreating(false);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      order: page.order,
      isActive: page.isActive
    });
  };

  const handleCancel = () => {
    setEditingPage(null);
    setIsCreating(false);
    setFormData({
      title: '',
      slug: '',
      content: '',
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isCreating ? '/api/legal-pages' : `/api/legal-pages/${editingPage?.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await Swal.fire('Başarılı', 
          isCreating ? 'Yasal sayfa başarıyla oluşturuldu' : 'Yasal sayfa başarıyla güncellendi', 
          'success'
        );
        fetchPages();
        handleCancel();
      } else {
        const error = await response.json();
        Swal.fire('Hata', error.error || 'Bir hata oluştu', 'error');
      }
    } catch (error) {
      console.error('Error saving legal page:', error);
      Swal.fire('Hata', 'Yasal sayfa kaydedilirken bir hata oluştu', 'error');
    }
  };

  const handleDelete = async (page: LegalPage) => {
    const result = await Swal.fire({
      title: 'Sayfayı Sil',
      text: `"${page.title}" sayfasını silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/legal-pages/${page.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await Swal.fire('Başarılı', 'Yasal sayfa başarıyla silindi', 'success');
          fetchPages();
        } else {
          Swal.fire('Hata', 'Sayfa silinirken bir hata oluştu', 'error');
        }
      } catch (error) {
        console.error('Error deleting legal page:', error);
        Swal.fire('Hata', 'Sayfa silinirken bir hata oluştu', 'error');
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yasal Sayfalar Yönetimi</h1>
            <p className="text-gray-600">Footer'da görünecek yasal sayfaları yönetin</p>
          </div>
          <Button
            onClick={handleCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Yeni Sayfa
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingPage) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isCreating ? 'Yeni Yasal Sayfa' : 'Yasal Sayfa Düzenle'}
                </h2>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  İptal
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa Başlığı *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Örn: Gizlilik Politikası"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="gizlilik-politikasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Aktif
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="HTML formatında içerik girin..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  HTML etiketleri kullanabilirsiniz (h2, h3, p, ul, li, strong, br vb.)
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSave}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCreating ? 'Oluştur' : 'Güncelle'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Pages List */}
      <div className="grid grid-cols-1 gap-6">
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-600">/{page.slug}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {page.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Sıra: {page.order}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/yasal/${page.slug}`, '_blank')}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      Görüntüle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                      leftIcon={<Edit className="w-4 h-4" />}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      Sil
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div 
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: page.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz yasal sayfa yok</h3>
          <p className="text-gray-600 mb-6">İlk yasal sayfanızı oluşturmak için yukarıdaki butona tıklayın.</p>
          <Button
            onClick={handleCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Yeni Sayfa Oluştur
          </Button>
        </div>
      )}
    </div>
  );
};

export default LegalPagesManagement;
