import React from 'react';
import { motion } from 'framer-motion';

const elements = [
  // ── STARS ──
  { id: 1,  type: 'star',    top: '8%',  left: '5%',   size: 28, color: '#FFE66D', delay: 0,    duration: 4 },
  { id: 2,  type: 'star',    top: '20%', left: '92%',  size: 20, color: '#FF6B6B', delay: 1.2,  duration: 3.5 },
  { id: 3,  type: 'star',    top: '55%', left: '3%',   size: 24, color: '#4ECDC4', delay: 0.6,  duration: 5 },
  { id: 4,  type: 'star',    top: '72%', left: '88%',  size: 18, color: '#FFE66D', delay: 2,    duration: 4.5 },
  { id: 5,  type: 'star',    top: '40%', left: '96%',  size: 22, color: '#FF6B6B', delay: 0.3,  duration: 3.8 },

  // ── CLOUDS ──
  { id: 6,  type: 'cloud',   top: '5%',  left: '25%',  size: 60, color: 'white',   delay: 0,    duration: 6 },
  { id: 7,  type: 'cloud',   top: '15%', left: '65%',  size: 50, color: 'white',   delay: 2,    duration: 7 },
  { id: 8,  type: 'cloud',   top: '48%', left: '1%',   size: 45, color: 'white',   delay: 1,    duration: 5.5 },

  // ── HEARTS ──
  { id: 9,  type: 'heart',   top: '30%', left: '8%',   size: 22, color: '#FF6B6B', delay: 0.5,  duration: 4 },
  { id: 10, type: 'heart',   top: '65%', left: '94%',  size: 18, color: '#FF6B6B', delay: 1.8,  duration: 3.5 },
  { id: 11, type: 'heart',   top: '85%', left: '10%',  size: 20, color: '#FF9A8B', delay: 0.9,  duration: 4.5 },

  // ── BUBBLES ──
  { id: 12, type: 'bubble',  top: '12%', left: '80%',  size: 30, color: '#4ECDC4', delay: 0,    duration: 5 },
  { id: 13, type: 'bubble',  top: '60%', left: '6%',   size: 22, color: '#B5FFFC', delay: 1.5,  duration: 4 },
  { id: 14, type: 'bubble',  top: '80%', left: '80%',  size: 26, color: '#4ECDC4', delay: 0.7,  duration: 6 },
  { id: 15, type: 'bubble',  top: '35%', left: '93%',  size: 18, color: '#B5FFFC', delay: 2.2,  duration: 3.5 },

  // ── LIGHTNING BOLTS ──
  { id: 16, type: 'bolt',    top: '25%', left: '2%',   size: 26, color: '#FFE66D', delay: 0.4,  duration: 2.5 },
  { id: 17, type: 'bolt',    top: '70%', left: '90%',  size: 22, color: '#FFE66D', delay: 1.6,  duration: 3 },

  // ── SPARKLES ──
  { id: 18, type: 'sparkle', top: '18%', left: '45%',  size: 24, color: '#FF6B6B', delay: 0.8,  duration: 3 },
  { id: 19, type: 'sparkle', top: '78%', left: '50%',  size: 20, color: '#4ECDC4', delay: 2.5,  duration: 4 },
  { id: 20, type: 'sparkle', top: '50%', left: '88%',  size: 18, color: '#FFE66D', delay: 0.2,  duration: 3.5 },

  // ── POP CIRCLES ──
  { id: 21, type: 'pop',     top: '42%', left: '4%',   size: 16, color: '#FF6B6B', delay: 1,    duration: 2 },
  { id: 22, type: 'pop',     top: '90%', left: '60%',  size: 14, color: '#FFE66D', delay: 0,    duration: 2.5 },
  { id: 23, type: 'pop',     top: '6%',  left: '55%',  size: 18, color: '#4ECDC4', delay: 1.4,  duration: 2.2 },
];

/* ── SVG shapes ── */
const Star = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={color} stroke="#1A535C" strokeWidth="1.5" strokeLinejoin="round"
    />
  </svg>
);

const Cloud = ({ size, color }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 80 48">
    <ellipse cx="40" cy="30" rx="35" ry="18" fill={color} stroke="#1A535C" strokeWidth="2.5" />
    <ellipse cx="25" cy="26" rx="18" ry="16" fill={color} stroke="#1A535C" strokeWidth="2.5" />
    <ellipse cx="55" cy="24" rx="16" ry="14" fill={color} stroke="#1A535C" strokeWidth="2.5" />
    <ellipse cx="40" cy="20" rx="20" ry="16" fill={color} stroke="#1A535C" strokeWidth="2.5" />
  </svg>
);

const Heart = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
      fill={color} stroke="#1A535C" strokeWidth="1.5"
    />
  </svg>
);

const Bubble = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2.5" />
    <circle cx="8" cy="8" r="2.5" fill={color} opacity="0.5" />
    <circle cx="15" cy="7" r="1.5" fill={color} opacity="0.3" />
  </svg>
);

const Bolt = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon
      points="13,2 4,14 11,14 11,22 20,10 13,10"
      fill={color} stroke="#1A535C" strokeWidth="1.5" strokeLinejoin="round"
    />
  </svg>
);

const Sparkle = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
      fill={color} stroke="#1A535C" strokeWidth="1.2" />
  </svg>
);

const Pop = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill={color} stroke="#1A535C" strokeWidth="2" />
    <circle cx="9" cy="9" r="2.5" fill="white" opacity="0.6" />
  </svg>
);

const shapeMap = { star: Star, cloud: Cloud, heart: Heart, bubble: Bubble, bolt: Bolt, sparkle: Sparkle, pop: Pop };

const CartoonAnimations = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {elements.map((el) => {
        const Shape = shapeMap[el.type];
        return (
          <motion.div
            key={el.id}
            style={{ position: 'absolute', top: el.top, left: el.left }}
            animate={
              el.type === 'cloud'
                ? { x: [0, 18, 0], y: [0, -8, 0], opacity: [0.5, 0.8, 0.5] }
                : el.type === 'bolt'
                ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6], rotate: [0, 10, -10, 0] }
                : el.type === 'bubble'
                ? { y: [0, -20, 0], scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }
                : el.type === 'heart'
                ? { scale: [1, 1.25, 1], y: [0, -10, 0], opacity: [0.6, 1, 0.6] }
                : el.type === 'sparkle'
                ? { rotate: [0, 180, 360], scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }
                : el.type === 'pop'
                ? { scale: [1, 1.4, 0.8, 1], opacity: [0.7, 1, 0.7] }
                : { y: [0, -15, 0], rotate: [0, 20, -20, 0], opacity: [0.6, 1, 0.6] } // star
            }
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Shape size={el.size} color={el.color} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CartoonAnimations;
