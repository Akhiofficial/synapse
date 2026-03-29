import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-orange/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* Adjusted CTA content in App.jsx itself for high-level reuse */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
