import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Eye, Trash2, Calendar, User, Phone, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ContactMessage } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Swal from 'sweetalert2';

const MessagesPage: React.FC = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/messages?page=${page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages.map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      })));
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching messages:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Mesajlar yüklenirken hata oluştu.',
        confirmButtonText: 'Tamam'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, readStatus: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: number) => {
    const result = await Swal.fire({
      title: 'Mesajı Sil',
      text: 'Bu mesajı silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete message');
        }

        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);

        await Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Mesaj başarıyla silindi.',
          confirmButtonText: 'Tamam'
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Mesaj silinirken hata oluştu.',
          confirmButtonText: 'Tamam'
        });
      }
    }
  };

  const viewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.readStatus) {
      await markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const unreadCount = messages.filter(msg => !msg.readStatus).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
          <p className="mt-2 text-gray-600">
            Gelen mesajları inceleyin ve yönetin.
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} okunmamış
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="İsim, e-posta veya konu ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            onClick={() => fetchMessages(1)}
            variant="outline"
          >
            Yenile
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Mesajlar yükleniyor...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'Arama kriterlerine uygun mesaj bulunamadı.' : 'Henüz mesaj bulunmuyor.'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => viewMessage(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {message.readStatus ? (
                            <MailOpen className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Mail className="w-4 h-4 text-blue-600" />
                          )}
                          <h3 className={`text-sm font-medium truncate ${
                            !message.readStatus ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          }`}>
                            {message.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 truncate ${
                          !message.readStatus ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {message.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewMessage(message);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Sayfa {pagination.page} / {pagination.totalPages} -
                    Toplam {pagination.total} mesaj
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => fetchMessages(pagination.page - 1)}
                    >
                      Önceki
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => fetchMessages(pagination.page + 1)}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          <Card>
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Mesaj Detayları</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 inline mr-1" />
                      Gönderen
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 inline mr-1" />
                      E-posta
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>

                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedMessage.phone}
                        </a>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Konu
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Gönderilme Tarihi
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesaj
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1"
                  >
                    E-posta ile Cevapla
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Detaylarını görüntülemek için bir mesaj seçin.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;