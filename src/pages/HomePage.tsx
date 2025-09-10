import React from 'react';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import About from '../components/sections/About';
import Team from '../components/sections/Team';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Services />
      <Team />
      <About />
    </div>
  );
};

export default HomePage;