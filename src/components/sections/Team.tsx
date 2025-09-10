import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Users } from 'lucide-react';
import { TeamMember } from '../../types';
import Card from '../ui/Card';

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((member: any) => ({
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

  const activeMembers = teamMembers.filter(member => member.isActive);

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

  if (activeMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
            <Users className="w-4 h-4 mr-2" />
            Uzman Ekibimiz
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            İnsan Odaklı{' '}
            <span className="text-blue-600">Profesyonel Ekibimiz</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alanında uzman ve deneyimli profesyonellerimizle, 
            İnsan Kaynakları çözümlerinizde yanınızdayız.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="relative mb-6">
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
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-blue-100 group-hover:border-blue-300 transition-colors duration-300"></div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {member.title}
                      </p>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    {/* Expertise */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Uzmanlık Alanları:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {member.expertise.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Links */}
                    <div className="flex justify-center space-x-4 pt-4">
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
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
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
    </section>
  );
};

export default Team;