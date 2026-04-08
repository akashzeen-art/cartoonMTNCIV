import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ColoringBook from '../components/ColoringBook';

const ColoringPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)' }}>
      {/* Back button */}
      <div style={{ padding: '20px 30px' }}>
        <motion.button
          whileHover={{ scale: 1.08, x: -4 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'white', color: '#1A535C',
            border: '4px solid #1A535C', borderRadius: '50px',
            padding: '12px 28px', fontWeight: '900',
            fontSize: '1rem', cursor: 'pointer',
            boxShadow: '5px 5px 0px #1A535C', letterSpacing: '1px'
          }}
        >
          <ArrowLeft size={20} strokeWidth={3} />
          RETOUR
        </motion.button>
      </div>

      <ColoringBook />
    </div>
  );
};

export default ColoringPage;
