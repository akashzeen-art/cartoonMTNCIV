import React from 'react';
import { motion } from 'framer-motion';
import { Ghost, Music, Rocket, Heart, Smile, Star } from 'lucide-react';

const CharacterHighlights = () => {
  const characters = [
    { 
      id: 1, 
      name: "Bubbles", 
      icon: <Smile size={60} />, 
      color: "#FF6B6B", 
      bio: "The energetic puppy who loves rainbow bones!" 
    },
    { 
       id: 2, 
       name: "Dino-Mite", 
       icon: <Rocket size={60} />, 
       color: "#4ECDC4", 
       bio: "A tiny dinosaur with big space missions!" 
    },
    { 
       id: 3, 
       name: "Chef Bunny", 
       icon: <Music size={60} />, 
       color: "#FFE66D", 
       bio: "Making the world sweeter, one cake at a time." 
    },
    { 
       id: 4, 
       name: "Galaxy Kitty", 
       icon: <Ghost size={60} />, 
       color: "#E0C3FC", 
       bio: "The cosmic cat who hunts for martian mice!" 
    },
    { 
       id: 5, 
       name: "Super Snail", 
       icon: <Star size={60} />, 
       color: "#FAD7A1", 
       bio: "The fastest shell in the entire cartoon world!" 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <section style={{ padding: '80px 0', background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            style={{ fontSize: '3.5rem', color: '#1A535C', textTransform: 'uppercase', marginBottom: '15px' }}
          >
            Our Cartoon Friends!
          </motion.h2>
          <p style={{ fontSize: '1.3rem', color: '#636E72', maxWidth: '600px', margin: '0 auto' }}>
            Meet the lovable characters that bring joy to Toonland every single day.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '30px' 
          }}
        >
          {characters.map((char) => (
            <motion.div
              key={char.id}
              variants={itemVariants}
              whileHover={{ y: -15 }}
              className="cartoon-card"
              style={{
                background: char.color,
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Glow */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%'
              }} />

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                   background: 'white',
                   width: '120px',
                   height: '120px',
                   borderRadius: '50%',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   border: '4px solid #1A535C',
                   color: '#1A535C',
                   boxShadow: '8px 8px 0px rgba(0,0,0,0.1)'
                }}
              >
                {char.icon}
              </motion.div>

              <div>
                <h3 style={{ fontSize: '1.8rem', color: '#1A535C', fontWeight: '800' }}>{char.name}</h3>
                <p style={{ fontSize: '1rem', color: '#1A535C', opacity: 0.8, fontWeight: '500', lineHeight: '1.3' }}>
                  {char.bio}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  marginTop: '10px',
                  background: 'white',
                  border: '3px solid #1A535C',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  color: '#1A535C',
                  fontSize: '0.9rem'
                }}
              >
                MEET {char.name.toUpperCase()}!
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CharacterHighlights;
