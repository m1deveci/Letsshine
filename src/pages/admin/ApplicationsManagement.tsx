import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Application } from '../../types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ApplicationsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbApplications, setDbApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { applications, updateApplicationStatus } = useApp();
  const { token } = useAuth();

  // Database'den başvuruları çek
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      // Date alanlarını düzelt
      const formattedData = data.map((app: any) => ({
        ...app,
        id: app.id.toString(),
        serviceId: app.service_id,
        serviceName: app.service_name,
        createdAt: new Date(app.created_at)
      }));
      
      setDbApplications(formattedData);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Başvurular yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Context ve database verilerini birleştir
  const allApplications = [...dbApplications, ...applications.filter(app => 
    !dbApplications.find(dbApp => dbApp.id === app.id)
  )];

  const filteredApplications = allApplications.filter(application => {
    const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'reviewed':
        return 'İncelendi';
      case 'contacted':
        return 'İletişim Kuruldu';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      // Update local state
      updateApplicationStatus(applicationId, newStatus);
      // Refresh applications from database
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Başvuru durumu güncellenirken hata oluştu');
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

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
            Başvuru Yönetimi
          </h1>
          <p className="text-gray-600">
            Gelen başvuruları yönetin ve takip edin ({allApplications.length} başvuru)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          onClick={fetchApplications}
          disabled={isLoading}
        >
          {isLoading ? 'Yükleniyor...' : 'Yenile'}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Başvuru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-48 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekliyor</option>
                <option value="reviewed">İncelendi</option>
                <option value="contacted">İletişim Kuruldu</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Başvurular yükleniyor...</p>
        </motion.div>
      )}

      {/* Applications List */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Başvuru Bulunamadı
                </h3>
                <p className="text-gray-600">
                  {allApplications.length === 0 
                    ? 'Henüz hiç başvuru yapılmamış.' 
                    : 'Arama kriterlerinize uygun başvuru bulunamadı.'}
                </p>
              </div>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {application.serviceName}
                    </p>
                    {application.category && (
                      <p className="text-sm text-gray-600">
                        Kategori: {application.category}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {application.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {application.phone}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                {application.message && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <strong>Mesaj:</strong> {application.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(application.id, e.target.value as Application['status'])}
                  className="block w-full sm:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="reviewed">İncelendi</option>
                  <option value="contacted">İletişim Kuruldu</option>
                  <option value="completed">Tamamlandı</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(application)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Detay
                </Button>
              </div>
            </div>
              </Card>
            ))
          )}
        </motion.div>
      )}

      {/* Application Detail Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Başvuru Detayları
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <p className="text-gray-900">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hizmet
                    </label>
                    <p className="text-gray-900">{selectedApplication.serviceName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <p className="text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <p className="text-gray-900">{selectedApplication.phone}</p>
                  </div>
                  {selectedApplication.category && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <p className="text-gray-900">{selectedApplication.category}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusText(selectedApplication.status)}
                    </span>
                  </div>
                </div>

                {selectedApplication.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedApplication.message}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başvuru Tarihi
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedApplication.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;