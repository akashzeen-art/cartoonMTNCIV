import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Undo2, Redo2, RotateCcw, Eraser, Download, Palette } from 'lucide-react';

/* ── Cartoon outline images (public domain SVG as data URLs) ────── */
const IMAGES = [
  {
    id: 1, name: 'Étoile Joyeuse',
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'>
      <rect width='200' height='200' fill='white'/>
      <polygon points='100,15 120,70 180,70 132,105 150,160 100,125 50,160 68,105 20,70 80,70'
        fill='white' stroke='black' stroke-width='5' stroke-linejoin='round'/>
      <circle cx='85' cy='85' r='6' fill='black'/>
      <circle cx='115' cy='85' r='6' fill='black'/>
      <path d='M82,105 Q100,120 118,105' fill='none' stroke='black' stroke-width='4' stroke-linecap='round'/>
    </svg>`,
  },
  {
    id: 2, name: 'Petit Chat Mignon',
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'>
      <rect width='200' height='200' fill='white'/>
      <ellipse cx='100' cy='120' rx='55' ry='50' fill='white' stroke='black' stroke-width='5'/>
      <circle cx='100' cy='108' r='38' fill='white' stroke='black' stroke-width='5'/>
      <polygon points='65,80 55,45 85,75' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <polygon points='135,80 145,45 115,75' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <circle cx='88' cy='105' r='6' fill='black'/>
      <circle cx='112' cy='105' r='6' fill='black'/>
      <ellipse cx='100' cy='117' rx='5' ry='4' fill='black'/>
      <line x1='70' y1='112' x2='50' y2='108' stroke='black' stroke-width='3'/>
      <line x1='70' y1='117' x2='48' y2='117' stroke='black' stroke-width='3'/>
      <line x1='70' y1='122' x2='50' y2='126' stroke='black' stroke-width='3'/>
      <line x1='130' y1='112' x2='150' y2='108' stroke='black' stroke-width='3'/>
      <line x1='130' y1='117' x2='152' y2='117' stroke='black' stroke-width='3'/>
      <line x1='130' y1='122' x2='150' y2='126' stroke='black' stroke-width='3'/>
      <path d='M100,125 Q85,145 80,160 Q100,155 120,160 Q115,145 100,125Z' fill='white' stroke='black' stroke-width='4'/>
    </svg>`,
  },
  {
    id: 3, name: 'Fusée Spatiale',
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'>
      <rect width='200' height='200' fill='white'/>
      <ellipse cx='100' cy='75' rx='28' ry='45' fill='white' stroke='black' stroke-width='5'/>
      <rect x='72' y='100' width='56' height='55' rx='6' fill='white' stroke='black' stroke-width='5'/>
      <ellipse cx='100' cy='100' rx='18' ry='18' fill='white' stroke='black' stroke-width='4'/>
      <polygon points='72,120 50,145 72,155' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <polygon points='128,120 150,145 128,155' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <ellipse cx='100' cy='158' rx='20' ry='10' fill='white' stroke='black' stroke-width='4'/>
      <path d='M88,165 Q95,180 100,185 Q105,180 112,165' fill='white' stroke='black' stroke-width='4' stroke-linecap='round'/>
      <circle cx='100' cy='100' r='8' fill='white' stroke='black' stroke-width='3'/>
    </svg>`,
  },
  {
    id: 4, name: 'Bébé Dino',
    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'>
      <rect width='200' height='200' fill='white'/>
      <ellipse cx='100' cy='130' rx='50' ry='40' fill='white' stroke='black' stroke-width='5'/>
      <ellipse cx='75' cy='100' rx='30' ry='28' fill='white' stroke='black' stroke-width='5'/>
      <path d='M60,85 Q65,60 75,55 Q80,65 85,72' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <path d='M75,55 Q85,50 92,58 Q88,68 85,72' fill='white' stroke='black' stroke-width='4' stroke-linejoin='round'/>
      <circle cx='68' cy='98' r='5' fill='black'/>
      <path d='M60,112 Q68,120 78,112' fill='none' stroke='black' stroke-width='3' stroke-linecap='round'/>
      <rect x='70' y='165' width='16' height='22' rx='5' fill='white' stroke='black' stroke-width='4'/>
      <rect x='114' y='165' width='16' height='22' rx='5' fill='white' stroke='black' stroke-width='4'/>
      <path d='M140,115 Q160,100 155,125 Q145,120 140,130Z' fill='white' stroke='black' stroke-width='4'/>
      <circle cx='130' cy='108' r='4' fill='black'/>
      <circle cx='138' cy='100' r='4' fill='black'/>
      <circle cx='148' cy='98' r='4' fill='black'/>
    </svg>`,
  },
];

