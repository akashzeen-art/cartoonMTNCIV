import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      padding: '40px 0',
      background: '#1A535C',
      color: 'white',
      borderTop: '8px solid #FFE66D'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <img
            src="/logo/anime.png"
            alt="Animes Enfants"
            style={{ height: '72px', width: 'auto', display: 'block' }}
          />
        </motion.div>

        {/* Tagline */}
        <p style={{ fontSize: '1.05rem', fontWeight: '500', opacity: 0.8, maxWidth: '400px', lineHeight: '1.5' }}>
          Ta dose quotidienne de rires, d'aventures et de magie des dessins animés — tout en un !
        </p>

        {/* Divider */}
        <div style={{ width: '80px', height: '4px', background: '#FFE66D', borderRadius: '4px' }} />

        {/* Copyright */}
        <p style={{ fontSize: '0.95rem', fontWeight: '600', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
          © 2026 Cartoon Box— Fait avec <Heart size={16} fill="#FF6B6B" color="#FF6B6B" /> pour les amoureux des dessins animés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
