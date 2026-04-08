import React from 'react';
import { motion } from 'framer-motion';

const CartoonMascot = () => {
  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <svg
        viewBox="0 0 200 320"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Shadow */}
        <ellipse cx="100" cy="315" rx="45" ry="8" fill="rgba(26,83,92,0.15)" />

        {/* ── LEGS ── */}
        {/* Left leg */}
        <motion.g
          animate={{ rotate: [0, 12, 0, -12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '75px', originY: '240px' }}
        >
          <rect x="68" y="240" width="22" height="55" rx="11" fill="#FF6B6B" stroke="#1A535C" strokeWidth="3" />
          {/* Shoe */}
          <ellipse cx="79" cy="296" rx="18" ry="10" fill="#1A535C" />
          <ellipse cx="85" cy="294" rx="10" ry="7" fill="#4ECDC4" />
        </motion.g>

        {/* Right leg */}
        <motion.g
          animate={{ rotate: [0, -12, 0, 12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '125px', originY: '240px' }}
        >
          <rect x="110" y="240" width="22" height="55" rx="11" fill="#FF6B6B" stroke="#1A535C" strokeWidth="3" />
          {/* Shoe */}
          <ellipse cx="121" cy="296" rx="18" ry="10" fill="#1A535C" />
          <ellipse cx="127" cy="294" rx="10" ry="7" fill="#4ECDC4" />
        </motion.g>

        {/* ── BODY ── */}
        <rect x="55" y="160" width="90" height="90" rx="30" fill="#FFE66D" stroke="#1A535C" strokeWidth="4" />
        {/* Belly circle */}
        <ellipse cx="100" cy="200" rx="28" ry="32" fill="white" stroke="#1A535C" strokeWidth="2.5" />
        {/* Belly buttons */}
        <circle cx="100" cy="192" r="4" fill="#FF6B6B" />
        <circle cx="100" cy="207" r="4" fill="#4ECDC4" />

        {/* ── LEFT ARM (waving) ── */}
        <motion.g
          animate={{ rotate: [0, -30, 10, -30, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '58px', originY: '175px' }}
        >
          <rect x="20" y="168" width="42" height="20" rx="10" fill="#FFE66D" stroke="#1A535C" strokeWidth="3" />
          {/* Hand */}
          <circle cx="20" cy="178" r="14" fill="#FFE66D" stroke="#1A535C" strokeWidth="3" />
          {/* Fingers */}
          <circle cx="10" cy="168" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
          <circle cx="7" cy="178" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
          <circle cx="10" cy="188" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
        </motion.g>

        {/* ── RIGHT ARM ── */}
        <motion.g
          animate={{ rotate: [0, 20, -5, 20, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '142px', originY: '175px' }}
        >
          <rect x="138" y="168" width="42" height="20" rx="10" fill="#FFE66D" stroke="#1A535C" strokeWidth="3" />
          {/* Hand */}
          <circle cx="180" cy="178" r="14" fill="#FFE66D" stroke="#1A535C" strokeWidth="3" />
          {/* Fingers */}
          <circle cx="190" cy="168" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
          <circle cx="193" cy="178" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
          <circle cx="190" cy="188" r="6" fill="#FFE66D" stroke="#1A535C" strokeWidth="2.5" />
        </motion.g>

        {/* ── HEAD ── */}
        <circle cx="100" cy="110" r="68" fill="#FFE66D" stroke="#1A535C" strokeWidth="5" />

        {/* Rosy cheeks */}
        <ellipse cx="65" cy="128" rx="14" ry="10" fill="#FF6B6B" opacity="0.4" />
        <ellipse cx="135" cy="128" rx="14" ry="10" fill="#FF6B6B" opacity="0.4" />

        {/* ── EYES ── */}
        {/* Left eye white */}
        <ellipse cx="78" cy="105" rx="18" ry="20" fill="white" stroke="#1A535C" strokeWidth="3" />
        {/* Right eye white */}
        <ellipse cx="122" cy="105" rx="18" ry="20" fill="white" stroke="#1A535C" strokeWidth="3" />

        {/* Left pupil */}
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          style={{ originX: '78px', originY: '108px' }}
        >
          <circle cx="78" cy="108" r="10" fill="#1A535C" />
          <circle cx="82" cy="104" r="4" fill="white" />
          <circle cx="75" cy="112" r="2" fill="white" />
        </motion.g>

        {/* Right pupil */}
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          style={{ originX: '122px', originY: '108px' }}
        >
          <circle cx="122" cy="108" r="10" fill="#1A535C" />
          <circle cx="126" cy="104" r="4" fill="white" />
          <circle cx="119" cy="112" r="2" fill="white" />
        </motion.g>

        {/* Eye shine dots */}
        <circle cx="70" cy="98" r="4" fill="white" opacity="0.6" />
        <circle cx="114" cy="98" r="4" fill="white" opacity="0.6" />

        {/* ── MOUTH (smile) ── */}
        <path d="M 82 135 Q 100 155 118 135" stroke="#1A535C" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Teeth */}
        <path d="M 88 137 Q 100 150 112 137" fill="white" />
        <line x1="100" y1="137" x2="100" y2="149" stroke="#1A535C" strokeWidth="2" />

        {/* ── HAT ── */}
        {/* Hat brim */}
        <ellipse cx="100" cy="48" rx="52" ry="12" fill="#4ECDC4" stroke="#1A535C" strokeWidth="3" />
        {/* Hat body */}
        <rect x="68" y="4" width="64" height="48" rx="10" fill="#4ECDC4" stroke="#1A535C" strokeWidth="3" />
        {/* Hat band */}
        <rect x="68" y="36" width="64" height="14" rx="4" fill="#FF6B6B" stroke="#1A535C" strokeWidth="2" />
        {/* Star on hat */}
        <motion.text
          x="88" y="28"
          fontSize="22"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ originX: '100px', originY: '20px' }}
        >
          ⭐
        </motion.text>

        {/* ── SPARKLES around character ── */}
        <motion.text
          x="155" y="90"
          fontSize="20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ originX: '165px', originY: '80px' }}
        >
          ✨
        </motion.text>
        <motion.text
          x="20" y="140"
          fontSize="16"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          style={{ originX: '28px', originY: '132px' }}
        >
          ⭐
        </motion.text>
        <motion.text
          x="160" y="200"
          fontSize="18"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
          style={{ originX: '169px', originY: '191px' }}
        >
          💫
        </motion.text>
      </svg>
    </motion.div>
  );
};

export default CartoonMascot;
