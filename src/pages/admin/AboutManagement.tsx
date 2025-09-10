import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Edit, Trash2, Image, Type, Layout, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AboutManagement: React.FC = () => {
  const { aboutContent, updateAboutContent, addAboutSection, updateAboutSection, deleteAboutSection } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'image-text' | 'text-image' | 'full-image',
    order: 1,
    image: ''
  });

  const [aboutForm, setAboutForm] = useState({
    title: aboutContent?.title || '',
    subtitle: aboutContent?.subtitle || '',
    content: aboutContent?.content || '',
    heroImage: aboutContent?.heroImage || '',
    isActive: aboutContent?.isActive || true
  });

  const handleSaveAbout = () => {
    if (!aboutContent) return;

    updateAboutContent({
      ...aboutContent,
      ...aboutForm
    });
    setIsEditing(false);
  };

  const handleAddSection = () => {
    if (!newSection.title || !newSection.content) return;

    addAboutSection(newSection);
    setNewSection({
      title: '',
      content: '',
      type: 'text',
      order: (aboutContent?.sections.length || 0) + 1,
      image: ''
    });
  };

  const handleUpdateSection = (id: string, data: Partial<typeof newSection>) => {
    updateAboutSection(id, data);
    setEditingSection(null);
  };

  const handleDeleteSection = (id: string) => {
    if (confirm('Bu bölümü silmek istediğinizden emin misiniz?')) {
      deleteAboutSection(id);
    }
  };

  if (!aboutContent) {
    return (
      <div className="p-6">
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkımızda İçeriği Bulunamadı</h2>
            <p className="text-gray-600">Hakkımızda sayfası içeriği mevcut değil.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Hakkımızda Yönetimi</h1>
        <div className="flex space-x-2">
          <Button
            variant={aboutContent.isActive ? 'secondary' : 'primary'}
            size="sm"
            leftIcon={aboutContent.isActive ? <EyeOff /> : <Eye />}
            onClick={() => updateAboutContent({ ...aboutContent, isActive: !aboutContent.isActive })}
          >
            {aboutContent.isActive ? 'Pasif Yap' : 'Aktif Yap'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Ana İçerik</h2>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'İptal' : 'Düzenle'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <Input
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Hakkımızda başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                  <Input
                    value={aboutForm.subtitle}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Alt başlık"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ana İçerik (HTML)</label>
                <textarea
                  value={aboutForm.content}
                  onChange={(e) => setAboutForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="HTML içerik..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Resmi URL</label>
                <Input
                  value={aboutForm.heroImage}
                  onChange={(e) => setAboutForm(prev => ({ ...prev, heroImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  İptal
                </Button>
                <Button leftIcon={<Save />} onClick={handleSaveAbout}>
                  Kaydet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Başlık:</span>
                  <p className="text-gray-900">{aboutContent.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Alt Başlık:</span>
                  <p className="text-gray-900">{aboutContent.subtitle || 'Belirtilmemiş'}</p>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">İçerik Önizleme:</span>
                <div 
                  className="mt-2 p-4 bg-gray-50 rounded-lg prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: aboutContent.content }}
                />
              </div>

              {aboutContent.heroImage && (
                <div>
                  <span className="font-medium text-gray-700">Hero Resmi:</span>
                  <div className="mt-2">
                    <img 
                      src={aboutContent.heroImage} 
                      alt="Hero" 
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Sections */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">İçerik Bölümleri</h2>

          {/* Add New Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-md font-medium mb-4">Yeni Bölüm Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <Input
                  value={newSection.title}
                  onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Bölüm başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <select
                  value={newSection.type}
                  onChange={(e) => setNewSection(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Sadece Metin</option>
                  <option value="image-text">Resim + Metin</option>
                  <option value="text-image">Metin + Resim</option>
                  <option value="full-image">Tam Resim</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                <Input
                  type="number"
                  value={newSection.order}
                  onChange={(e) => setNewSection(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>
              {newSection.type !== 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
                  <Input
                    value={newSection.image}
                    onChange={(e) => setNewSection(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (HTML)</label>
              <textarea
                value={newSection.content}
                onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                placeholder="HTML içerik..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button leftIcon={<Plus />} onClick={handleAddSection}>
              Bölüm Ekle
            </Button>
          </div>

          {/* Existing Sections */}
          <div className="space-y-4">
            {aboutContent.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Sıra: {section.order}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        {section.type}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setEditingSection(section.id)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                  <div 
                    className="text-sm text-gray-600 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />

                  {section.image && (
                    <div className="mt-3">
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </div>
                  )}
                </motion.div>
              ))}

            {aboutContent.sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Henüz bölüm eklenmemiş
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutManagement;