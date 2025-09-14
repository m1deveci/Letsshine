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
  RefreshCw,
  GripVertical
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TeamMember } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageCropModal from '../../components/ui/ImageCropModal';
import Swal from 'sweetalert2';

interface TeamMemberForm {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  image: string;
  role: 'founder' | 'consultant';
  parentId?: number;
  orderIndex: number;
  isActive: boolean;
  expertise: string[];
}

interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  showCropModal: boolean;
  originalFile: File | null;
  croppedBlob: Blob | null;
}

interface SortableExpertiseItemProps {
  id: string;
  expertise: string;
  onRemove: (expertise: string) => void;
}

const SortableExpertiseItem: React.FC<SortableExpertiseItemProps> = ({ id, expertise, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg border ${
        isDragging ? 'shadow-lg border-blue-300' : 'border-transparent'
      } transition-all duration-200`}
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-2 text-blue-600 hover:text-blue-800"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <span className="select-none">{expertise}</span>
      <button
        type="button"
        onClick={() => onRemove(expertise)}
        className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const TeamManagement: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useApp();
  const { token } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [formData, setFormData] = useState<TeamMemberForm>({
    name: '',
    title: '',
    bio: '',
    email: '',
    linkedin: '',
    image: '',
    role: 'consultant',
    parentId: undefined,
    orderIndex: teamMembers.length + 1,
    isActive: true,
    expertise: []
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false,
    showCropModal: false,
    originalFile: null,
    croppedBlob: null
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
        role: member.role,
        parentId: member.parentId,
        orderIndex: member.orderIndex,
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
        role: 'consultant',
        parentId: undefined,
        orderIndex: teamMembers.length + 1,
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
      uploading: false,
      showCropModal: false,
      originalFile: null,
      croppedBlob: null
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.expertise.findIndex(item => item === active.id);
      const newIndex = formData.expertise.findIndex(item => item === over.id);

      setFormData(prev => ({
        ...prev,
        expertise: arrayMove(prev.expertise, oldIndex, newIndex)
      }));
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        await Swal.fire({
          icon: 'warning',
          title: 'Geçersiz Dosya!',
          text: 'Lütfen sadece resim dosyası seçin.',
          confirmButtonText: 'Tamam'
        });
        return;
      }
      
      // File size validation removed - backend will resize automatically

      setFileUpload(prev => ({
        ...prev,
        originalFile: file,
        preview: URL.createObjectURL(file),
        showCropModal: true,
        file: null,
        croppedBlob: null
      }));
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    const croppedPreviewUrl = URL.createObjectURL(croppedImageBlob);

    setFileUpload(prev => ({
      ...prev,
      croppedBlob: croppedImageBlob,
      file: new File([croppedImageBlob], 'cropped-image.jpg', { type: 'image/jpeg' }),
      preview: croppedPreviewUrl,
      showCropModal: false
    }));
  };

  const handleCropCancel = () => {
    setFileUpload(prev => ({
      ...prev,
      showCropModal: false,
      originalFile: null,
      preview: null
    }));
  };

  const handleFileUpload = async (): Promise<string | null> => {
    if (!fileUpload.file && !fileUpload.croppedBlob) return null;

    setFileUpload(prev => ({ ...prev, uploading: true }));

    try {
      const formData = new FormData();

      // Use cropped blob if available, otherwise fall back to original file
      if (fileUpload.croppedBlob) {
        formData.append('image', fileUpload.croppedBlob, 'cropped-image.jpg');
      } else if (fileUpload.file) {
        formData.append('image', fileUpload.file);
      }

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
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Dosya yüklenirken hata oluştu. Lütfen tekrar deneyin.',
        confirmButtonText: 'Tamam'
      });
      return null;
    } finally {
      setFileUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // If a new file is selected (original or cropped), upload it first
      if (fileUpload.file || fileUpload.croppedBlob) {
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
        await updateTeamMember(editingMember.id, memberData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Ekip üyesi başarıyla güncellendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await addTeamMember(memberData);
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Yeni ekip üyesi başarıyla eklendi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Form gönderilirken hata oluştu.';
      await Swal.fire({
        title: 'Hata!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Ekip Üyesini Sil',
      text: 'Bu ekip üyesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
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
        await deleteTeamMember(id);
        await Swal.fire({
          title: 'Silindi!',
          text: 'Ekip üyesi başarıyla silindi.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ekip üyesi silinirken hata oluştu.';
        await Swal.fire({
          title: 'Hata!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      }
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
                {/* Role Badge */}
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  member.role === 'founder' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {member.role === 'founder' ? 'K' : 'D'}
                </div>
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
              {member.expertise && member.expertise.length > 0 && (
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

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'founder' | 'consultant' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="consultant">Danışman</option>
                      <option value="founder">Kurucu Ortak</option>
                    </select>
                  </div>

                  {/* Parent Selection (for consultants) */}
                  {formData.role === 'consultant' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Üst Danışman (Opsiyonel)
                      </label>
                      <select
                        value={formData.parentId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value ? parseInt(e.target.value) : undefined }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Üst danışman seçin</option>
                        {teamMembers
                          .filter(member => member.role === 'founder')
                          .map(member => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Order Index */}
                  <Input
                    label="Sıralama"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                <div className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700">
                      📸 Profil Fotoğrafı
                    </label>
                    
                    {/* Current Image Preview */}
                    {(formData.image || fileUpload.preview) && (
                      <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                          <img
                            src={fileUpload.preview || formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">
                            {fileUpload.preview ? '✅ Yeni fotoğraf seçildi' : '📷 Mevcut fotoğraf'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {fileUpload.preview ? 'Değişiklikler kaydedilecek' : 'Güncellemek için yeni fotoğraf seçin'}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* File Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Fotoğraf seçmek için tıklayın</span>
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG, GIF - Crop editörü ile düzenlenecektir</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* URL Input (Alternative) */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">veya</span>
                      </div>
                    </div>
                    
                    <Input
                      label="🌐 Fotoğraf URL'si"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/photo.jpg"
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

              {/* Expertise with Drag & Drop */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uzmanlık Alanları
                  <span className="text-xs text-gray-500 ml-2">(Sürükle-bırak ile sıralayabilirsiniz)</span>
                </label>
                <div className="flex gap-2 mb-4">
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
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Ekle
                  </Button>
                </div>

                {formData.expertise.length > 0 && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={formData.expertise}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="flex flex-wrap gap-3">
                          {formData.expertise.map((skill) => (
                            <SortableExpertiseItem
                              key={skill}
                              id={skill}
                              expertise={skill}
                              onRemove={handleRemoveExpertise}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}

                {formData.expertise.length === 0 && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 text-sm">
                    Henüz uzmanlık alanı eklenmemiş
                  </div>
                )}
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

      {/* Image Crop Modal */}
      {fileUpload.showCropModal && fileUpload.originalFile && (
        <ImageCropModal
          isOpen={fileUpload.showCropModal}
          onClose={handleCropCancel}
          imageSrc={URL.createObjectURL(fileUpload.originalFile)}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // 1:1 aspect ratio for profile photos
        />
      )}
    </div>
  );
};

export default TeamManagement;