import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/* ════════════════════════════════════════════════════════════
   GAME 1 — Pokémon Catch
   • Pokémon pop up at random spots every 1.2s
   • Each has 2.5s to be clicked before it escapes
   • Miss costs 1 life (3 lives total)
   • 30-second countdown
   • Lose when lives = 0 or time runs out
════════════════════════════════════════════════════════════ */
const MONS = ['🐱','🦆','🐸','🐭','🦊','🐼','🐧','🐻','🦁','🐯','🐨','🦄'];
const MON_LIFETIME = 2500; // ms each Pokémon stays

const PokemonCatch = () => {
  const [score,    setScore]    = useState(0);
  const [lives,    setLives]    = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets,  setTargets]  = useState([]);   // { id, x, y, emoji, born }
  const [gameOver, setGameOver] = useState(false);
  const [started,  setStarted]  = useState(false);
  const [flash,    setFlash]    = useState(null);  // '+1' or '💨'

  const nextId   = useRef(0);
  const livesRef = useRef(3);
  const overRef  = useRef(false);
  const aliveIds = useRef(new Set()); // track which IDs are still on screen

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft <= 0) { overRef.current = true; setGameOver(true); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, gameOver, timeLeft]);

  // Spawn Pokémon
  useEffect(() => {
    if (!started || gameOver) return;
    const s = setInterval(() => {
      if (overRef.current) return;
      const id = nextId.current++;
      aliveIds.current.add(id);
      setTargets(p => [...p, {
        id,
        x:     Math.random() * 72 + 8,
        y:     Math.random() * 55 + 18,
        emoji: MONS[Math.floor(Math.random() * MONS.length)],
        born:  Date.now(),
      }]);

      // Auto-expire after MON_LIFETIME
      setTimeout(() => {
        if (overRef.current) return;
        if (!aliveIds.current.has(id)) return; // already caught — no life lost
        aliveIds.current.delete(id);
        setTargets(prev => prev.filter(t => t.id !== id));
        // deduct exactly 1 life, outside state updater
        livesRef.current -= 1;
        setLives(livesRef.current);
        setFlash('💨');
        setTimeout(() => setFlash(null), 600);
        if (livesRef.current <= 0) {
          overRef.current = true;
          setGameOver(true);
        }
      }, MON_LIFETIME);
    }, 1200);
    return () => clearInterval(s);
  }, [started, gameOver]);

  const catchIt = id => {
    if (!aliveIds.current.has(id)) return; // already expired
    aliveIds.current.delete(id);
    setTargets(p => p.filter(t => t.id !== id));
    setScore(s => s + 1);
    setFlash('+1');
    setTimeout(() => setFlash(null), 500);
  };

  const restart = () => {
    overRef.current  = false;
    livesRef.current = 3;
    nextId.current   = 0;
    aliveIds.current.clear();
    setScore(0); setLives(3); setTimeLeft(30);
    setTargets([]); setGameOver(false); setStarted(false); setFlash(null);
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'320px',
      background:'linear-gradient(160deg,#C8E6C9 0%,#B3E5FC 100%)',
      border:'4px solid #1A535C', borderRadius:'16px', overflow:'hidden' }}>

      {/* HUD */}
      <div style={{ position:'absolute', top:10, left:10, right:10,
        display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 }}>
        <div style={{ background:'#FFE66D', border:'3px solid #1A535C',
          borderRadius:'20px', padding:'4px 14px', fontWeight:'900', color:'#1A535C', fontSize:'1rem' }}>
          ⭐ {score}
        </div>
        {/* Lives */}
        <div style={{ display:'flex', gap:'4px' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ fontSize:'1.4rem', opacity: i < lives ? 1 : 0.25 }}>❤️</span>
          ))}
        </div>
        <div style={{ background:'#FF6B6B', border:'3px solid #1A535C',
          borderRadius:'20px', padding:'4px 14px', fontWeight:'900', color:'white', fontSize:'1rem' }}>
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* Flash feedback */}
      <AnimatePresence>
        {flash && (
          <motion.div key={flash + Date.now()}
            initial={{ opacity:1, y:0, scale:1 }}
            animate={{ opacity:0, y:-40, scale:1.5 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            style={{ position:'absolute', top:'40%', left:'50%',
              transform:'translateX(-50%)', fontSize:'2rem',
              fontWeight:'900', color: flash==='+1' ? '#1A535C' : '#FF6B6B',
              pointerEvents:'none', zIndex:20 }}>
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Targets */}
      <AnimatePresence>
        {targets.map(t => (
          <motion.button key={t.id}
            initial={{ scale:0, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:0, opacity:0 }}
            transition={{ duration:0.2 }}
            onClick={() => catchIt(t.id)}
            style={{ position:'absolute', left:`${t.x}%`, top:`${t.y}%`,
              background:'white', border:'4px solid #1A535C', borderRadius:'50%',
              width:'54px', height:'54px', fontSize:'1.9rem', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'3px 3px 0px #1A535C',
              transform:'translate(-50%,-50%)', zIndex:5 }}>
            {t.emoji}
            {/* Countdown ring overlay */}
            <div style={{
              position:'absolute', inset:0, borderRadius:'50%',
              border:'4px solid #FF6B6B',
              animation:`shrink ${MON_LIFETIME}ms linear forwards`,
            }}/>
          </motion.button>
        ))}
      </AnimatePresence>

      <style>{`
        @keyframes shrink {
          from { opacity: 1; transform: scale(1.35); }
          to   { opacity: 0; transform: scale(0.6); }
        }
      `}</style>

      {/* Start */}
      {!started && !gameOver && (
        <div style={{ position:'absolute', inset:0, background:'rgba(26,83,92,0.9)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:'14px', zIndex:15 }}>
          <div style={{ fontSize:'3rem' }}>🎯</div>
          <div style={{ fontSize:'1.6rem', fontWeight:'950', color:'#FFE66D' }}>ATTRAPE LES POKÉMON !</div>
          <p style={{ color:'white', fontWeight:'600', textAlign:'center',
            maxWidth:'260px', lineHeight:'1.4', fontSize:'0.95rem' }}>
            Clique sur les Pokémon avant qu'ils s'échappent !<br/>
            Chaque raté coûte un ❤️. Tu as 3 vies & 30 secondes.
          </p>
          <button onClick={() => setStarted(true)}
            style={{ background:'#FF6B6B', color:'white', border:'4px solid #FFE66D',
              borderRadius:'50px', padding:'12px 32px', fontWeight:'900',
              fontSize:'1.1rem', cursor:'pointer', boxShadow:'4px 4px 0px rgba(0,0,0,0.3)' }}>
            DÉMARRER ! 🚀
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div style={{ position:'absolute', inset:0, background:'rgba(26,83,92,0.93)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:'14px', zIndex:15 }}>
          <div style={{ fontSize:'2.2rem', fontWeight:'950', color:'#FFE66D' }}>
            {lives <= 0 ? 'PLUS DE VIES ! 💔' : "TEMPS ÉCOULÉ ! ⏰"}
          </div>
          <div style={{ color:'white', fontWeight:'700', fontSize:'1.2rem' }}>
            Tu as attrapé <span style={{color:'#FFE66D'}}>{score}</span> Pokémon !
          </div>
          <button onClick={restart}
            style={{ background:'#FF6B6B', color:'white', border:'4px solid white',
              borderRadius:'50px', padding:'10px 28px', fontWeight:'900',
              fontSize:'1rem', cursor:'pointer' }}>
            REJOUER !
          </button>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   GAME 2 — Tom & Jerry Runner
   • Jerry runs automatically (endless runner)
   • Tap JUMP button / Space / ArrowUp to jump over Tom & obstacles
   • Obstacles come from the right at increasing speed
   • 3 lives — hit an obstacle = lose 1 life
   • Score increases every second survived
════════════════════════════════════════════════════════════ */
const JERRY_X    = 18;         // Jerry's fixed left% position
const JUMP_VEL   = 18;         // initial jump velocity (px per frame)
const GRAVITY    = 1.5;        // gravity per frame
const OBS_W      = 28;         // collision width (smaller = more forgiving)
const JERRY_W    = 22;         // Jerry collision width (smaller = more forgiving)

const TomJerryChase = () => {
  const [jerryY,   setJerryY]   = useState(0);       // px off ground
  const [obstacles,setObstacles]= useState([]);       // [{id, x, emoji}]
  const [score,    setScore]    = useState(0);
  const [lives,    setLives]    = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started,  setStarted]  = useState(false);
  const [flash,    setFlash]    = useState(false);    // hit flash

  const jerryYRef  = useRef(0);
  const velYRef    = useRef(0);
  const onGroundRef= useRef(true);
  const livesRef   = useRef(3);
  const overRef    = useRef(false);
  const obsRef     = useRef([]);          // mirror of obstacles for loop
  const nextObsId  = useRef(0);
  const gameSpeedRef = useRef(3);         // px per frame obstacle speed
  const containerRef = useRef(null);

  const jump = () => {
    if (!started || gameOver) return;
    if (!onGroundRef.current) return;     // no double jump
    velYRef.current   = JUMP_VEL;
    onGroundRef.current = false;
  };

  // Keyboard jump
  useEffect(() => {
    if (!started) return;
    const onKey = e => {
      if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, gameOver]);

  // Main game loop — RAF
  useEffect(() => {
    if (!started || gameOver) return;
    let rafId;
    let lastSpawn   = 0;
    let frameCount  = 0;
    const containerW = containerRef.current?.offsetWidth || 560;

    const loop = (ts) => {
      if (overRef.current) return;
      rafId = requestAnimationFrame(loop);
      frameCount++;

      // ── Jerry physics ──
      let y   = jerryYRef.current;
      let vel = velYRef.current;
      if (!onGroundRef.current) {
        vel -= GRAVITY;
        y   = Math.max(0, y + vel);
        if (y <= 0) { y = 0; vel = 0; onGroundRef.current = true; }
      }
      jerryYRef.current  = y;
      velYRef.current    = vel;
      setJerryY(y);

      // ── Score every 60 frames (~1s) ──
      if (frameCount % 60 === 0) {
        setScore(s => s + 1);
        // Speed ramp
        gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.15, 9);
      }

      // ── Spawn obstacle ──
      const minGap = Math.max(180, 400 - frameCount * 0.3);
      if (ts - lastSpawn > minGap * (10 / gameSpeedRef.current)) {
        lastSpawn = ts;
        const emojis = ['🐱','🪑','🧺','🍖','🪣'];
        const id = nextObsId.current++;
        const newObs = { id, x: containerW + 10,
          emoji: emojis[Math.floor(Math.random() * emojis.length)] };
        obsRef.current = [...obsRef.current, newObs];
      }

      // ── Move obstacles + collision ──
      const speed = gameSpeedRef.current;
      obsRef.current = obsRef.current
        .map(o => ({ ...o, x: o.x - speed }))
        .filter(o => o.x > -60);

      // Collision: Jerry is at left% ≈ JERRY_X% of containerW
      const jerryPxX = (JERRY_X / 100) * containerW;
      let hit = false;
      obsRef.current.forEach(o => {
        // Only check when obstacle overlaps Jerry horizontally
        const overlap = o.x < jerryPxX + JERRY_W - 4 && o.x + OBS_W > jerryPxX + 4;
        // Jerry is safe if y > 20 (jump clears sooner)
        if (overlap && jerryYRef.current < 20) hit = true;
      });

      if (hit) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        // Push obstacles past Jerry so no double-hit
        obsRef.current = obsRef.current.map(o => {
          const jerryPxX2 = (JERRY_X / 100) * containerW;
          if (o.x < jerryPxX2 + JERRY_W && o.x + OBS_W > jerryPxX2) {
            return { ...o, x: jerryPxX2 - OBS_W - 10 };
          }
          return o;
        });
        if (livesRef.current <= 0) {
          overRef.current = true;
          setGameOver(true);
          return;
        }
      }

      setObstacles([...obsRef.current]);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [started, gameOver]);

  const restart = () => {
    overRef.current    = false;
    livesRef.current   = 3;
    jerryYRef.current  = 0;
    velYRef.current    = 0;
    onGroundRef.current= true;
    obsRef.current     = [];
    gameSpeedRef.current = 3;
    nextObsId.current  = 0;
    setJerryY(0); setObstacles([]); setScore(0);
    setLives(3); setGameOver(false); setStarted(false); setFlash(false);
  };

  const speedStage = gameSpeedRef.current < 5 ? '🐢 LENT' : gameSpeedRef.current < 7 ? '😅 RAPIDE' : '🔥 DANGER !';

  return (
    <div>
      {/* Game canvas */}
      <div
        ref={containerRef}
        onClick={jump}
        style={{ position:'relative', width:'100%', height:'200px',
          background:'linear-gradient(180deg,#87CEEB 0%,#FFF9C4 70%,#FFF9C4 100%)',
          border:'4px solid #1A535C', borderRadius:'16px', overflow:'hidden',
          marginBottom:'14px', cursor:'pointer', userSelect:'none' }}>

        {/* HUD */}
        <div style={{ position:'absolute', top:8, left:10, right:10,
          display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 }}>
          <div style={{ background:'#FFE66D', border:'3px solid #1A535C',
            borderRadius:'20px', padding:'3px 12px', fontWeight:'900', color:'#1A535C', fontSize:'0.9rem' }}>
            ⭐ {score}
          </div>
          <div style={{ display:'flex', gap:'3px' }}>
            {[0,1,2].map(i=>(
              <span key={i} style={{fontSize:'1.1rem', opacity: i < lives ? 1 : 0.2}}>❤️</span>
            ))}
          </div>
          {started && !gameOver && (
            <div style={{ background: gameSpeedRef.current < 5 ? '#4ECDC4' : gameSpeedRef.current < 7 ? '#FF9800' : '#FF6B6B',
              border:'3px solid #1A535C', borderRadius:'20px',
              padding:'3px 10px', fontWeight:'900', color:'white', fontSize:'0.8rem' }}>
              {speedStage}
            </div>
          )}
        </div>

        {/* Ground */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'44px',
          background:'#795548', borderTop:'4px solid #1A535C' }}>
          {[5,15,25,35,45,55,65,75,85,95].map(p=>(
            <div key={p} style={{ position:'absolute', left:`${p}%`, top:'12px',
              width:'7px', height:'7px', background:'#6D4C41', borderRadius:'50%' }}/>
          ))}
        </div>

        {/* Obstacles */}
        {obstacles.map(o => (
          <div key={o.id} style={{
            position:'absolute', bottom:'44px',
            left: `${o.x}px`,
            fontSize:'2.2rem', lineHeight:1,
            userSelect:'none', pointerEvents:'none'
          }}>
            {o.emoji}
          </div>
        ))}

        {/* Jerry */}
        <div style={{
          position:'absolute',
          bottom: `${44 + jerryY}px`,
          left:`${JERRY_X}%`,
          fontSize:'2rem', lineHeight:1,
          userSelect:'none', pointerEvents:'none',
          filter: flash ? 'drop-shadow(0 0 12px #FF6B6B) brightness(2)' : 'none',
          transition: 'filter 0.1s',
          transform: jerryY > 5 ? 'scaleX(-1)' : 'none'  // flip while jumping (running effect)
        }}>
          🐭
        </div>

        {/* Clouds */}
        <div style={{position:'absolute',top:'15%',left:'20%',fontSize:'2rem',opacity:0.6,pointerEvents:'none'}}>☁️</div>
        <div style={{position:'absolute',top:'10%',left:'60%',fontSize:'1.4rem',opacity:0.5,pointerEvents:'none'}}>☁️</div>

        {/* Start overlay */}
        {!started && !gameOver && (
          <div style={{ position:'absolute', inset:0, background:'rgba(26,83,92,0.9)',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:'10px', zIndex:15 }}>
            <div style={{ fontSize:'2rem', fontWeight:'950', color:'#FFE66D' }}>
              🐭 TOM & JERRY COUREUR !
            </div>
            <p style={{ color:'white', fontWeight:'600', textAlign:'center',
              maxWidth:'260px', fontSize:'0.9rem', lineHeight:'1.5' }}>
              Touche l'écran ou appuie sur <b style={{color:'#FFE66D'}}>ESPACE / ↑</b> pour sauter !<br/>
              Évite Tom et les obstacles. 3 vies !
            </p>
            <button onClick={e => { e.stopPropagation(); setStarted(true); }}
              style={{ background:'#FF6B6B', color:'white', border:'4px solid #FFE66D',
                borderRadius:'50px', padding:'10px 28px', fontWeight:'900',
                fontSize:'1rem', cursor:'pointer' }}>
              COURS ! 🏃
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div style={{ position:'absolute', inset:0, background:'rgba(26,83,92,0.93)',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:'10px', zIndex:15 }}>
            <div style={{ fontSize:'1.8rem', fontWeight:'950', color:'#FF6B6B' }}>
              TOM A ATTRAPÉ JERRY ! 😱
            </div>
            <div style={{ color:'white', fontWeight:'700' }}>
              Score : <span style={{color:'#FFE66D'}}>{score}</span> points !
            </div>
            <button onClick={restart}
              style={{ background:'#FFE66D', color:'#1A535C', border:'4px solid white',
                borderRadius:'50px', padding:'8px 24px', fontWeight:'900', cursor:'pointer' }}>
              TRY AGAIN!
            </button>
          </div>
        )}
      </div>

      {/* Jump button for mobile */}
      <div style={{ display:'flex', justifyContent:'center' }}>
        <button
          onPointerDown={e => { e.preventDefault(); jump(); }}
          style={{ background:'#FF6B6B', border:'4px solid #1A535C',
            borderRadius:'50px', padding:'14px 60px', fontSize:'1.2rem',
            fontWeight:'900', cursor:'pointer', boxShadow:'4px 4px 0px #1A535C',
            color:'white', userSelect:'none', touchAction:'none', letterSpacing:'1px' }}>
          ⬆ SAUTER !
        </button>
      </div>
      <p style={{ textAlign:'center', fontSize:'0.8rem', color:'#636E72',
        marginTop:'8px', fontWeight:'600' }}>
        Touche l'écran · Clique SAUTER · ou appuie sur Espace / ↑
      </p>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   GAME 3 — Dragon Ball Blast
   • Ki balls appear at random spots, shrink over 1.8s
   • Click to blast = +10 pts
   • Miss (auto-expire) = lose 1 life (3 lives)
   • 30 second timer
   • Game ends when lives = 0 or time runs out
════════════════════════════════════════════════════════════ */
const BALL_LIFETIME = 1800;

const DragonBallBlast = () => {
  const [score,    setScore]    = useState(0);
  const [lives,    setLives]    = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [balls,    setBalls]    = useState([]);   // { id, x, y }
  const [blasts,   setBlasts]   = useState([]);   // explosion effects
  const [gameOver, setGameOver] = useState(false);
  const [started,  setStarted]  = useState(false);

  const nextId   = useRef(0);
  const blastId  = useRef(0);
  const livesRef = useRef(3);
  const overRef  = useRef(false);
  const aliveIds = useRef(new Set()); // track alive ball IDs

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft <= 0) { overRef.current = true; setGameOver(true); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, gameOver, timeLeft]);

  // Spawn balls
  useEffect(() => {
    if (!started || gameOver) return;
    const s = setInterval(() => {
      if (overRef.current) return;
      const id = nextId.current++;
      aliveIds.current.add(id);
      setBalls(p => [...p, {
        id,
        x: Math.random() * 74 + 8,
        y: Math.random() * 54 + 18,
      }]);

      // Auto-expire — deduct life outside state updater
      setTimeout(() => {
        if (overRef.current) return;
        if (!aliveIds.current.has(id)) return; // already blasted — no life lost
        aliveIds.current.delete(id);
        setBalls(prev => prev.filter(b => b.id !== id));
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          overRef.current = true;
          setGameOver(true);
        }
      }, BALL_LIFETIME);
    }, 850);
    return () => clearInterval(s);
  }, [started, gameOver]);

  const blast = (id, x, y) => {
    if (!aliveIds.current.has(id)) return; // already expired
    aliveIds.current.delete(id);
    setBalls(p => p.filter(b => b.id !== id));
    setScore(s => s + 10);
    const bid = blastId.current++;
    setBlasts(p => [...p, { id: bid, x, y }]);
    setTimeout(() => setBlasts(p => p.filter(b => b.id !== bid)), 500);
  };

  const restart = () => {
    overRef.current  = false;
    livesRef.current = 3;
    nextId.current   = 0;
    aliveIds.current.clear();
    setScore(0); setLives(3); setTimeLeft(30);
    setBalls([]); setBlasts([]); setGameOver(false); setStarted(false);
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'320px',
      background:'linear-gradient(180deg,#0D0D2B 0%,#1A1A4E 100%)',
      border:'4px solid #FFE66D', borderRadius:'16px', overflow:'hidden' }}>

      {/* Stars bg */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{ position:'absolute',
          width: i%3===0 ? '4px':'2px', height: i%3===0 ? '4px':'2px',
          background:'white', borderRadius:'50%',
          left:`${(i*43+7)%95}%`, top:`${(i*31+5)%88}%`, opacity:0.6 }} />
      ))}

      {/* HUD */}
      <div style={{ position:'absolute', top:10, left:10, right:10,
        display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 }}>
        <div style={{ background:'#FFE66D', border:'3px solid #1A535C',
          borderRadius:'20px', padding:'4px 14px', fontWeight:'900', color:'#1A535C' }}>
          💥 {score}
        </div>
        <div style={{ display:'flex', gap:'4px' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ fontSize:'1.3rem', opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div style={{ background:'#FF6B6B', border:'3px solid white',
          borderRadius:'20px', padding:'4px 14px', fontWeight:'900', color:'white' }}>
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* Ki balls */}
      <AnimatePresence>
        {balls.map(b => (
          <motion.button key={b.id}
            initial={{ scale:0, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:0, opacity:0 }}
            transition={{ duration:0.18 }}
            onClick={() => blast(b.id, b.x, b.y)}
            style={{ position:'absolute', left:`${b.x}%`, top:`${b.y}%`,
              background:'transparent', border:'none', fontSize:'2.6rem',
              cursor:'pointer', transform:'translate(-50%,-50%)',
              filter:'drop-shadow(0 0 12px #FF6B6B)', zIndex:5,
              animation:`ballShrink ${BALL_LIFETIME}ms linear forwards` }}>
            🔴
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Blast explosions */}
      <AnimatePresence>
        {blasts.map(b => (
          <motion.div key={b.id}
            initial={{ scale:0.5, opacity:1 }}
            animate={{ scale:3, opacity:0 }}
            transition={{ duration:0.5 }}
            style={{ position:'absolute', left:`${b.x}%`, top:`${b.y}%`,
              fontSize:'2rem', pointerEvents:'none',
              transform:'translate(-50%,-50%)', zIndex:8 }}>
            💥
          </motion.div>
        ))}
      </AnimatePresence>

      <style>{`
        @keyframes ballShrink {
          0%   { transform: translate(-50%,-50%) scale(1.2); filter: drop-shadow(0 0 16px #FF6B6B); }
          70%  { transform: translate(-50%,-50%) scale(1);   filter: drop-shadow(0 0 8px #FF6B6B);  }
          100% { transform: translate(-50%,-50%) scale(0.3); filter: none; opacity: 0.3; }
        }
      `}</style>

      {/* Start */}
      {!started && !gameOver && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.88)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:'14px', zIndex:15 }}>
          <div style={{ fontSize:'3rem' }}>🔴</div>
          <div style={{ fontSize:'1.6rem', fontWeight:'950', color:'#FFE66D' }}>DRAGON BALL BLAST !</div>
          <p style={{ color:'white', fontWeight:'600', textAlign:'center',
            maxWidth:'260px', lineHeight:'1.4', fontSize:'0.95rem' }}>
            Clique sur les boules de Ki avant qu'elles disparaissent !<br/>
            Chaque raté = ❤️ perdu. 3 vies, 30 secondes.
          </p>
          <button onClick={() => setStarted(true)}
            style={{ background:'#FF6B6B', color:'white', border:'4px solid #FFE66D',
              borderRadius:'50px', padding:'12px 32px', fontWeight:'900',
              fontSize:'1.1rem', cursor:'pointer', boxShadow:'4px 4px 0px #FFE66D' }}>
            KAMEHAMEHA ! 💥
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.92)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:'12px', zIndex:15 }}>
          <div style={{ fontSize:'2rem', fontWeight:'950', color:'#FFE66D' }}>
            {lives <= 0 ? '💔 PLUS D\'ÉNERGIE !' : "TEMPS ÉCOULÉ ! ⏰"}
          </div>
          <div style={{ color:'white', fontWeight:'700', fontSize:'1.1rem' }}>
            Niveau de Puissance : <span style={{color:'#FFE66D'}}>{score}</span>
          </div>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.9rem', fontWeight:'600' }}>
            {score/10} tirs réussis ! 🐉
          </div>
          <button onClick={restart}
            style={{ background:'#FF6B6B', color:'white', border:'4px solid #FFE66D',
              borderRadius:'50px', padding:'10px 28px', fontWeight:'900',
              fontSize:'1rem', cursor:'pointer' }}>
            REJOUER !
          </button>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   Map game title → component
════════════════════════════════════════════════════════════ */
const GAMES = {
  "Attrape Pokémon !":          PokemonCatch,
  "La Poursuite Tom et Jerry":  TomJerryChase,
  "Dragon Ball Blast":          DragonBallBlast,
};

/* ════════════════════════════════════════════════════════════
   Modal wrapper
════════════════════════════════════════════════════════════ */
const GameModal = ({ game, onClose }) => {
  const GameComponent = game ? GAMES[game.title] : null;

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          onClick={onClose}
          style={{ position:'fixed', inset:0, background:'rgba(26,83,92,0.88)',
            zIndex:9999, display:'flex', alignItems:'center',
            justifyContent:'center', padding:'20px', backdropFilter:'blur(6px)' }}>

          <motion.div
            initial={{ scale:0.6, rotate:-8 }}
            animate={{ scale:1, rotate:0 }}
            exit={{ scale:0.6, rotate:8 }}
            transition={{ type:'spring', stiffness:300, damping:24 }}
            onClick={e => e.stopPropagation()}
            style={{ background:'white', border:'6px solid #1A535C',
              borderRadius:'24px', boxShadow:'16px 16px 0px #FFE66D',
              width:'100%', maxWidth:'600px', overflow:'hidden' }}>

            {/* Header */}
            <div style={{ background:'#FFE66D', borderBottom:'4px solid #1A535C',
              padding:'14px 20px', display:'flex',
              justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'1.2rem', fontWeight:'950',
                color:'#1A535C', textTransform:'uppercase' }}>
                {game.emoji} {game.title}
              </span>
              <button onClick={onClose}
                style={{ background:'#FF6B6B', border:'3px solid #1A535C',
                  borderRadius:'50%', width:'40px', height:'40px',
                  cursor:'pointer', color:'white', fontWeight:'900',
                  fontSize:'1rem', boxShadow:'3px 3px 0px #1A535C',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Game area */}
            <div style={{ padding:'24px' }}>
              {GameComponent && <GameComponent />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal;
