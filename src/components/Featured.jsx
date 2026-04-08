import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';

const featured = [
  { id: 101, title: "Folie Martienne",                                          episode: "SPÉCIAL",     thumbnail: "/thumnails/Foliemartienne.png",                                         duration: "10:24", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/2522c4d0-b0f5-4670-b230-bebfb9b15640/play_360p.mp4" },
  { id: 102, title: "Qui a cassé le télescope du Grand Schtroumpf ?",           episode: "EN VEDETTE", thumbnail: "/thumnails/QuiacasséletélescopeduGrandSchtroumpf-LesSchtroumpfs.png",  duration: "10:55", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/8626c17c-3746-4eff-92b5-2bee91a2258e/play_360p.mp4" },
  { id: 103, title: "Le Maître — Pokémon Évolutions Épisode 1",                 episode: "NOUVEAU !",   thumbnail: "/thumnails/LeMaîtrePokémonÉvolutions_Épisode1.png",                    duration: "13:52", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/674fbb0d-bd70-43b2-bf4d-3c8c2423455e/play_480p.mp4" },
  { id: 104, title: "Résumé Complet Saga Babidi",                               episode: "TENDANCE",    thumbnail: "/thumnails/RésuméCompletSagaBabidi.png",                               duration: "15:00", videoUrl: "https://vz-a83ec049-8fb.b-cdn.net/78021cad-e44c-4a44-99f8-a97e6eff2dc0/play_360p.mp4" },
];

const CARD_WIDTH = 320;
const GAP = 30;
const STEP = CARD_WIDTH + GAP;

const Featured = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const x = useMotionValue(0);
  const [dragWidth, setDragWidth] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  const calcWidth = () => {
    if (outerRef.current && innerRef.current) {
      setDragWidth(innerRef.current.scrollWidth - outerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    calcWidth();
    window.addEventListener('resize', calcWidth);
    return () => window.removeEventListener('resize', calcWidth);
  }, []);

  const slideLeft = () => {
    const current = x.get();
    const next = Math.min(current + STEP, 0);
    animate(x, next, { type: 'spring', stiffness: 300, damping: 30 });
  };

  const slideRight = () => {
    const current = x.get();
    const next = Math.max(current - STEP, -dragWidth);
    animate(x, next, { type: 'spring', stiffness: 300, damping: 30 });
  };

  return (
    <section style={{ padding: '80px 0', background: 'rgba(247,255,247,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', overflow: 'hidden' }}>
      <div className="container">

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF6B6B', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px' }}
            >
              <Award size={24} />
              FAVORIS DE LA SEMAINE !
            </motion.div>
            <h2 style={{ fontSize: '3rem', color: '#1A535C', lineHeight: '1' }}>
              Émissions <br /> Préférées
            </h2>
          </div>

          {/* Arrow buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={slideLeft}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'white', border: '4px solid #1A535C',
                boxShadow: '4px 4px 0px #1A535C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={24} color="#1A535C" strokeWidth={3} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={slideRight}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: '#FF6B6B', border: '4px solid #1A535C',
                boxShadow: '4px 4px 0px #1A535C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={24} color="white" strokeWidth={3} />
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={outerRef} style={{ overflow: 'hidden', cursor: 'grab' }}>
          <motion.div
            ref={innerRef}
            drag="x"
            dragConstraints={{ right: 0, left: -dragWidth }}
            dragElastic={0.08}
            dragMomentum={true}
            whileTap={{ cursor: 'grabbing' }}
            style={{ display: 'flex', gap: `${GAP}px`, padding: '20px 4px', width: 'max-content', x }}
          >
            {featured.map((v) => (
              <div key={v.id} style={{ width: `${CARD_WIDTH}px`, position: 'relative', flexShrink: 0 }}>
                <VideoCard {...v} onClick={() => setActiveVideo(v)} />
                <div style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  background: '#1A535C', color: 'white',
                  padding: '5px 15px', borderRadius: '20px',
                  fontSize: '0.8rem', fontWeight: '700',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                  zIndex: 10, pointerEvents: 'none'
                }}>
                  {v.episode}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,83,92,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', border: '6px solid #1A535C', borderRadius: '24px',
              boxShadow: '16px 16px 0px #FFE66D', width: '100%', maxWidth: '860px', overflow: 'hidden'
            }}
          >
            <div style={{
              background: '#FFE66D', borderBottom: '4px solid #1A535C',
              padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1A535C', textTransform: 'uppercase' }}>
                {activeVideo.title}
              </span>
              <button onClick={() => setActiveVideo(null)} style={{
                background: '#FF6B6B', border: '3px solid #1A535C', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', color: 'white',
                fontWeight: '900', fontSize: '1.1rem', boxShadow: '3px 3px 0px #1A535C'
              }}>✕</button>
            </div>
            <div style={{ background: 'black', aspectRatio: '16/9' }}>
              <video
                key={activeVideo.videoUrl}
                src={activeVideo.videoUrl}
                controls autoPlay
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Featured;
