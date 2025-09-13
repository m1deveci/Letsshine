import React from 'react';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import About from '../components/sections/About';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Services />
      <About />
    </div>
  );
};

export default HomePage;