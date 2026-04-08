import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Intro from './components/Intro';
import Header from './components/Header';
import Hero from './components/Hero';
import Featured from './components/Featured';
import VideoGrid from './components/VideoGrid';
import About from './components/About';
import ExtraSections from './components/ExtraSections';
import Footer from './components/Footer';
import CartoonMascot from './components/CartoonMascot';
import CartoonAnimations from './components/CartoonAnimations';
import FluidBackground from './components/FluidBackground';
import ColoringPage from './pages/ColoringPage';

function HomePage() {
  const isFirstVisit = !localStorage.getItem('animes_enfants_visited');
  const [loading, setLoading] = useState(isFirstVisit);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ── Fluid simulation background ── */}
      {!loading && <FluidBackground />}

      {/* ── Floating cartoon animations ── */}
      {!loading && <CartoonAnimations />}

      {/* ── Mascot ── */}
      {!loading && (
        <>
          <div className="mascot-wrapper">
            <CartoonMascot />
          </div>
          <style>{`
            .mascot-wrapper {
              position: fixed;
              bottom: 0;
              right: 20px;
              width: 130px;
              height: 210px;
              z-index: 50;
              pointer-events: none;
            }
            @media (max-width: 768px) {
              .mascot-wrapper {
                right: auto;
                left: 50%;
                transform: translateX(-50%);
                width: 120px;
                height: 190px;
                opacity: 0.35;
                z-index: 0;
              }
            }
          `}</style>
        </>
      )}

      <AnimatePresence>
        {loading ? (
          <Intro key="intro" onComplete={() => setLoading(false)} />
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Header />
            <Hero />
            <Featured />
            <VideoGrid />
            <ExtraSections />
            <About />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/coloring" element={<ColoringPage />} />
    </Routes>
  );
}

export default App;
