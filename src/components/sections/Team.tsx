import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Users, X, Briefcase, Award, Crown, UserCheck, Star } from 'lucide-react';
import { TeamMember } from '../../types';
import Card from '../ui/Card';

// --- ALT BİLEŞEN (DIŞARI ALINDI) ---
// TeamMemberCard'ı ana bileşenin dışına taşıdık.
// Artık 'onOpenModal' fonksiyonunu prop olarak alıyor.
interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  isFounder?: boolean;
  onOpenModal: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  index, 
  isFounder = false,
  onOpenModal
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    className="w-full max-w-sm" // Kartın maksimum genişliğini sınırla
  >
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
      <div className="text-center h-full flex flex-col">
        {/* Profile Image */}
        <div className="relative mb-6 flex-shrink-0">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
            )}
          </div>
          {/* Role Badge */}
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
            isFounder ? 'bg-yellow-500' : 'bg-blue-500'
          }`} style={{ right: 'calc(50% - 4rem - 10px)' }}> {/* Rozeti hizada tutmak için stil ayarı */}
            {isFounder ? (
              <Crown className="w-4 h-4 text-white" />
            ) : (
              <UserCheck className="w-4 h-4 text-white" />
            )}
          </div>
          {/* Decorative Ring */}
          <div className={`absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 transition-colors duration-300 ${
            isFounder ? 'border-yellow-100 group-hover:border-yellow-300' : 'border-blue-100 group-hover:border-blue-300'
          }`}></div>
        </div>

        {/* Member Info */}
        <div className="space-y-4 flex-grow flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {member.name}
            </h3>
            <p className={`font-medium ${isFounder ? 'text-yellow-600' : 'text-blue-600'}`}>
              {member.title}
            </p>
            {isFounder && (
              <div className="flex justify-center mt-1">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Kurucu
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div 
              className="text-gray-600 text-sm leading-relaxed cursor-pointer hover:text-blue-600 transition-colors duration-300 flex-grow"
              onClick={() => onOpenModal(member)}
              title="Detaylı bilgi için tıklayın"
            >
              {member.bio.length > 150 
                ? `${member.bio.substring(0, 150)}...` 
                : member.bio
              }
              {member.bio.length > 150 && (
                <span className="text-blue-600 font-medium ml-1">Devamını oku</span>
              )}
            </div>
          )}

          {/* Expertise */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="space-y-2 mt-auto pt-4">
              <h4 className="text-sm font-semibold text-gray-700">Uzmanlık Alanları:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {member.expertise.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      isFounder 
                        ? 'bg-yellow-50 text-yellow-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    <Star className="w-3 h-3 text-yellow-500 fill-current animate-pulse" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Links */}
          <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100 mt-4">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                title={`${member.name} ile e-posta üzerinden iletişim`}
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                title={`${member.name} LinkedIn profili`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

// --- ANA BİLEŞEN ---
const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((member: TeamMember) => ({
            ...member,
            createdAt: new Date(member.createdAt),
            updatedAt: new Date(member.updatedAt)
          }));
          setTeamMembers(formattedData);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const organizeTeamMembers = (members: TeamMember[]) => {
    const founders = members.filter(member => member.role === 'founder');
    const consultants = members.filter(member => member.role === 'consultant');
    
    return { founders, consultants };
  };

  const { founders, consultants } = organizeTeamMembers(teamMembers);

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ekip bilgileri yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="pt-16 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            İnsan Odaklı{' '}
            <span className="text-blue-600">Profesyonel Ekibimiz</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alanında uzman ve deneyimli profesyonellerimizle, 
            İnsan Kaynakları çözümlerinizde yanınızdayız.
          </p>
        </motion.div>

        {/* Founders Section */}
        {founders.length > 0 && (
          // DÜZELTME: flex ve items-center eklendi, w-full eklendi
          <div className="mb-16 flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 flex flex-col items-center" // Başlık içeriğini ortalamak için flex eklendi
            >
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Kurucumuz
              </div>
           
            </motion.div>
            
            {/* Kurucuları ortalamak için flex yapısı kullanıldı */}
            <div className="flex flex-wrap gap-8 justify-center w-full">
              {founders.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isFounder={true}
                  onOpenModal={openModal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Consultants Section */}
        {consultants.length > 0 && (
           // DÜZELTME: flex ve items-center eklendi (Danışmanlar için de)
          <div className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 flex flex-col items-center"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                <UserCheck className="w-4 h-4 mr-2" />
                Danışmanlarımız
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Uzman Danışman Ekibimiz
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Alanında uzman danışmanlarımızla size en iyi hizmeti sunuyoruz.
              </p>
            </motion.div>
            
            {/* DÜZELTME: Grid yapısına justify-items-center eklendi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center max-w-6xl">
              {consultants.map((member, index) => (
                <TeamMemberCard 
                  key={member.id} 
                  member={member} 
                  index={index} 
                  isFounder={false}
                  onOpenModal={openModal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 inline-block w-full max-w-4xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ekibimizle Tanışmak İster misiniz?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Profesyonel ve deneyimli ekibimizle İnsan Kaynakları çözümlerinizi 
              birlikte değerlendirelim.
            </p>
            <a
              href="/iletisim"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              İletişime Geçin
            </a>
          </div>
        </motion.div>
      </div>

      {/* Team Member Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
                      {selectedMember.image ? (
                        <img
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                      <p className="text-blue-600 font-medium">{selectedMember.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Bio Content */}
                {selectedMember.bio && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Profesyonel Geçmiş</h3>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      {selectedMember.bio.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expertise */}
                {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Uzmanlık Alanları</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedMember.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 flex items-center gap-2"
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedMember.email && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">E-posta</p>
                          <a 
                            href={`mailto:${selectedMember.email}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedMember.linkedin && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Linkedin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">LinkedIn</p>
                          <a 
                            href={selectedMember.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            LinkedIn Profili
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  >
                    Kapat
                  </button>
                  <a
                    href="/iletisim"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    İletişime Geç
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;