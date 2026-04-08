import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Zap, PartyPopper } from 'lucide-react';

const PARTICLES = ['💥','⭐','🎬','✨','🎉','⚡','🌟','🎊','🍿','🎭','🏆','🎈'];

const Hero = () => {
  const [burst, setBurst] = useState(false);
  const [flash, setFlash]   = useState(false);
  const [shake, setShake]   = useState(false);
  const [rings, setRings]   = useState(false);

  const handlePlay = () => {
    setBurst(true);
    setFlash(true);
    setShake(true);
    setRings(true);
    setTimeout(() => setFlash(false), 400);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => setRings(false), 800);
    setTimeout(() => {
      setBurst(false);
      document.querySelector('#videos')?.scrollIntoView({ behavior: 'smooth' });
    }, 750);
  };
  return (
    <section id="home" style={{
      padding: '60px 0',
      minHeight: '93vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)',
      borderBottom: '6px solid #1A535C'
    }}>
      {/* Background Blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.2)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-5%', right: '-2%', width: '250px', height: '250px', background: 'rgba(78, 205, 196, 0.2)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(50px)' }} />



      <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="hero-grid" style={{ width: '100%' }}>
          {/* Hero Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-text-align"
          >
            {/* Badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 25px',
                background: 'white',
                borderRadius: '50px',
                border: '4px solid #1A535C',
                boxShadow: '6px 6px 0px #1A535C',
                marginBottom: '28px',
                cursor: 'default'
              }}
            >
              <Zap size={22} fill="#FFE66D" color="#1A535C" />
              <span style={{ fontWeight: '900', color: '#1A535C', fontSize: '1rem' }}>
                🍿 TON PARADIS DES DESSINS ANIMÉS EST ICI !
              </span>
              <Zap size={22} fill="#FFE66D" color="#1A535C" />
            </motion.div>

            {/* Headline */}
            <h1 className="hero-title" style={{
              fontSize: '5rem',
              lineHeight: '0.95',
              color: '#1A535C',
              textShadow: '6px 6px 0px white',
              marginBottom: '24px',
              fontWeight: '950'
            }}>
              RIS. SOUFFLE. <br />
              <span style={{ color: 'white', textShadow: '6px 6px 0px #1A535C' }}>REGARDE ENCORE.</span>
            </h1>

            {/* Subtext */}
            <p className="hero-subtitle" style={{
              fontSize: '1.35rem',
              color: '#1A535C',
              fontWeight: '600',
              lineHeight: '1.5',
              maxWidth: '560px',
              marginBottom: '16px',
              opacity: 0.95
            }}>
              Dessins animés classiques. Batailles épiques. Fous rires sans fin.
              Tous tes préférés — zéro ennui, garanti.
            </p>

            {/* Buttons */}
            <div className="hero-buttons" style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.12, rotate: 2, boxShadow: '10px 10px 0px #1A535C' }}
                whileTap={{ scale: 0.88, rotate: -2 }}
                animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
                transition={shake ? { duration: 0.5 } : {}}
                onClick={handlePlay}
                className="cartoon-btn bg-sky"
                style={{ padding: '20px 45px', fontSize: '1.5rem', color: 'white', gap: '12px', position: 'relative', overflow: 'visible' }}
              >
                <Play fill="white" size={30} />
                JOUE MAINTENANT !

                {/* Ripple rings on button */}
                <AnimatePresence>
                  {rings && [0, 1, 2].map((r) => (
                    <motion.span
                      key={r}
                      initial={{ scale: 0.5, opacity: 0.8 }}
                      animate={{ scale: 3.5, opacity: 0 }}
                      exit={{}}
                      transition={{ duration: 0.7, delay: r * 0.15, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50px',
                        border: '3px solid white',
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.button>

              {/* Burst particles */}
              <AnimatePresence>
                {burst && PARTICLES.map((emoji, i) => {
                  const angle = (i / PARTICLES.length) * Math.PI * 2;
                  const dist  = 100 + Math.random() * 60;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                      animate={{
                        opacity: 0,
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        scale: 2,
                        rotate: Math.random() > 0.5 ? 360 : -360,
                      }}
                      transition={{ duration: 0.75, ease: 'easeOut', delay: i * 0.03 }}
                      style={{
                        position: 'absolute',
                        left: '50%', top: '50%',
                        fontSize: '1.8rem',
                        pointerEvents: 'none',
                        zIndex: 99,
                        transform: 'translate(-50%,-50%)'
                      }}
                    >
                      {emoji}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Fullscreen flash overlay */}
            {createPortal(
              <AnimatePresence>
                {flash && (
                  <motion.div
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0 }}
                    exit={{}}
                    transition={{ duration: 0.35 }}
                    style={{
                      position: 'fixed', inset: 0,
                      background: 'white',
                      zIndex: 99999,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </AnimatePresence>,
              document.body
            )}
          </motion.div>

          {/* Hero Image Illustration */}
          <motion.div
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ position: 'relative' }}
            className="hide-tablet"
          >
            <div className="cartoon-card" style={{ 
              width: '100%', 
              height: '450px', 
              background: 'white',
              border: '8px solid #1A535C',
              boxShadow: '15px 15px 0px #1A535C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 style={{ scale: 6, color: '#FF6B6B' }}
              >
                <PartyPopper size={48} />
              </motion.div>
              
              {/* Floating Star Sticker */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-30px', left: '-30px' }}
              >
                <Star size={80} fill="#FFE66D" color="#1A535C" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 60px;
        }
        .hero-buttons {
          display: flex;
          gap: 30px;
        }
        .hero-text-align { text-align: left; }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-text-align { text-align: center; }
          .hero-buttons { justify-content: center; }
          .hero-title { font-size: 3.5rem !important; }
        }

        @media (max-width: 480px) {
          .hero-buttons { flex-direction: column; }
          .hero-title { font-size: 2.8rem !important; }
          .hero-buttons .cartoon-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
