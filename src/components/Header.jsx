import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { accountQuery } = useSubscription();

  const navLinks = [
    { name: 'ACCUEIL', color: '#FF6B6B', href: '#home'   },
    { name: 'VIDÉOS',  color: '#4ECDC4', href: '#videos' },
    { name: 'JEUX',    color: '#FFE66D', href: '#games'  },
    { name: 'À PROPOS',color: '#FF6B6B', href: '#about'  },
  ];

  const handleNav = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    // Delay scroll until mobile menu finishes closing
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  return (
    <header style={{
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(247, 255, 247, 0.95)',
      backdropFilter: 'blur(5px)',
      borderBottom: '4px solid #1A535C'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="/logo/anime.png"
            alt="Animes Enfants"
            style={{ height: '58px', width: 'auto', display: 'block' }}
          />
        </motion.div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '25px', fontWeight: '600', alignItems: 'center' }} className="hide-mobile">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              whileHover={{ scale: 1.1, color: link.color }}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              style={{ fontSize: '1rem', color: '#1A535C' }}
            >
              {link.name}
            </motion.a>
          ))}
          <Link
            to={`/account${accountQuery}`}
            style={{
              fontSize: '1rem',
              color: '#1A535C',
              fontWeight: '700',
              padding: '6px 14px',
              borderRadius: '12px',
              border: '3px solid #1A535C',
              background: '#FFE66D',
              textDecoration: 'none',
            }}
          >
            MON COMPTE
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="show-mobile flex-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: '#FF6B6B',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '3px solid #1A535C'
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              background: '#F7FFF7',
              borderTop: '4px solid #1A535C',
              marginTop: '15px'
            }}
            className="show-mobile"
          >
            <div className="container" style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: '700', 
                      color: '#1A535C',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'white',
                      border: '3px solid #1A535C',
                      textAlign: 'center'
                    }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <Link
                  to={`/account${accountQuery}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#1A535C',
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#FFE66D',
                    border: '3px solid #1A535C',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  MON COMPTE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .hide-mobile { display: flex; }
        .show-mobile { display: none; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
