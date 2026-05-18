import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Play, Menu, X, ArrowUp } from 'lucide-react';
import API_BASE_URL from '../config';

const getEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 12 || match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

const getYoutubeThumbnail = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && (match[2].length === 12 || match[2].length === 11)) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return '';
};

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let startTime = null;
          const startValue = 0;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);
            const easeOutRatio = progressRatio * (2 - progressRatio);
            const currentValue = Math.floor(startValue + (end - startValue) * easeOutRatio);
            setCount(currentValue);

            if (progressRatio < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count}</span>;
};

const PublicPortfolio = () => {
  const [data, setData] = useState({ Hero: {}, About: {}, Projects: [], Skills: [], Services: [], Reels: [] });
  const [activeVideo, setActiveVideo] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");

  useEffect(() => {
    let frame = 0;
    let sec = 0;
    let min = 0;
    let hr = 0;
    const interval = setInterval(() => {
      frame += 2;
      if (frame >= 30) {
        frame = 0;
        sec += 1;
      }
      if (sec >= 60) {
        sec = 0;
        min += 1;
      }
      if (min >= 60) {
        min = 0;
        hr += 1;
      }
      const pad = (val) => String(val).padStart(2, '0');
      setTimecode(`${pad(hr)}:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 33.33); // 30 FPS tick
    return () => clearInterval(interval);
  }, []);

  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const container = heroRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [data]); // Hook fires after data loads and heroRef attaches perfectly

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/portfolio`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        if (resData && resData.Hero && resData.Hero.Name) {
          document.title = `${resData.Hero.Name} | Professional Video Editor & Director`;
        }
      })
      .catch(console.error);
  }, []);

  const hero = data.Hero || {};
  const about = data.About || null;
  const projects = data.Projects || [];
  const reels = data.Reels || [];
  const services = data.Services || [];

  return (
    <div className="public-portfolio-theme" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      <CustomCursor />
      {/* Navbar - Redesigned to a floating pill shape with responsive mobile support */}
      <div style={{ position: 'fixed', top: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
        <nav className="floating-nav" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(20, 20, 22, 0.7)',
          backdropFilter: 'blur(16px)',
          padding: '1rem 2.5rem',
          borderRadius: '50px',
          width: '90%',
          maxWidth: '1000px',
          border: '1px solid var(--accent-red)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          <div className="nav-logo">
            {hero.Name ? (
              <>
                {hero.Name.split(' ').slice(0, -1).join(' ')}{' '}
                <span style={{ color: 'var(--accent-red)' }}>
                  {hero.Name.split(' ').slice(-1)}
                </span>
              </>
            ) : (
              <>
                MAHMOUD <span style={{ color: 'var(--accent-red)' }}>BADR</span>
              </>
            )}
          </div>

          <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>About</a>
            <a href="#projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Projects</a>
            <a href="#skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Skills</a>
            <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Services</a>
            <a href="#reels" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Showreel</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Contact</a>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setNavOpen(!navOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', outline: 'none', alignItems: 'center', justifyContent: 'center' }}
          >
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {navOpen && (
            <div className="mobile-menu" style={{
              position: 'absolute',
              top: '4.5rem',
              left: 0,
              width: '100%',
              background: 'rgba(20, 20, 22, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--accent-red)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              zIndex: 100
            }}>
              <a href="#about" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>About</a>
              <a href="#projects" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Projects</a>
              <a href="#skills" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Skills</a>
              <a href="#services" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Services</a>
              <a href="#reels" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Showreel</a>
              <a href="#contact" onClick={() => setNavOpen(false)} style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Contact</a>
            </div>
          )}
        </nav>
      </div>

      <section id="hero" ref={heroRef} style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div
          animate={{
            scale: [1, 1.12, 1.06, 1.15, 1.02, 1],
            x: [0, 15, -10, 20, -5, 0],
            y: [0, -10, 15, -15, 10, 0]
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${hero.BackgroundVideoUrl?.includes('.mp4') ? '/hero-bg.png' : (hero.BackgroundVideoUrl || '/hero-bg.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            zIndex: 0
          }}
        />
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-primary), transparent)', zIndex: 1 }} />

        {/* Dynamic Lag-Free Torchlight/Spotlight Follow Overlay */}
        <div className="hero-glow-flashlight" />

        {/* Camera Viewfinder HUD Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {/* Corner focus brackets */}
          <div className="hud-bracket hud-tl" />
          <div className="hud-bracket hud-tr" />
          <div className="hud-bracket hud-bl" />
          <div className="hud-bracket hud-br" />

          {/* Blink Recording Dot */}
          <div className="hud-rec" style={{ position: 'absolute', top: '4.5rem', left: '4.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(9, 9, 11, 0.65)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
            <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: '#fff' }}>REC</span>
          </div>

          {/* Anamorphic Frame Guide Label / FPS */}
          <div className="hud-rec" style={{ position: 'absolute', top: '4.5rem', right: '4.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(9, 9, 11, 0.65)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)' }}>4K UHD</span>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: '#fff' }}>60 FPS</span>
          </div>

          {/* Running timecode */}
          <div className="hud-timecode" style={{ position: 'absolute', bottom: '4.5rem', left: '4.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(9, 9, 11, 0.65)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--accent-red)' }}>TC</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: '#fff', letterSpacing: '0.5px' }}>{timecode}</span>
          </div>

          {/* Dynamic Audio EQ meter */}
          <div className="hud-audio" style={{ position: 'absolute', bottom: '4.5rem', right: '4.5rem', display: 'flex', alignItems: 'flex-end', gap: '3px', background: 'rgba(9, 9, 11, 0.65)', padding: '0.5rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', height: '32px', zIndex: 10 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginRight: '6px', alignSelf: 'center', letterSpacing: '1px' }}>CH1</span>
            <div className="hud-audio-bar" />
            <div className="hud-audio-bar" />
            <div className="hud-audio-bar" />
            <div className="hud-audio-bar" />
          </div>

          {/* Camera focus crosshair inside the center */}
          <div className="hud-crosshair" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15, pointerEvents: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 2rem', width: '100%' }}
        >
          <h1 className="hero-title" style={{ textTransform: 'uppercase', marginBottom: '1rem', textShadow: '0 0 30px rgba(220,38,38,0.5)' }}>
            {hero.Name || "Loading..."}
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {hero.Brief}
          </p>
          <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <a href={hero.CtaLink || "#projects"} className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              {hero.CtaText || "Explore"}
            </a>
            <a href="#reels" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Show Reels
            </a>
          </div>
        </motion.div>
      </section>

      {/* Cinematic Studio Metrics Ticker Banner */}
      <div style={{ background: 'var(--bg-primary)', position: 'relative', zIndex: 10, padding: '2rem 0', overflow: 'hidden' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              background: 'rgba(20, 20, 22, 0.6)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            {/* Stat Item 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
                <CountUp end={500} /><span style={{ color: 'var(--accent-red)' }}>+</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Happy Clients
              </div>
              <div style={{ width: '40px', height: '2px', background: 'var(--accent-red)', margin: '0.5rem auto 0', opacity: 0.5 }} />
            </div>

            {/* Stat Item 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
                <CountUp end={5000} /><span style={{ color: 'var(--accent-red)' }}>+</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Completed Projects
              </div>
              <div style={{ width: '40px', height: '2px', background: 'var(--accent-red)', margin: '0.5rem auto 0', opacity: 0.5 }} />
            </div>

            {/* Stat Item 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
                <CountUp end={5} /><span style={{ color: 'var(--accent-red)' }}>+</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Years Experience
              </div>
              <div style={{ width: '40px', height: '2px', background: 'var(--accent-red)', margin: '0.5rem auto 0', opacity: 0.5 }} />
            </div>

            {/* Stat Item 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
                <CountUp end={10} />M<span style={{ color: 'var(--accent-red)' }}>+</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Total Views
              </div>
              <div style={{ width: '40px', height: '2px', background: 'var(--accent-red)', margin: '0.5rem auto 0', opacity: 0.5 }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      {about && about.Title && (
        <section id="about" className="section-padding container">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', width: '100%' }}
          >
            <div style={{ flex: '1 1 400px', position: 'relative' }}>
              <div className="about-border-decor"></div>
              <img
                src={about.ImageUrl || 'https://images.unsplash.com/photo-1605333396956-654ec47188ba?q=80&w=800'}
                alt={about.Title}
                style={{ width: '100%', height: 'auto', borderRadius: '16px', position: 'relative', zIndex: 1, objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              />
            </div>
            <div style={{ flex: '1 1 500px' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                {about.Title.split(' ').map((word, i) => i === about.Title.split(' ').length - 1 ? <span key={i} style={{ color: 'var(--accent-red)' }}>{word}</span> : <span key={i}>{word} </span>)}
              </h2>
              <div style={{ width: '60px', height: '4px', background: 'var(--accent-red)', marginBottom: '2rem' }}></div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {about.Brief}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Cinematic Sep Laser Bar */}
      <div className="container" style={{ margin: '3rem auto' }}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, var(--accent-red), transparent)', originX: 0.5 }}
        />
      </div>

      {/* Projects Section */}
      <section id="projects" className="section-padding container">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem', textAlign: 'center', fontWeight: '800' }}>
            Selected <span style={{ color: 'var(--accent-red)' }}>Projects</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {projects.length > 0 ? projects.map((project, i) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover="hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease'
                }}
                variants={{
                  hover: {
                    y: -10,
                    borderColor: 'rgba(220, 38, 38, 0.45)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.45), 0 0 25px rgba(220,38,38,0.08)'
                  }
                }}
              >
                {/* Thumbnail Container */}
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {/* Zooming Image */}
                  <motion.img
                    variants={{ hover: { scale: 1.05 } }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    src={project.ThumbnailUrl || `https://picsum.photos/seed/${project.Id}/600/400`}
                    alt={project.Title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.05)', transition: 'filter 0.4s ease' }}
                  />
                </div>

                {/* Text Info */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>{project.Category || 'Video'}</span>
                  <motion.h3
                    variants={{ hover: { color: 'var(--accent-red)' } }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', margin: 0, transition: 'color 0.3s' }}
                  >
                    {project.Title}
                  </motion.h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{project.Brief}</p>
                </div>
              </motion.div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No projects yet. Add some from the dashboard.</div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center' }}>
              My <span style={{ color: 'var(--accent-red)' }}>Skills</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {data.Skills && data.Skills.length > 0 ? data.Skills.map((skill, i) => (
                <motion.div
                  key={skill.Id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(220,38,38,0.1)' }}
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--accent-red)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>{skill.Title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {skill.Tags && skill.Tags.split(',').map((tag, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)', flexShrink: 0 }}></div>
                        <span style={{ fontSize: '1.05rem' }}>{tag.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No skills added yet.</div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Sep Laser Bar */}
      <div className="container" style={{ margin: '3rem auto' }}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, var(--accent-red), transparent)', originX: 0.5 }}
        />
      </div>

      {/* Services Section */}
      <section id="services" className="section-padding container">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center' }}>
            What I <span style={{ color: 'var(--accent-red)' }}>Do</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {services.length > 0 ? services.map((service, i) => (
              <motion.div
                key={service.Id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10, borderColor: 'var(--accent-red)', boxShadow: '0 10px 30px rgba(220,38,38,0.1)' }}
                style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', transition: 'all 0.3s' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-red)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.Title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{service.Description}</p>
              </motion.div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>Services not defined.</div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Cinematic Sep Laser Bar */}
      <div className="container" style={{ margin: '3rem auto' }}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, var(--accent-red), transparent)', originX: 0.5 }}
        />
      </div>

      {/* Showreel Section */}
      <section id="reels" style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center' }}>
              My <span style={{ color: 'var(--accent-red)' }}>Showreel</span>
            </h2>
            <div className="reels-grid">
              {reels.length > 0 ? reels.map((reel, i) => (
                <motion.div
                  key={reel.Id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover="hover"
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    background: '#09090B',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
                  }}
                  variants={{
                    hover: {
                      borderColor: 'rgba(220, 38, 38, 0.5)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(220, 38, 38, 0.15)'
                    }
                  }}
                  onClick={() => setActiveVideo(getEmbedUrl(reel.YoutubeLink))}
                >
                  {/* Widescreen Preview */}
                  <motion.img
                    variants={{ hover: { scale: 1.05 } }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    src={getYoutubeThumbnail(reel.YoutubeLink)}
                    alt={reel.Title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.05)' }}
                  />

                  {/* Dark Cinematic Gradient Backdrop Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '65%',
                    background: 'linear-gradient(to top, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.5) 60%, transparent 100%)',
                    zIndex: 1
                  }} />

                  {/* Card Content Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '1.5rem',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    {/* Left Side: Title and Sub-tag */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-red)', display: 'inline-block' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                          {reel.IsFeatured ? 'Featured Showcase' : 'Selected Work'}
                        </span>
                      </div>
                      <motion.h3
                        variants={{ hover: { color: 'var(--accent-red)' } }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: 0, transition: 'color 0.3s' }}
                      >
                        {reel.Title}
                      </motion.h3>
                    </div>

                    {/* Right Side: Glowing Glass Play Button */}
                    <motion.div
                      variants={{ hover: { scale: 1.1, background: 'var(--accent-red)', boxShadow: '0 0 25px var(--glow-red)' } }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        transition: 'background 0.3s, border-color 0.3s'
                      }}
                    >
                      <Play size={16} fill="#fff" style={{ marginLeft: '2px' }} />
                    </motion.div>
                  </div>
                </motion.div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No reels available.</div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection heroName={hero.Name} />

      {/* Footer */}
      <footer style={{ background: 'var(--bg-primary)', padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} {hero.Name || "Mahmoud Badr"}. All rights reserved.</p>
      </footer>
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ width: '95%', maxWidth: '1000px', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 50px rgba(220,38,38,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <iframe width="100%" height="100%" src={`${activeVideo}?autoplay=1`} title="Cinematic Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Return to Home Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-red)', boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="return-to-home-btn"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactSection = ({ heroName }) => {
  const [formData, setFormData] = useState({ Name: '', Email: '', Phone: '', Message: '' });
  const [status, setStatus] = useState(''); // '', 'sending', 'sent', 'error'
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('sent');
        setFormData({ Name: '', Email: '', Phone: '', Message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" style={{ padding: '8rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'var(--accent-red)', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'var(--accent-red)', opacity: 0.03, filter: 'blur(80px)', borderRadius: '50%' }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '1px' }}>
              Let's <span style={{ color: 'var(--accent-red)' }}>Work Together</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Ready to elevate your visual storytelling? Drop me a line and let's turn your vision into reality.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start', maxWidth: '1100px', margin: '0 auto' }}>

            {/* Contact Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Get In Touch</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                  Whether you have a project in mind, need a quote, or just want to say hi, I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Phone</h4>
                    <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '500' }}>+201027852645</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Location</h4>
                    <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '500' }}>Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div>
              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#fff' }}
                >
                  <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: focused === 'name' ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s' }}
                      value={formData.Name}
                      onChange={e => setFormData({ ...formData, Name: e.target.value })}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="Your Email"
                      style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: focused === 'email' ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s' }}
                      value={formData.Email}
                      onChange={e => setFormData({ ...formData, Email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: focused === 'phone' ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s' }}
                      value={formData.Phone}
                      onChange={e => setFormData({ ...formData, Phone: e.target.value })}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <textarea
                      placeholder="Tell me about your project..."
                      style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: focused === 'message' ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s', resize: 'vertical' }}
                      rows="5"
                      value={formData.Message}
                      onChange={e => setFormData({ ...formData, Message: e.target.value })}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                      required
                    ></textarea>
                  </div>

                  {status === 'error' && <p style={{ color: 'var(--accent-red)', textAlign: 'center', margin: 0 }}>Failed to send message. Please try again.</p>}

                  <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '0.5rem', borderRadius: '12px' }} disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* --- Custom Cinematic Cursor Component --- */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.style.cursor === 'pointer' ||
        target.classList.contains('btn-primary') ||
        target.classList.contains('btn-secondary') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      if (isInteractive) {
        setHovered(true);
      }
    };

    const onMouseOut = () => {
      setHovered(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  if (isMobile) return null;

  return (
    <div className={hovered ? "custom-cursor-hover" : ""}>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </div>
  );
};

export default PublicPortfolio;
