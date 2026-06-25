'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import ResumeModal from './ResumeModal';
import Footer from './Footer';

type SimulatorData = {
  id: string;
  num: string;
  title: string;
  desc: string;
  cta: string;
  image?: string;
};

const simulators: SimulatorData[] = [
  {
    id: 'sitl-kernel',
    num: 'SIM 01',
    title: 'ANSA-SITL KERNEL SIMULATOR',
    desc: 'The digital heartbeat of ANSA. Every decision, every control loop, and every autonomous action begins here before reaching the real world.',
    cta: 'ENTER THE CORE',
    image: '/assets/sitl_kernel_simulator_img.jpg',
  },
  {
    id: 'digital-twin',
    num: 'SIM 02',
    title: 'ANSA DIGITAL TWIN SIMULATOR',
    desc: 'Build it once. Fly it a thousand times. A living digital replica where systems are tested, broken, and perfected before a single component is manufactured.',
    cta: 'EXPLORE THE DIGITAL TWIN',
  },
  {
    id: 'fault-failure',
    num: 'SIM 03',
    title: 'FAULT & FAILURE SCENARIO SIMULATOR',
    desc: "Failure isn't avoided. It's engineered for. Push autonomous systems through catastrophic scenarios and prove they can survive when everything goes wrong.",
    cta: 'TEST THE LIMITS',
    image: '/assets/fault_failure_simulator_img.jpg',
  },
  {
    id: 'gps-denied',
    num: 'SIM 04',
    title: 'GPS-DENIED NAVIGATION SIMULATOR',
    desc: 'When satellites disappear, autonomy takes over. Train intelligent systems to navigate confidently through urban canyons, tunnels, and contested environments.',
    cta: 'ENTER DENIED TERRITORY',
    image: '/assets/gps_denied_simulator_img.jpg',
  },
  {
    id: 'swarm-fleet',
    num: 'SIM 05',
    title: 'SWARM & FLEET SIMULATOR',
    desc: 'One vehicle is impressive. One hundred moving as a single intelligence changes everything. Validate coordinated autonomy at fleet scale.',
    cta: 'COMMAND THE SWARM',
    image: '/assets/swarm_simulator_img.jpg',
  },
  {
    id: 'lidar-depth',
    num: 'SIM 06',
    title: 'LiDAR & DEPTH PERCEPTION SIMULATOR',
    desc: 'Teach machines to see the world in three dimensions. Generate massive volumes of spatial intelligence for mapping, navigation, and next-generation perception systems.',
    cta: 'EXPLORE MACHINE PERCEPTION',
  },
  {
    id: 'khonsu-space',
    num: 'SIM 07',
    title: 'KHONSU SPACE SIMULATOR',
    desc: 'Built for the environments where human control becomes impossible. Validate autonomous systems across orbital operations, lunar missions, and the future of deep-space exploration.',
    cta: 'EXPLORE BEYOND EARTH',
  },
  {
    id: 'telemetry-anomaly',
    num: 'SIM 08',
    title: 'TELEMETRY ANOMALY SIMULATOR',
    desc: 'The difference between a mission and a failure is knowing what happens next. Train AI systems to identify anomalies before they become critical events.',
    cta: 'PREDICT THE UNEXPECTED',
    image: '/assets/telemetry_simulator_img.jpg',
  },
  {
    id: 'hal-portability',
    num: 'SIM 09',
    title: 'HAL PORTABILITY EMULATOR',
    desc: 'One intelligence. Infinite hardware. Certify autonomous systems across platforms without rewriting the software that powers them.',
    cta: 'VALIDATE COMPATIBILITY',
    image: '/assets/hal_portability_simulator_img.jpg',
  },
];

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleToggleSound = () => {
    const video = heroVideoRef.current;
    const audio = audioRef.current;
    const nextMuted = !isHeroMuted;
    
    setIsHeroMuted(nextMuted);
    
    if (video) {
      video.muted = nextMuted;
      video.play().catch((err) => console.log("Play failed on sound toggle:", err));
    }
    
    if (audio) {
      audio.muted = nextMuted;
      if (!nextMuted) {
        audio.play().catch((err) => console.log("Audio play failed:", err));
      } else {
        audio.pause();
      }
    }
  };

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    // Start muted to ensure autoplay is allowed on all browsers
    video.muted = true;
    setIsHeroMuted(true);

    video.play().catch((error) => {
      console.log("Muted autoplay blocked initially:", error);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Subtle horizontal peek animation on mount to guide the user
    const timer = setTimeout(() => {
      container.scrollTo({ left: 80, behavior: 'smooth' });
      const timerBack = setTimeout(() => {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      }, 700);
      return () => clearTimeout(timerBack);
    }, 1200);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handlePrev = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar">
          <Link href="/" className="logo" aria-label="Spaceborn home">
            <img src="/assets/spaceborn-transparent-logo.png" alt="Spaceborn Logo" />
          </Link>
          <ul className="nav-links">
            <li><a href="#platforms">PLATFORMS</a></li>
            <li><a href="#simulation">SIMULATION</a></li>
            <li><a href="#systems">SYSTEMS</a></li>
            <li><a href="#thoth">THOTH</a></li>
            <li><a href="https://khonsu.in" target="_blank" rel="noopener noreferrer">KHONSU</a></li>
            <li><a href="#simulators-hub">COMPANY</a></li>
          </ul>
          <a href="#releases" className="btn font-mono desktop-only">UPCOMING RELEASES →</a>
          <MobileMenu />
        </nav>
      </header>

      <main>
        {/* Page 1: Hero */}
        <section className="landing-section section-left" id="releases">
          <div className="video-background-container">
            <video 
              ref={heroVideoRef}
              autoPlay 
              muted={isHeroMuted} 
              loop 
              playsInline 
              className="video-background"
            >
              <source src="/assets/spaceborn-hero-GIF.mp4" type="video/mp4" />
            </video>
            <audio 
              ref={audioRef}
              src="/assets/spaceborn-hero-GIF-audio.mp3"
              loop
              preload="auto"
            />
            <div className="video-overlay" />
          </div>
          <div className="section-content">
            <h1 className="section-title">
              CERTAINTY <br className="mob-br" />IS <br className="desk-br" />READY <br className="mob-br" />FOR FLIGHT
            </h1>
            <div className="hero-btn-group">
              <a href="#platforms" className="btn font-mono">
                explore
              </a>
              <button 
                onClick={() => setIsResumeModalOpen(true)} 
                className="btn font-mono btn-primary"
              >
                share your resume
              </button>
            </div>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Page 2: Aligning Human Intent */}
        <section className="landing-section section-left" id="platforms">
          <div className="video-background-container">
            <video autoPlay muted loop playsInline className="video-background">
              <source src="/assets/robot-intent-section-two-vid.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              ALIGNING HUMAN <br />
              INTENT WITH <br />
              ROBOT ACTION
            </h2>
            <p className="section-body desktop-only">
              We believe a future where anyone can work with autonomous <br className="desk-br" />
              systems through natural conversation is fundamentally <br className="desk-br" />
              more powerful than one where only engineers can.
            </p>
            <p className="section-body mobile-only">
              We believe a future where only the hot work is left to autonomous systems through robust collaboration that is inherently transparent for dynamic and open environments.
            </p>
            <a href="#simulation" className="btn font-mono desktop-only">
              read more
            </a>
            <a href="#simulation" className="btn font-mono mobile-only">
              SEE THE SYSTEM
            </a>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Page 3: Making Autonomy Human-Centric */}
        <section className="landing-section section-right" id="simulation">
          <div className="section-content">
            <h2 className="section-title">
              MAKING <br className="mob-br" />AUTONOMY <br className="mob-br" /><br className="desk-br" />HUMAN-CENTRIC
            </h2>
            <p className="section-body desktop-only">
              ANSA is a complete autonomous intelligence platform designed to enable robots and drones to understand human intent, navigate complex environments, and execute missions with minimal human intervention.
            </p>
            <p className="section-body mobile-only">
              Spaceborn is a complete autonomous intelligence platform designed to enable robots and drones to understand context, navigate complex environments, and seamlessly interact with teams of human operators.
            </p>
            <a href="#systems" className="btn font-mono desktop-only">
              Explore ANSA
            </a>
            <a href="#systems" className="btn font-mono mobile-only">
              EXPLORE ORCA
            </a>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Page 4: Building the Systems of Autonomy */}
        <section className="landing-section section-left" id="systems">
          <div className="video-background-container">
            <video autoPlay muted loop playsInline className="video-background">
              <source src="/assets/4TH_PAGE.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              BUILDING THE <br className="mob-br" />SYSTEMS <br className="desk-br" />OF <br className="mob-br" />AUTONOMY
            </h2>
            <p className="section-body desktop-only">
              Spaceborn develops flight controllers, autonomous intelligence platforms, and next-generation robotic systems designed to power the future of autonomous flight, ground mobility, and intelligent machines.
            </p>
            <p className="section-body mobile-only">
              Spaceborn develops flight software, autonomous intelligence platforms, and next generation robotic systems designed to pave the future of autonomous flight, space industry, and intelligent machines.
            </p>
            <a href="#thoth" className="btn font-mono desktop-only">
              book your system
            </a>
            <a href="#thoth" className="btn font-mono mobile-only">
              SEE THE SYSTEM
            </a>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Page 5: Putting Humans at the Center (Desktop) */}
        <section className="landing-section section-right desktop-only" id="thoth">
          <div className="image-background-container">
            <img src="/assets/join-our-mission-section-img.jpg" alt="Join Our Mission" className="image-background" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              PUTTING HUMANS AT THE<br />CENTER OF AUTONOMY
            </h2>
            <p className="section-body">
              Spaceborn was founded on the belief that robots should adapt to humans, not the other way around. We are building the intelligence layer that enables autonomous systems to understand human intent and act with confidence in the real world.
            </p>
            <a href="#simulators-hub" className="btn font-mono">
              join the mission
            </a>
          </div>
        </section>

        {/* Page 5: Putting Humans at the Center (Mobile - Context) */}
        <section className="landing-section section-left mobile-only" id="thoth">
          <div className="image-background-container">
            <img src="/assets/join-our-mission-section-img.jpg" alt="Join Our Mission" className="image-background" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              PUTTING <br className="mob-br" />HUMANS AT THE <br className="mob-br" />CENTER OF <br className="mob-br" />AUTONOMY
            </h2>
            <p className="section-body">
              Spaceborn was founded on the belief that robots should adapt to humans, not the other way around. We are building the intelligence layer that enables autonomous systems to understand context and act with confidence in the real world.
            </p>
            <a href="#khonsu" className="btn font-mono">
              SEE THE MISSION
            </a>
          </div>
        </section>

        <hr className="divider-line mobile-only" />

        {/* Page 6: Putting Humans at the Center (Mobile - Human Intent) */}
        <section className="landing-section section-left mobile-only" id="khonsu">
          <div className="image-background-container">
            <img src="/assets/join-our-mission-section-img.jpg" alt="Join Our Mission" className="image-background" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              PUTTING <br className="mob-br" />HUMANS AT THE <br className="mob-br" />CENTER OF <br className="mob-br" />AUTONOMY
            </h2>
            <p className="section-body">
              Spaceborn was founded on the belief that robots should adapt to humans, not the other way around. We are building the intelligence layer that enables autonomous systems to understand human intent and act with confidence in the real world.
            </p>
            <a href="#simulators-hub" className="btn font-mono">
              JOIN THE SYSTEM
            </a>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Page 6: Simulators Horizontal Scroll Container */}
        <section className="simulators-scroll-section" id="simulators-hub">
          <button 
            onClick={handlePrev}
            className={`sim-nav-btn sim-prev-btn ${scrollProgress <= 1 ? 'disabled' : ''}`}
            aria-label="Previous simulator"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className={`sim-nav-btn sim-next-btn ${scrollProgress >= 99 ? 'disabled' : ''}`}
            aria-label="Next simulator"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="simulators-scroll-container" ref={containerRef}>
            {simulators.map((sim) => (
              <div 
                key={sim.id} 
                className="simulator-panel" 
                id={`sim-${sim.id}`}
                style={sim.image ? { backgroundImage: `url(${sim.image})` } : undefined}
              >
                <div className="sim-content">
                  <h3 className="sim-title">{sim.title}</h3>
                  <p className="sim-desc">{sim.desc}</p>
                  <a href="#releases" className="btn font-mono">
                    {sim.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator-container">
            <span className="scroll-hint font-mono">SCROLL TO EXPLORE →</span>
            <div className="scroll-progress-wrapper">
              <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
            </div>
          </div>

          {/* Persistent Footer Overlay */}
          <Footer isHome={true} />
        </section>
      </main>

      {/* Global Sound Control */}
      <button 
        onClick={handleToggleSound} 
        className="global-sound-toggle"
        aria-label={isHeroMuted ? "Unmute background audio" : "Mute background audio"}
      >
        {isHeroMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <line x1="22" y1="9" x2="16" y2="15"/>
            <line x1="16" y1="9" x2="22" y2="15"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        )}
        <span className="sound-text font-mono">{isHeroMuted ? "SOUND OFF" : "SOUND ON"}</span>
      </button>

      {isResumeModalOpen && (
        <ResumeModal onClose={() => setIsResumeModalOpen(false)} />
      )}
    </>
  );
}
