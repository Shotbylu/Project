import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Background from './components/Background';
import Contact from './components/Contact';
import DinosaurGame from './components/DinosaurGame';
import Footer from './components/Footer';
const Campaigns = React.lazy(() => import('./sections/Campaigns'));

const App: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Header />
      <Hero />
      <Suspense
        fallback={
          <div className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-24 animate-pulse rounded-3xl bg-gray-100" />
            </div>
          </div>
        }
      >
        <Campaigns />
      </Suspense>
      <Background />
      <Skills />
      <Projects />
      <Contact />
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DinosaurGame />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default App;
