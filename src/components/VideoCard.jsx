import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';

const VideoCard = ({ title, episode, thumbnail, duration, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10, rotate: 1 }}
      whileTap={{ scale: 0.9, rotate: -1 }}
      className="cartoon-card"
      onClick={onClick}
      style={{
        background: 'white',
        border: '4px solid #1A535C',
        boxShadow: '8px 8px 0px #1A535C',
        cursor: 'pointer'
      }}
    >
      {/* Thumbnail Area */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: '180px',
          borderBottom: '4px solid #1A535C',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Thumbnail Image */}
        <img
          src={thumbnail}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />

        {/* Dark overlay + Play button — only on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  background: 'white',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '3px solid #1A535C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 4px 0px #1A535C'
                }}
              >
                <Play fill="#FF6B6B" color="#FF6B6B" size={30} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration Badge — always visible */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(26,83,92,0.9)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '8px',
          fontSize: '0.78rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock size={11} />
          {duration}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'inline-block',
          background: '#FFE66D',
          padding: '3px 10px',
          borderRadius: '10px',
          border: '2px solid #1A535C',
          fontSize: '0.75rem',
          fontWeight: '800',
          marginBottom: '8px'
        }}>
          {episode}
        </div>
        <h3 style={{
          fontSize: '1.1rem',
          color: '#1A535C',
          lineHeight: '1.2',
          fontWeight: '900',
          textTransform: 'uppercase'
        }}>
          {title}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px'
        }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={14} fill="#FF6B6B" color="#1A535C" />
            ))}
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1A535C', opacity: 0.6 }}>
            4.8 Avis
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
