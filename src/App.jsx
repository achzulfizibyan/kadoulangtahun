import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, Pause, Moon, Sun, KeyRound, ArrowRight, Gift, Camera, Heart, Gamepad2 } from 'lucide-react';
import './index.css';

/* ===== ANIMATION PRESETS ===== */
const page = {
  initial: { opacity: 0, y: 40, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -50, filter: 'blur(12px)', transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } },
};

const stagger = { animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

/* ===== GOLDEN PARTICLE CANVAS ===== */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let w = c.width = innerWidth, h = c.height = innerHeight, id;
    const onResize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    addEventListener('resize', onResize);

    class P {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h + h * 0.1;
        this.size = Math.random() * 2.5 + 0.5;
        this.vy = -(Math.random() * 0.6 + 0.15);
        this.vx = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = Math.random() * 400 + 200;
        this.age = 0;
      }
      update() {
        this.x += this.vx + Math.sin(this.age * 0.015) * 0.2;
        this.y += this.vy;
        this.age++;
        if (this.age > this.life || this.y < -10) this.reset();
      }
      draw() {
        const fade = 1 - this.age / this.life;
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.fillStyle = `hsl(${38 + Math.random() * 10}, 60%, ${70 + Math.random() * 15}%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 60 }, () => new P());
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => { removeEventListener('resize', onResize); cancelAnimationFrame(id); };
  }, []);
  return <canvas id="sakura-canvas" ref={ref} />;
};

/* ===== PAGE 1: LOGIN ===== */
const LoginPage = ({ onNext }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const inp = useRef(null);
  useEffect(() => { inp.current?.focus(); }, []);

  const submit = () => {
    if (pw.toLowerCase() === 'sayang') {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#c9a96e', '#b76e79', '#e8d5a8', '#fff'] });
      onNext();
    } else { setErr(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  return (
    <motion.div className="page-container" variants={page} initial="initial" animate="animate" exit="exit">
      <motion.div className="card" variants={stagger} initial="initial" animate="animate">
        <motion.p className="label" variants={fadeUp}>✦ Sebuah Kejutan Menantimu ✦</motion.p>
        <motion.h1 className="heading-xl" variants={fadeUp}>
          Sebelum Masuk...
        </motion.h1>
        <motion.p className="body-text" variants={fadeUp}>
          Masukkan kata rahasia kita untuk membuka gerbangnya.
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.div animate={shake ? { x: [-10, 10, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
            <input ref={inp} type="password" className="input-field" placeholder="••••••" value={pw}
              onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </motion.div>
          <AnimatePresence>
            {err && <motion.p className="error-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Hmm, bukan itu... coba lagi 😉</motion.p>}
          </AnimatePresence>
        </motion.div>
        <motion.div variants={fadeUp}>
          <button className="btn-gold" onClick={submit}><KeyRound size={16} /> Buka</button>
        </motion.div>
        <motion.p className="hint" variants={fadeUp}>hint: panggilan sayangmu</motion.p>
      </motion.div>
    </motion.div>
  );
};

/* ===== PAGE 2: GREETING ===== */
const GreetingPage = ({ onNext }) => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const start = new Date('2023-01-01T00:00:00');
  useEffect(() => {
    const tick = () => {
      const d = Date.now() - start.getTime();
      setT({ d: Math.floor(d / 864e5), h: Math.floor(d / 36e5 % 24), m: Math.floor(d / 6e4 % 60), s: Math.floor(d / 1e3 % 60) });
    };
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div className="page-container" variants={page} initial="initial" animate="animate" exit="exit">
      <motion.div className="card" variants={stagger} initial="initial" animate="animate">
        <motion.div className="profile-frame" variants={fadeUp}>
          <img src="/assets/profile.jpg" alt="Profile" className="profile-img" />
          <span className="profile-badge">Birthday Girl 👑</span>
        </motion.div>

        <motion.div className="time-counter" variants={fadeUp}>
          {[
            { n: t.d, l: 'Hari' }, { n: t.h, l: 'Jam' }, { n: t.m, l: 'Menit' }, { n: t.s, l: 'Detik' }
          ].map(({ n, l }) => (
            <div className="time-unit" key={l}>
              <span className="time-number">{n}</span>
              <span className="time-label">{l}</span>
            </div>
          ))}
        </motion.div>

        <motion.p className="label" variants={fadeUp}>✦ Bersamamu Selama ✦</motion.p>
        <motion.h1 className="heading-xl" variants={fadeUp}>Happy Birthday</motion.h1>
        <hr className="gold-line" />
        <motion.p className="body-text" variants={fadeUp}>
          Selamat ulang tahun untuk wanita paling spesial dalam hidupku.
          Aku sangat beruntung bisa mengenalmu. Hari ini adalah harimu,
          dan aku sudah menyiapkan perjalanan kecil untukmu.
        </motion.p>
        <motion.div variants={fadeUp}>
          <button className="btn-gold" onClick={onNext}><ArrowRight size={16} /> Lanjut</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ===== PAGE 3: CAKE ===== */
const CakePage = ({ onNext }) => {
  const [blows, setBlows] = useState(0);
  const blow = () => {
    if (blows >= 3) return;
    const n = blows + 1;
    setBlows(n);
    if (n === 3) {
      setTimeout(() => {
        const end = Date.now() + 2500;
        const colors = ['#c9a96e', '#b76e79', '#e8d5a8', '#fff'];
        (function f() {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(f);
        })();
      }, 200);
    }
  };

  return (
    <motion.div className="page-container" variants={page} initial="initial" animate="animate" exit="exit">
      <motion.div className="card" variants={stagger} initial="initial" animate="animate">
        <motion.p className="label" variants={fadeUp}>✦ Ritualnya Dulu ✦</motion.p>
        <motion.h2 className="heading-lg" variants={fadeUp}>Tiup Lilinnya</motion.h2>
        <motion.p className="body-text" variants={fadeUp}>
          {blows < 3 ? 'Ketuk kuenya tiga kali untuk meniup lilin!' : ''}
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.div className="cake-frame" onClick={blow} whileTap={{ scale: 0.93 }}
            animate={{ scale: blows >= 3 ? 1 : 1 + blows * 0.03 }}>
            <img src="/assets/cake.jpg" alt="Birthday Cake" style={{ filter: blows >= 3 ? 'brightness(1.1)' : 'none' }} />
          </motion.div>
        </motion.div>

        <motion.div className="blow-dots" variants={fadeUp}>
          {[0, 1, 2].map(i => <div key={i} className={`blow-dot ${i < blows ? 'active' : ''}`} />)}
        </motion.div>

        <AnimatePresence>
          {blows >= 3 && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3, type: 'spring', stiffness: 100 } }}>
              <h3 className="script" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--gold-light)', marginTop: 20 }}>Make a wish ✨</h3>
              <button className="btn-gold" onClick={onNext}><Camera size={16} /> Lihat Galeri</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ===== 3D CAROUSEL ===== */
const Carousel3D = () => {
  const [rot, setRot] = useState(0);
  const drag = useRef(false), lastX = useRef(0);
  const media = [
    '/assets/vid1.mp4',
    '/assets/vid2.mp4',
    '/assets/vid3.mp4',
    '/assets/vid4.mp4',
    '/assets/vid5.mp4',
    '/assets/vid6.mp4'
  ];
  const n = media.length, theta = 360 / n;
  const cellW = Math.min(200, window.innerWidth * 0.42);
  const radius = Math.round((cellW / 2) / Math.tan(Math.PI / n)) + 30;

  useEffect(() => {
    const id = setInterval(() => { if (!drag.current) setRot(r => r - 0.2); }, 16);
    return () => clearInterval(id);
  }, []);

  const onS = useCallback(e => { drag.current = true; lastX.current = e.pageX ?? e.touches?.[0]?.pageX ?? 0; }, []);
  const onM = useCallback(e => { if (!drag.current) return; const x = e.pageX ?? e.touches?.[0]?.pageX ?? 0; setRot(r => r + (x - lastX.current) * 0.4); lastX.current = x; }, []);
  const onE = useCallback(() => { drag.current = false; }, []);

  return (
    <div className="carousel-scene" onMouseDown={onS} onMouseMove={onM} onMouseUp={onE} onMouseLeave={onE}
      onTouchStart={onS} onTouchMove={onM} onTouchEnd={onE}>
      <div className="carousel" style={{ transform: `translateZ(${-radius}px) rotateY(${rot}deg)` }}>
        {media.map((s, i) => (
          <div key={i} className="carousel-cell" style={{ transform: `rotateY(${i * theta}deg) translateZ(${radius}px)` }}>
            <video src={s} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable="false" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== PAGE 4: MEMORIES ===== */
const MemoriesPage = ({ onNext }) => (
  <motion.div className="page-container" variants={page} initial="initial" animate="animate" exit="exit">
    <motion.div className="card" style={{ maxWidth: 640 }} variants={stagger} initial="initial" animate="animate">
      <motion.p className="label" variants={fadeUp}>✦ Momen Kita ✦</motion.p>
      <motion.h2 className="heading-lg" variants={fadeUp}>Galeri Kenangan</motion.h2>
      <motion.p className="body-text" variants={fadeUp}>Geser foto-foto ini untuk memutar ruang waktu kita.</motion.p>
      <motion.div variants={fadeUp}><Carousel3D /></motion.div>
      <motion.div variants={fadeUp} style={{ marginTop: 40 }}>
        <button className="btn-gold" onClick={onNext}><Gamepad2 size={16} /> Lanjut Tantangan</button>
      </motion.div>
    </motion.div>
  </motion.div>
);

/* ===== SCRATCH CARD ===== */
const ScratchCard = ({ text }) => {
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const rect = cv.parentElement.getBoundingClientRect();
    const dpr = devicePixelRatio || 1;
    cv.width = rect.width * dpr; cv.height = rect.height * dpr;
    cv.style.width = rect.width + 'px'; cv.style.height = rect.height + 'px';
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    // Gold foil scratch layer
    const grd = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grd.addColorStop(0, '#8a7a5a'); grd.addColorStop(0.5, '#a89a70'); grd.addColorStop(1, '#8a7a5a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '500 14px Inter'; ctx.fillStyle = '#6b6040'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GOSOK UNTUK MEMBUKA', rect.width / 2, rect.height / 2);

    let down = false;
    const pos = e => {
      const r = cv.getBoundingClientRect();
      return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top };
    };
    const scratch = e => {
      if (!down) return;
      if (e.cancelable) e.preventDefault();
      const p = pos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(p.x * dpr, p.y * dpr, 20 * dpr, 0, Math.PI * 2); ctx.fill();
      if (!done.current) {
        done.current = true;
        setTimeout(() => {
          const r = cv.getBoundingClientRect();
          confetti({ particleCount: 40, spread: 50, origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight }, colors: ['#c9a96e', '#b76e79'] });
        }, 1200);
      }
    };
    const d = () => { down = true; }; const u = () => { down = false; };
    cv.addEventListener('mousedown', d); cv.addEventListener('mouseup', u); cv.addEventListener('mouseleave', u); cv.addEventListener('mousemove', scratch);
    cv.addEventListener('touchstart', d, { passive: false }); cv.addEventListener('touchend', u); cv.addEventListener('touchmove', scratch, { passive: false });
    return () => {
      cv.removeEventListener('mousedown', d); cv.removeEventListener('mouseup', u); cv.removeEventListener('mouseleave', u); cv.removeEventListener('mousemove', scratch);
      cv.removeEventListener('touchstart', d); cv.removeEventListener('touchend', u); cv.removeEventListener('touchmove', scratch);
    };
  }, []);
  return (
    <div className="scratch-card-container">
      <div className="scratch-content">{text}</div>
      <canvas ref={ref} className="scratch-canvas" />
    </div>
  );
};

/* ===== PAGE 4.5: MINI GAME ===== */
const GamePage = ({ onNext }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [status, setStatus] = useState('playing');
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setStatus(score >= 10 ? 'won' : 'lost'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, score]);

  useEffect(() => {
    if (status !== 'playing') return;
    const spawner = setInterval(() => {
      setHearts(h => [...h, { id: Date.now(), x: Math.random() * 80 + 10 }]);
    }, 500);
    return () => clearInterval(spawner);
  }, [status]);

  useEffect(() => {
    if (score >= 10 && status === 'playing') setStatus('won');
  }, [score, status]);

  const catchHeart = (id) => {
    if (status !== 'playing') return;
    setScore(s => s + 1);
    setHearts(h => h.filter(heart => heart.id !== id));
    confetti({ particleCount: 20, spread: 50, origin: { y: 0.5 }, colors: ['#b76e79', '#c9a96e'] });
  };

  return (
    <motion.div className="page-container" variants={page} initial="initial" animate="animate" exit="exit" style={{ overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 50, color: 'var(--gold-light)', fontSize: '1.2rem', fontFamily: 'Inter', fontWeight: 600 }}>
        Waktu: {timeLeft}s
      </div>
      <div style={{ position: 'absolute', top: 30, right: 30, zIndex: 50, color: 'var(--gold-light)', fontSize: '1.2rem', fontFamily: 'Inter', fontWeight: 600 }}>
        Skor: {score}/10
      </div>

      {status === 'playing' && hearts.map(h => (
        <motion.div
          key={h.id}
          initial={{ y: '-10vh', x: `${h.x}vw`, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: Math.random() * 2 + 2.5, ease: 'linear' }}
          onClick={() => catchHeart(h.id)}
          onPointerDown={() => catchHeart(h.id)}
          style={{ position: 'absolute', cursor: 'pointer', zIndex: 40, touchAction: 'none' }}
        >
          <Heart fill="var(--rose)" color="var(--rose-deep)" size={48} style={{ filter: 'drop-shadow(0 0 10px rgba(183,110,121,0.5))' }} />
        </motion.div>
      ))}

      <AnimatePresence>
        {status !== 'playing' && (
          <motion.div className="card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={{ zIndex: 60 }}>
            <motion.p className="label" variants={fadeUp} initial="initial" animate="animate">✦ Hasil Tantangan ✦</motion.p>
            <h2 className="heading-lg" style={{ marginTop: 10 }}>{status === 'won' ? 'Kamu Berhasil! 🎉' : 'Waktu Habis! 😢'}</h2>
            <p className="body-text" style={{ marginBottom: 20 }}>
              {status === 'won' ? 'Kamu membuktikan cintamu dengan menangkap 10 hati! Sekarang saatnya menerima hadiah utamamu.' : 'Yah, hatinya pada kabur. Jangan menyerah, buktikan cintamu sekali lagi!'}
            </p>
            {status === 'won' ? (
              <button className="btn-gold" onClick={onNext}><Gift size={16} /> Buka Kado</button>
            ) : (
              <button className="btn-gold" onClick={() => { setScore(0); setTimeLeft(15); setStatus('playing'); setHearts([]); }}><Gamepad2 size={16} /> Coba Lagi</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {status === 'playing' && (
        <div style={{ position: 'absolute', bottom: 50, textAlign: 'center', zIndex: 30, color: 'var(--text-dim)', fontStyle: 'italic' }}>
          Tap 10 hati terbang untuk membuktikan cintamu!
        </div>
      )}
    </motion.div>
  );
};

/* ===== PAGE 5: GIFTS ===== */
const GiftsPage = () => {
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState('');
  const msg = "Hai sayang, selamat ulang tahun!\n\nTerima kasih sudah lahir ke dunia ini dan menjadi bagian terindah dalam hidupku. Aku sangat bersyukur memilikimu.\n\nSemoga semua mimpimu terwujud, dan semoga aku bisa selalu ada di sisimu untuk merayakannya.\n\nWith all my love,\nYour Man ❤️";

  const openLetter = () => {
    if (opened) return;
    setOpened(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.45 }, colors: ['#c9a96e', '#b76e79', '#e8d5a8'] });
    setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        if (i < msg.length) {
          const ch = msg[i] === '\n' ? '<br/>' : msg[i];
          i++;
          setTyped(prev => prev + ch);
        } else clearInterval(id);
      }, 40);
    }, 500);
  };

  return (
    <motion.div className="page-container" variants={page} initial="initial" animate="animate">
      <div className="card" style={{ maxWidth: 520, maxHeight: '92vh', overflowY: 'auto' }}>
        <motion.p className="label" variants={fadeUp} initial="initial" animate="animate">✦ Kado Utama ✦</motion.p>
        <motion.h2 className="heading-lg" variants={fadeUp} initial="initial" animate="animate">Surat Untukmu</motion.h2>

        <motion.div className="letter-card" variants={fadeUp} initial="initial" animate="animate" onClick={openLetter}>
          <motion.div className={`letter-seal ${opened ? 'broken' : ''}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            💌
          </motion.div>
          {!opened && <div className="letter-cta">ketuk segel untuk membuka</div>}
          <div className={`letter-body ${opened ? 'visible' : ''}`}>
            <p dangerouslySetInnerHTML={{ __html: typed }} />
          </div>
        </motion.div>

        <hr className="gold-line" style={{ marginTop: 36 }} />

        <motion.p className="label" variants={fadeUp} initial="initial" animate="animate">✦ Bonus ✦</motion.p>
        <motion.h2 className="heading-lg" variants={fadeUp} initial="initial" animate="animate">Tiket Gosok</motion.h2>
        <motion.p className="body-text" variants={fadeUp} initial="initial" animate="animate" style={{ marginBottom: 20 }}>
          Gosok lapisan emas untuk melihat hadiahnya.
        </motion.p>

        <div className="scratch-grid">
          <ScratchCard text="🎬 Nonton Bioskop Bareng" />
          <ScratchCard text="🍣 Makan di Tempat Favoritmu" />
          <ScratchCard text="🧋 Minuman Bebas Pilih" />
        </div>

        <motion.p className="body-text" style={{ marginTop: 36, fontSize: '0.8rem', fontStyle: 'italic' }} variants={fadeUp} initial="initial" animate="animate">
          I love you, forever and always ❤️
        </motion.p>
      </div>
    </motion.div>
  );
};

/* ===== MAIN APP ===== */
export default function App() {
  const [stage, setStage] = useState(0);
  const [night, setNight] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);

  const toggleMusic = () => { if (playing) audio.current.pause(); else audio.current.play(); setPlaying(!playing); };
  const next = () => {
    setStage(s => s + 1);
    if (stage === 0) audio.current?.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <>
      <div className="ambient-bg" />
      <ParticleCanvas />

      <button className="ctrl-btn theme" onClick={() => setNight(n => !n)} aria-label="Toggle theme">
        {night ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <audio ref={audio} loop preload="auto">
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {stage > 0 && (
        <motion.button className="ctrl-btn music" onClick={toggleMusic} aria-label="Toggle music"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {stage === 0 && <LoginPage key="p0" onNext={next} />}
        {stage === 1 && <GreetingPage key="p1" onNext={next} />}
        {stage === 2 && <CakePage key="p2" onNext={next} />}
        {stage === 3 && <MemoriesPage key="p3" onNext={next} />}
        {stage === 4 && <GamePage key="p4" onNext={next} />}
        {stage === 5 && <GiftsPage key="p5" />}
      </AnimatePresence>
    </>
  );
}
