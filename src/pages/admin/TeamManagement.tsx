import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Mail, 
  Linkedin,
  Camera,
  Save,
  X,
  Upload,
  RefreshCw
} from 'lucide-react';
import { TeamMember } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface TeamMemberForm {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  image: string;
  order: number;
  isActive: boolean;
  expertise: string[];
}

interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
}

const TeamManagement: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useApp();
  const { token } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberForm>({
    name: '',
    title: '',
    bio: '',
    email: '',
    linkedin: '',
    image: '',
    order: teamMembers.length + 1,
    isActive: true,
    expertise: []
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false
  });

  const handleOpenForm = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        title: member.title,
        bio: member.bio || '',
        email: member.email || '',
        linkedin: member.linkedin || '',
        image: member.image || '',
        order: member.order,
        isActive: member.isActive,
        expertise: [...member.expertise]
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        title: '',
        bio: '',
        email: '',
        linkedin: '',
        image: '',
        order: teamMembers.length + 1,
        isActive: true,
        expertise: []
      });
    }
    // Reset file upload state
    setFileUpload({
      file: null,
      preview: null,
      uploading: false
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    setNewExpertise('');
    setFileUpload({
      file: null,
      preview: null,
      uploading: false
    });
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      setFileUpload(prev => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleFileUpload = async (): Promise<string | null> => {
    if (!fileUpload.file) return null;

    setFileUpload(prev => ({ ...prev, uploading: true }));

    try {
      const formData = new FormData();
      formData.append('image', fileUpload.file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Dosya yüklenirken hata oluştu.');
      return null;
    } finally {
      setFileUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // If a new file is selected, upload it first
      if (fileUpload.file) {
        const uploadedUrl = await handleFileUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Stop if upload failed
        }
      }
      
      const memberData = {
        ...formData,
        image: imageUrl
      };
      
      if (editingMember) {
        updateTeamMember(editingMember.id, memberData);
      } else {
        addTeamMember(memberData);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Form gönderilirken hata oluştu.');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) {
      deleteTeamMember(id);
    }
  };

  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ekip Yönetimi
          </h1>
          <p className="text-gray-600">
            Ekip üyelerini yönetin ve düzenleyin ({teamMembers.length} üye)
          </p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Yeni Üye Ekle
        </Button>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedMembers.map((member) => (
          <Card key={member.id} className="relative">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-blue-500" />
                    </div>
                  )}
                </div>
                {!member.isActive && (
                  <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="space-y-2 mb-4">
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium">{member.title}</p>
                {member.bio && (
                  <p className="text-gray-600 text-xs line-clamp-2">{member.bio}</p>
                )}
              </div>

              {/* Expertise */}
              {member.expertise.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{member.expertise.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex justify-center space-x-2 mb-4 text-gray-400">
                {member.email && <Mail className="w-4 h-4" />}
                {member.linkedin && <Linkedin className="w-4 h-4" />}
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenForm(member)}
                  leftIcon={<Edit2 className="w-4 h-4" />}
                >
                  Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sil
                </Button>
              </div>

              {/* Order Badge */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center justify-center">
                {member.order}
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Ad Soyad"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="Ünvan"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />

                  <Input
                    label="E-posta"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />

                  <Input
                    label="LinkedIn Profili"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Profil Fotoğrafı
                    </label>
                    
                    {/* Current Image Preview */}
                    {(formData.image || fileUpload.preview) && (
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                          <img
                            src={fileUpload.preview || formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          {fileUpload.preview ? 'Yeni fotoğraf seçildi' : 'Mevcut fotoğraf'}
                        </div>
                      </div>
                    )}
                    
                    {/* File Upload */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF formatları desteklenir. Maksimum 5MB.
                      </p>
                    </div>
                    
                    {/* URL Input (Alternative) */}
                    <div className="text-sm text-gray-600 text-center">veya</div>
                    <Input
                      label="Fotoğraf URL'si"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>

                  <Input
                    label="Sıra"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    min="1"
                    required
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Aktif
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biyografi
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kısa biyografi..."
                />
              </div>

              {/* Expertise */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uzmanlık Alanları
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Yeni uzmanlık alanı..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddExpertise}
                    size="sm"
                  >
                    Ekle
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  leftIcon={<Save className="w-4 h-4" />}
                  disabled={fileUpload.uploading}
                >
                  {fileUpload.uploading ? 'Yükleniyor...' : (editingMember ? 'Güncelle' : 'Kaydet')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz Ekip Üyesi Yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk ekip üyenizi ekleyerek başlayın.
              </p>
              <Button
                onClick={() => handleOpenForm()}
                leftIcon={<Plus className="w-5 h-5" />}
              >
                İlk Üyeyi Ekle
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TeamManagement;