/* ── Colors ─────────────────────────────────────────────────────── */
const COLORS = [
  '#FF6B6B','#FF9F43','#FFE66D','#A8E6CF','#4ECDC4','#45B7D1',
  '#96CEB4','#FFEAA7','#DDA0DD','#F0A500','#FF85A1','#74B9FF',
  '#FD79A8','#55EFC4','#FDCB6E','#E17055','#6C5CE7','#00B894',
  '#2D3436','#636E72','#B2BEC3','#FFFFFF',
];

/* ── Flood fill ──────────────────────────────────────────────────── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function floodFill(ctx, startX, startY, fillColor, tolerance = 30) {
  const canvas  = ctx.canvas;
  const w = canvas.width, h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data    = imgData.data;
  const [fr,fg,fb] = hexToRgb(fillColor);

  const idx = (x, y) => (y * w + x) * 4;
  const si  = idx(startX, startY);
  const [sr,sg,sb,sa] = [data[si],data[si+1],data[si+2],data[si+3]];

  // Don't fill if clicking on a dark outline
  if (sr < 80 && sg < 80 && sb < 80) return false;
  // Already same color
  if (Math.abs(sr-fr)<5 && Math.abs(sg-fg)<5 && Math.abs(sb-fb)<5) return false;

  const match = (i) => {
    return Math.abs(data[i]-sr) <= tolerance &&
           Math.abs(data[i+1]-sg) <= tolerance &&
           Math.abs(data[i+2]-sb) <= tolerance &&
           Math.abs(data[i+3]-sa) <= tolerance;
  };

  const stack = [[startX, startY]];
  const visited = new Uint8Array(w * h);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = idx(x, y);
    const vi = y * w + x;
    if (visited[vi]) continue;
    if (!match(i)) continue;
    visited[vi] = 1;
    data[i]   = fr;
    data[i+1] = fg;
    data[i+2] = fb;
    data[i+3] = 255;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  ctx.putImageData(imgData, 0, 0);
  return true;
}

/* ── Canvas Editor ───────────────────────────────────────────────── */
const CanvasEditor = ({ image, onClose }) => {
  const canvasRef  = useRef(null);
  const [color,    setColor]    = useState('#FFE66D');
  const [eraser,   setEraser]   = useState(false);
  const [history,  setHistory]  = useState([]);
  const [future,   setFuture]   = useState([]);
  const [filling,  setFilling]  = useState(false);
  const imgRef = useRef(null);

  // Load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const img    = new Image();
    img.onload = () => {
      imgRef.current = img;
      canvas.width  = img.width  || 400;
      canvas.height = img.height || 400;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      setFuture([]);
    };
    img.src = image.src;
  }, [image]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const snap   = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(h => [...h, snap]);
    setFuture([]);
  }, []);

  const handleClick = useCallback((e) => {
    if (filling) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top)  * scaleY);

    setFilling(true);
    saveState();
    const fillCol = eraser ? '#FFFFFF' : color;
    floodFill(ctx, x, y, fillCol);
    setFilling(false);
  }, [color, eraser, filling, saveState]);

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const prev   = history[history.length - 2];
    setFuture(f => [history[history.length-1], ...f]);
    setHistory(h => h.slice(0, -1));
    ctx.putImageData(prev, 0, 0);
  };

  const redo = () => {
    if (!future.length) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.putImageData(future[0], 0, 0);
    setHistory(h => [...h, future[0]]);
    setFuture(f => f.slice(1));
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      setHistory([ctx.getImageData(0,0,canvas.width,canvas.height)]);
      setFuture([]);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    const link   = document.createElement('a');
    link.download = `${image.name}.png`;
    link.href     = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(26,83,92,0.88)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'
      }}
    >
      <motion.div
        initial={{ scale:0.7, rotate:-5 }}
        animate={{ scale:1, rotate:0 }}
        exit={{ scale:0.7 }}
        transition={{ type:'spring', stiffness:280, damping:22 }}
        onClick={e => e.stopPropagation()}
        style={{
          background:'#FFF9F0', border:'6px solid #1A535C',
          borderRadius:'24px', boxShadow:'16px 16px 0px #FFE66D',
          width:'100%', maxWidth:'720px', overflow:'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background:'#FFE66D', borderBottom:'4px solid #1A535C',
          padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'
        }}>
          <span style={{ fontWeight:'950', fontSize:'1.2rem', color:'#1A535C' }}>
            🎨 Coloriage : {image.name}
          </span>
          <button onClick={onClose} style={{
            background:'#FF6B6B', border:'3px solid #1A535C', borderRadius:'50%',
            width:'38px', height:'38px', cursor:'pointer', color:'white',
            fontWeight:'900', fontSize:'1rem', boxShadow:'3px 3px 0px #1A535C',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display:'flex', gap:0, flexWrap:'wrap' }}>
          {/* Canvas */}
          <div style={{ flex:1, minWidth:'260px', padding:'16px', display:'flex', justifyContent:'center' }}>
            <canvas
              ref={canvasRef}
              onClick={handleClick}
              style={{
                border:'4px solid #1A535C', borderRadius:'16px',
                cursor: eraser ? 'cell' : 'crosshair',
                maxWidth:'100%', maxHeight:'380px',
                boxShadow:'6px 6px 0px #1A535C',
                background:'white'
              }}
            />
          </div>

          {/* Sidebar */}
          <div style={{
            width:'160px', minWidth:'140px', padding:'16px',
            borderLeft:'4px solid #1A535C', background:'rgba(255,255,255,0.6)',
            display:'flex', flexDirection:'column', gap:'14px'
          }}>
            {/* Color palette */}
            <div>
              <div style={{ fontWeight:'900', color:'#1A535C', fontSize:'0.85rem', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px' }}>
                <Palette size={14} /> COULEURS
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'5px' }}>
                {COLORS.map(c => (
                  <motion.button
                    key={c}
                    whileHover={{ scale:1.2 }}
                    whileTap={{ scale:0.9 }}
                    onClick={() => { setColor(c); setEraser(false); }}
                    style={{
                      width:'28px', height:'28px', borderRadius:'50%',
                      background:c, cursor:'pointer',
                      border: color===c && !eraser ? '3px solid #1A535C' : '2px solid rgba(0,0,0,0.15)',
                      boxShadow: color===c && !eraser ? '0 0 0 2px #FFE66D' : 'none',
                      transition:'all 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <div style={{ fontWeight:'900', color:'#1A535C', fontSize:'0.85rem', marginBottom:'8px' }}>OUTILS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[
                  { icon:<Undo2 size={16}/>,    label:'Annuler',       action:undo,  disabled:history.length<=1 },
                  { icon:<Redo2 size={16}/>,    label:'Refaire',       action:redo,  disabled:!future.length },
                  { icon:<RotateCcw size={16}/>, label:'Réinitialiser', action:reset, disabled:false },
                ].map(btn => (
                  <motion.button
                    key={btn.label}
                    whileHover={!btn.disabled ? { scale:1.04, x:2 } : {}}
                    whileTap={!btn.disabled ? { scale:0.96 } : {}}
                    onClick={btn.action}
                    disabled={btn.disabled}
                    style={{
                      display:'flex', alignItems:'center', gap:'8px',
                      background: btn.disabled ? '#eee' : 'white',
                      border:'3px solid #1A535C', borderRadius:'10px',
                      padding:'7px 10px', fontWeight:'800', fontSize:'0.8rem',
                      color: btn.disabled ? '#aaa' : '#1A535C',
                      cursor: btn.disabled ? 'not-allowed' : 'pointer',
                      boxShadow: btn.disabled ? 'none' : '3px 3px 0px #1A535C'
                    }}
                  >
                    {btn.icon} {btn.label}
                  </motion.button>
                ))}

                {/* Eraser */}
                <motion.button
                  whileHover={{ scale:1.04, x:2 }}
                  whileTap={{ scale:0.96 }}
                  onClick={() => setEraser(e => !e)}
                  style={{
                    display:'flex', alignItems:'center', gap:'8px',
                    background: eraser ? '#FF6B6B' : 'white',
                    border:'3px solid #1A535C', borderRadius:'10px',
                    padding:'7px 10px', fontWeight:'800', fontSize:'0.8rem',
                    color: eraser ? 'white' : '#1A535C',
                    cursor:'pointer', boxShadow:'3px 3px 0px #1A535C'
                  }}
                >
                  <Eraser size={16} /> Gomme
                </motion.button>
              </div>
            </div>

            {/* Active color preview */}
            <div style={{ textAlign:'center' }}>
              <div style={{ fontWeight:'900', color:'#1A535C', fontSize:'0.8rem', marginBottom:'6px' }}>
                {eraser ? 'GOMME ACTIVE' : 'COULEUR ACTIVE'}
              </div>
              <div style={{
                width:'44px', height:'44px', borderRadius:'50%', margin:'0 auto',
                background: eraser ? 'white' : color,
                border:'4px solid #1A535C', boxShadow:'3px 3px 0px #1A535C'
              }} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Image Grid ──────────────────────────────────────────────────── */
const ColoringBook = () => {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section style={{
        padding:'80px 0',
        background:'rgba(255,255,255,0.25)',
        backdropFilter:'blur(8px)',
        WebkitBackdropFilter:'blur(8px)',
        borderTop:'6px solid #1A535C'
      }}>
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ y:-20, opacity:0 }}
            whileInView={{ y:0, opacity:1 }}
            style={{ textAlign:'center', marginBottom:'48px' }}
          >
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'10px',
              background:'#FF6B6B', padding:'10px 28px',
              borderRadius:'50px', border:'4px solid #1A535C',
              boxShadow:'5px 5px 0px #1A535C', marginBottom:'20px'
            }}>
              <span style={{ fontWeight:'900', color:'white', fontSize:'1rem', letterSpacing:'2px' }}>
                🎨 STUDIO COLORIAGE
              </span>
            </div>
            <h2 style={{
              fontSize:'3rem', color:'#1A535C', fontWeight:'950',
              textShadow:'4px 4px 0px #FFE66D', lineHeight:1
            }}>
              COLORIE TON DESSIN <br/>ANIMÉ !
            </h2>
            <p style={{ color:'#1A535C', fontWeight:'600', fontSize:'1.1rem', marginTop:'12px', opacity:0.8 }}>
              Choisis une image et colorie-la avec tes couleurs préférées ! 🖌️
            </p>
          </motion.div>

          {/* Grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
            gap:'28px'
          }}>
            {IMAGES.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity:0, y:30 }}
                whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y:-8, boxShadow:'12px 12px 0px #1A535C' }}
                onClick={() => setSelected(img)}
                className="cartoon-card"
                style={{
                  cursor:'pointer', overflow:'hidden',
                  border:'5px solid #1A535C', boxShadow:'8px 8px 0px #1A535C',
                  background:'white'
                }}
              >
                <div style={{
                  background:'#F7FFF7', padding:'20px',
                  display:'flex', justifyContent:'center', alignItems:'center',
                  minHeight:'180px'
                }}>
                  <img
                    src={img.src} alt={img.name}
                    style={{ width:'140px', height:'140px', objectFit:'contain' }}
                  />
                </div>
                <div style={{
                  background:'#FFE66D', borderTop:'4px solid #1A535C',
                  padding:'12px', textAlign:'center'
                }}>
                  <span style={{ fontWeight:'900', fontSize:'1rem', color:'#1A535C' }}>
                    {img.name}
                  </span>
                  <div style={{ fontSize:'0.8rem', color:'#1A535C', opacity:0.7, fontWeight:'600', marginTop:'4px' }}>
                    Clique pour colorier ! 🎨
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editor Modal */}
      <AnimatePresence>
        {selected && (
          <CanvasEditor image={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ColoringBook;
