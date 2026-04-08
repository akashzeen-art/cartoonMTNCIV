import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Rocket, Heart, Ghost, Gamepad2, Tv, Zap, Flame, Sparkles } from 'lucide-react';
import GameModal from './GameModal';

const ExtraSections = () => {
  const [activeGame, setActiveGame] = useState(null);
  const categories = [
    { emoji: "⚡",         title: "À L'ACTION !", subtitle: "BOUM & PAF !",    color: "#FF6B6B",  textColor: "white",
      badge: { text: "POW!", bg: "#FFE66D", textColor: "#1A535C", animate: { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } } },
    { icon: <Ghost />,    title: "COMÉDIE",     subtitle: "ZONE LOL",        color: "#FFE66D"               },
    { icon: <Gamepad2 />, title: "JEUX D'ARCADE", subtitle: "NIVEAU SUIVANT !", color: "#4ECDC4"               },
    { emoji: "🦸",         title: "HÉROS",       subtitle: "SAUVE LA MISE",   color: "#1A535C",  textColor: "white",
      badge: { text: "⭐ #1", bg: "#FFE66D", textColor: "#1A535C", animate: { y: [0, -6, 0], rotate: [0, 5, -5, 0] } } },
    { icon: <Sparkles />, title: "CLASSIQUES",  subtitle: "LES VIEUX C'EST BON", color: "#FFDDE9"               },
    { icon: <Flame />,    title: "BATAILLES",   subtitle: "SCÈNES D'ACTION", color: "#B5FFFC"               },
  ];

  return (
    <div style={{ background: 'transparent' }}>
      {/* Fun Categories Section */}
      <section id="games" style={{ padding: '80px 0', background: 'white', borderTop: '6px solid #1A535C' }}>
        <div className="container">
          {/* Header — same style as videos section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '50px' }}>
            <Gamepad2 size={40} color="#FF6B6B" />
            <h2 style={{ fontSize: '3rem', color: '#1A535C', textTransform: 'uppercase' }}>
              Choisis Ton Aventure !
            </h2>
          </div>

          <div className="category-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: '12px 12px 0px #1A535C' }}
                whileTap={{ scale: 0.95 }}
                className="cartoon-card flex-center"
                style={{
                  flexDirection: 'column',
                  padding: '30px 15px',
                  background: cat.color,
                  color: cat.textColor || '#1A535C',
                  gap: '15px',
                  cursor: 'pointer',
                  border: '4px solid #1A535C',
                  boxShadow: '8px 8px 0px #1A535C',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {cat.badge && (
                  <motion.div
                    animate={cat.badge.animate}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      right: '-10px',
                      background: cat.badge.bg,
                      color: cat.badge.textColor,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '3px solid #1A535C',
                      fontWeight: '950',
                      fontSize: '0.85rem',
                      boxShadow: '3px 3px 0px #1A535C',
                      zIndex: 5,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.badge.text}
                  </motion.div>
                )}
                <div style={{ scale: 2, background: 'white', padding: '10px', borderRadius: '50%', border: '3px solid #1A535C', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', minHeight: '44px' }}>
                  {cat.emoji
                    ? <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{cat.emoji}</span>
                    : cat.icon}
                </div>
                <span style={{ fontWeight: '900', fontSize: '1.1rem', marginTop: '10px', textAlign: 'center' }}>{cat.title}</span>
                <span style={{ fontWeight: '700', fontSize: '0.75rem', opacity: 0.8, textAlign: 'center', letterSpacing: '1px' }}>{cat.subtitle}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Zone Section */}
      <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderTop: '6px solid #1A535C' }}>
        <div className="container">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#FFE66D', padding: '10px 28px', borderRadius: '50px', border: '4px solid #1A535C', boxShadow: '5px 5px 0px #1A535C', marginBottom: '20px' }}>
              <Gamepad2 size={22} color="#1A535C" />
              <span style={{ fontWeight: '900', color: '#1A535C', fontSize: '1rem', letterSpacing: '2px' }}>ZONE DE JEU !</span>
              <Gamepad2 size={22} color="#1A535C" />
            </div>
            <h2 style={{ fontSize: '3rem', color: '#1A535C', fontWeight: '950', textShadow: '4px 4px 0px #FFE66D', lineHeight: '1' }}>
              JOUE ET AMUSE-TOI !
            </h2>
          </motion.div>

          <div className="games-grid">
            {[
              {
                emoji: "🐾",
                title: "Attrape Pokémon !",
                desc: "Lance des Poké Balls et attrape-les tous avant la fin du temps !",
                color: "#FF6B6B",
                textColor: "white",
                tag: "⚡ CHAUD",
                tagBg: "#FFE66D",
                tagText: "#1A535C",
              },
              {
                emoji: "🐭",
                title: "La Poursuite Tom et Jerry",
                desc: "Aide Jerry à échapper à Tom dans la maison — évite tous les pièges !",
                color: "#4ECDC4",
                textColor: "#1A535C",
                tag: "🏆 #1",
                tagBg: "#FF6B6B",
                tagText: "white",
              },
              {
                emoji: "💥",
                title: "Dragon Ball Blast",
                desc: "Charge ton Ki et explose tes ennemis avec le Kamehameha épique !",
                color: "#FFE66D",
                textColor: "#1A535C",
                tag: "🔥 NOUVEAU",
                tagBg: "#1A535C",
                tagText: "white",
              },
            ].map((game, i) => (
              <motion.div
                key={i}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: '14px 14px 0px #1A535C' }}
                className="cartoon-card"
                style={{
                  background: game.color,
                  color: game.textColor,
                  border: '5px solid #1A535C',
                  boxShadow: '8px 8px 0px #1A535C',
                  padding: '35px 28px',
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                }}
              >
                {/* Tag */}
                <div style={{
                  position: 'absolute', top: '-14px', left: '20px',
                  background: game.tagBg, color: game.tagText,
                  padding: '4px 14px', borderRadius: '20px',
                  border: '3px solid #1A535C', fontWeight: '900',
                  fontSize: '0.8rem', boxShadow: '3px 3px 0px #1A535C'
                }}>
                  {game.tag}
                </div>

                {/* Emoji big */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  style={{ fontSize: '3.5rem', marginBottom: '18px', display: 'block' }}
                >
                  {game.emoji}
                </motion.div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: '950', marginBottom: '10px', lineHeight: '1.1' }}>
                  {game.title}
                </h3>
                <p style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9, lineHeight: '1.5', marginBottom: '24px' }}>
                  {game.desc}
                </p>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveGame(game)}
                  style={{
                    background: 'white', color: '#1A535C',
                    border: '4px solid #1A535C', borderRadius: '50px',
                    padding: '10px 28px', fontWeight: '900',
                    fontSize: '1rem', cursor: 'pointer',
                    boxShadow: '4px 4px 0px #1A535C',
                    letterSpacing: '1px'
                  }}
                >
                  🎮 JOUE MAINTENANT !
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Why Kids Love Us Banner with Comic Theme */}
      <section style={{ 
        padding: '100px 0', 
        background: 'linear-gradient(90deg, #FF6B6B 0%, #FFE66D 100%)',
        color: 'white',
        borderTop: '6px solid #1A535C',
        borderBottom: '6px solid #1A535C',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Sticker */}
        <motion.div
           animate={{ rotate: [0, 10, -10, 0] }}
           transition={{ duration: 4, repeat: Infinity }}
           style={{ position: 'absolute', top: '5%', left: '5%', background: 'white', padding: '10px 20px', borderRadius: '15px', border: '4px solid #1A535C', color: '#1A535C', fontWeight: '950', fontSize: '1.5rem', boxShadow: '5px 5px 0px #1A535C', zIndex: 2 }}
        >
          CHOIX DES ENFANTS !
        </motion.div>

        <div className="container banner-flex" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h2 className="banner-title" style={{ fontSize: '4.5rem', textShadow: '6px 6px 0px #1A535C', marginBottom: '40px', fontWeight: '950', lineHeight: '0.9' }}>
              POURQUOI TOUT LE <br /> MONDE SOURIT !
            </h2>
            <div className="banner-grid">
              {[
                { icon: <Smile />, t: "100% Amusant", p: "Fous rires garantis !" },
                { icon: <Rocket />, t: "Nouveau chaque jour", p: "De nouvelles histoires chaque jour !" },
                { icon: <Heart />, t: "Sécurisé", p: "Contrôle parental strict." },
                { icon: <Zap />, t: "Qualité HD", p: "Dessins animés en haute définition." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="cartoon-card"
                  style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.2)', border: '4px solid white', backdropFilter: 'blur(5px)' }}
                >
                  <div style={{ background: 'white', color: '#1A535C', padding: '10px', borderRadius: '12px', border: '3px solid #1A535C' }}><div style={{scale: 1.5}}>{item.icon}</div></div>
                  <div>
                    <h4 style={{ fontSize: '1.4rem', fontWeight: '900' }}>{item.t}</h4>
                    <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: '500' }}>{item.p}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div style={{ 
            width: '350px', 
            height: '350px', 
            background: 'white', 
            borderRadius: '50%',
            border: '10px solid #1A535C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-5deg)',
            boxShadow: '20px 20px 0px rgba(0,0,0,0.1)'
          }} className="hide-tablet flex-center">
             <div style={{ scale: 5, color: '#FF6B6B' }} className="animate-float">
                <Smile size={60} />
             </div>
          </div>
        </div>
      </section>

      {/* Watch Anytime - Comic Card style */}
      <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
        <div className="container">
          <div className="cartoon-card bg-sky watch-anytime-card" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(200px, 350px) 1fr', 
            padding: '60px', 
            gap: '60px',
            alignItems: 'center',
            border: '8px solid #1A535C',
            boxShadow: '20px 20px 0px #1A535C'
          }}>
            <div style={{ position: 'relative' }} className="hide-mobile">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="cartoon-card" 
                style={{ padding: '20px', background: 'white', border: '6px solid #1A535C', boxShadow: '10px 10px 0px #1A535C' }}
              >
                <div style={{ width: '100%', height: '250px', background: '#FFE66D', borderRadius: '15px', border: '3px solid #1A535C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ scale: 4, color: '#1A535C' }}>
                      <Tv size={48} />
                    </div>
                </div>
                <h4 style={{ marginTop: '20px', fontSize: '1.6rem', textAlign: 'center', color: '#1A535C', fontWeight: '900' }}>NOTRE APPLI</h4>
              </motion.div>
            </div>

            <div style={{ textAlign: 'center' }} className="watch-anytime-text">
              <h2 className="section-title" style={{ fontSize: '3.5rem', color: '#1A535C', marginBottom: '20px', fontWeight: '950', lineHeight: '1' }}>
                REGARDE <br /> N'IMPORTE QUAND, <br /> N'IMPORTE OÙ !
              </h2>
              <p style={{ fontSize: '1.4rem', color: '#1A535C', marginBottom: '18px', fontWeight: '600', lineHeight: '1.4' }}>
                Ton canapé, ton lit, ta cabane — les dessins animés te suivent partout !
              </p>
              <p style={{ fontSize: '1.15rem', color: '#1A535C', marginBottom: '18px', fontWeight: '500', lineHeight: '1.5', opacity: 0.85 }}>
                Jour de pluie ? Jour de soleil ? Chaque jour est un jour de dessins animés. 🌈
              </p>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  display: 'inline-block',
                  background: '#FF6B6B',
                  color: 'white',
                  padding: '14px 35px',
                  borderRadius: '50px',
                  border: '4px solid #1A535C',
                  boxShadow: '6px 6px 0px #1A535C',
                  fontSize: '1.3rem',
                  fontWeight: '900',
                  letterSpacing: '1px'
                }}
              >
                APPUIE SUR PLAY ET ÉVADE-TOI ! 🎬
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <GameModal game={activeGame} onClose={() => setActiveGame(null)} />

      <style>{`
        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 30px;
        }
        .banner-flex { display: flex; align-items: center; gap: 60px; }
        .banner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .watch-anytime-text { text-align: left !important; }

        @media (max-width: 1200px) {
          .category-grid { grid-template-columns: repeat(3, 1fr); }
          .banner-title { font-size: 3rem !important; }
          .games-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .hide-tablet { display: none !important; }
          .watch-anytime-card { grid-template-columns: 1fr; padding: 40px !important; }
          .watch-anytime-text { text-align: center !important; }
        }

        @media (max-width: 640px) {
          .games-grid { grid-template-columns: 1fr; }
          .category-grid { grid-template-columns: repeat(2, 1fr); }
          .banner-grid { grid-template-columns: 1fr; }
          .section-title { font-size: 2.5rem !important; }
          .banner-title { font-size: 2rem !important; }
          .app-buttons { flex-direction: column; width: 100%; }
          .app-buttons .cartoon-btn { width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default ExtraSections;
