import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Heart, Star, Sparkles, Zap, MessageCircle } from 'lucide-react';

const About = () => {
  return (
    <section id="about" style={{
      padding: '100px 0',
      background: 'rgba(247,255,247,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '6px solid #1A535C'
    }}>
      {/* Decorative Blob */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(255, 230, 109, 0.4)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(80px)' }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr',
          gap: '60px',
          alignItems: 'center'
        }} className="about-grid">
          {/* Left Side: Comic Panel */}
          <motion.div
            initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="cartoon-card"
            style={{
              padding: '40px',
              background: '#FF6B6B',
              color: 'white',
              border: '6px solid #1A535C',
              boxShadow: '15px 15px 0px #1A535C',
              position: 'relative'
            }}
          >
            {/* "BOOM!" Sticker */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#FFE66D',
                color: '#1A535C',
                padding: '10px 25px',
                border: '4px solid #1A535C',
                borderRadius: '15px',
                fontWeight: '950',
                fontSize: '1.8rem',
                transform: 'rotate(10deg)',
                boxShadow: '6px 6px 0px #1A535C',
                zIndex: 5
              }}
            >
              OUAH !
            </motion.div>

            <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: '0.9' }}>
               UN MONDE <br /> DE SOURIRES !
            </h2>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.4', fontWeight: '500' }}>
              Animes Enfants n'est pas qu'un site web ; c'est un immense terrain de jeu plein de rebondissements où les histoires prennent vie !
              Nous avons créé un refuge sûr pour chaque petit aventurier.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '3px solid #1A535C', rotate: '-5deg' }}>
                <Smile color="#FF6B6B" size={40} />
              </div>
              <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '3px solid #1A535C', rotate: '5deg' }}>
                <Heart color="#4ECDC4" size={40} />
              </div>
              <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '3px solid #1A535C', rotate: '-3deg' }}>
                <Star color="#FFE66D" size={40} />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Features */}
          <div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{ marginBottom: '40px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#4ECDC4', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '4px solid #1A535C', boxShadow: '5px 5px 0px #1A535C', flexShrink: 0 }}>
                   <Zap color="white" fill="white" size={35} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1A535C' }}>Contenu Super Sécurisé</h3>
                  <p style={{ color: '#636E72', fontSize: '1.1rem', fontWeight: '500' }}>Des vidéos vérifiées à 100% pour un plaisir en toute sécurité.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#FFE66D', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '4px solid #1A535C', boxShadow: '5px 5px 0px #1A535C', flexShrink: 0 }}>
                   <MessageCircle color="#1A535C" fill="#1A535C" size={35} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1A535C' }}>L'Art de Raconter</h3>
                  <p style={{ color: '#636E72', fontSize: '1.1rem', fontWeight: '500' }}>Des personnages qui enseignent la gentillesse, le courage et la créativité.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#FF6B6B', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '4px solid #1A535C', boxShadow: '5px 5px 0px #1A535C', flexShrink: 0 }}>
                   <Sparkles color="white" fill="white" size={35} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1A535C' }}>Toujours GRATUIT !</h3>
                  <p style={{ color: '#636E72', fontSize: '1.1rem', fontWeight: '500' }}>Fous rires illimités pour tous, sans frais cachés.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          h3 { fontSize: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default About;
