import React from 'react';
import Team from '../components/sections/Team';

const TeamPage: React.FC = () => {
  React.useEffect(() => {
    document.title = "Ekibimiz - Let's Shine İnsan Kaynakları";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Team />
    </div>
  );
};

export default TeamPage;
