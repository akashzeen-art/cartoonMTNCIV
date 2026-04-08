import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Intro from './components/Intro';
import Header from './components/Header';
import Hero from './components/Hero';
import CharacterHighlights from './components/CharacterHighlights';
import Featured from './components/Featured';
import VideoGrid from './components/VideoGrid';
import About from './components/About';
import ExtraSections from './components/ExtraSections';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Simulate intro duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500); // Intro lasts ~4.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <AnimatePresence>
        {loading ? (
          <Intro key="intro" onComplete={() => setLoading(false)} />
        ) : (
          <>
            {/* Scroll Progress Bar for Premium Feel */}
            <motion.div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: '#FF6B6B',
                transformOrigin: '0%',
                zIndex: 1000,
                scaleX
              }}
            />

            <motion.main
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Header />
              <Hero />
              
              {/* Added Premium Section Between Hero and Gallery */}
              <CharacterHighlights />
              
              <Featured />
              <VideoGrid />
              <About />
              <ExtraSections />
              <Footer />
            </motion.main>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Global Scroll Reveal Helper */
        .reveal-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .reveal-section.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default App;
