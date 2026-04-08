import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEO_URL = 'https://vz-a83ec049-8fb.b-cdn.net/e324d74a-d2f2-452d-8957-64fd76b28b64/play_720p.mp4';
const DURATION  = 8000; // 8 seconds

const Intro = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fading,   setFading]   = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    // Tick progress bar every 80ms
    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(tick);
        setFading(true);
        setTimeout(() => {
          localStorage.setItem('animes_enfants_visited', '1');
          onComplete();
        }, 800); // wait for fade-out
      }
    }, 80);
    return () => clearInterval(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Full-screen video */}
          <video
            src={VIDEO_URL}
            autoPlay muted playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0
            }}
          />

          {/* Dark overlay for readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.55)', zIndex: 1
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '20px' }}>
            {/* Animated tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ color: 'white', fontWeight: '700', fontSize: '1.3rem', marginBottom: '40px', letterSpacing: '1px' }}
            >
              RIS. SOUFFLE. REGARDE ENCORE. 🎬
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                width: '320px',
                maxWidth: '90vw',
                margin: '0 auto'
              }}
            >
              {/* Track */}
              <div style={{
                height: '16px',
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(255,230,109,0.4)'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #4ECDC4, #FFE66D)',
                    borderRadius: '20px',
                    transition: 'width 0.08s linear'
                  }}
                />
              </div>

              {/* Label */}
              <div style={{
                marginTop: '12px',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: '800',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>CHARGEMENT EN COURS...</span>
                <span style={{ color: '#FFE66D' }}>{Math.round(progress)}%</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
