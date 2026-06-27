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
  imageMobile?: string;
  video?: string;
};

const simulators: SimulatorData[] = [
  {
    id: 'sitl-kernel',
    num: 'SIM 01',
    title: 'ANSA-SITL KERNEL SIMULATOR',
    desc: 'The digital heartbeat of ANSA. Every decision, every control loop, and every autonomous action begins here before reaching the real world.',
    cta: 'ENTER THE CORE',
    image: '/assets/sitl_kernel_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-6.jpg',
    video: '/assets/ansa-sitl-kernel-gif.mp4',
  },
  {
    id: 'digital-twin',
    num: 'SIM 02',
    title: 'ANSA DIGITAL TWIN SIMULATOR',
    desc: 'Build it once. Fly it a thousand times. A living digital replica where systems are tested, broken, and perfected before a single component is manufactured.',
    cta: 'EXPLORE THE DIGITAL TWIN',
    image: '/assets/ansa-digital-twin.jpg',
    imageMobile: '/assets/mobile/asset-7.jpg',
    video: '/assets/digital-twin-gif.mp4',
  },
  {
    id: 'fault-failure',
    num: 'SIM 03',
    title: 'FAULT & FAILURE SCENARIO SIMULATOR',
    desc: "Failure isn't avoided. It's engineered for. Push autonomous systems through catastrophic scenarios and prove they can survive when everything goes wrong.",
    cta: 'TEST THE LIMITS',
    image: '/assets/fault_failure_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-8.jpg',
  },
  {
    id: 'gps-denied',
    num: 'SIM 04',
    title: 'GPS-DENIED NAVIGATION SIMULATOR',
    desc: 'When satellites disappear, autonomy takes over. Train intelligent systems to navigate confidently through urban canyons, tunnels, and contested environments.',
    cta: 'ENTER DENIED TERRITORY',
    image: '/assets/gps_denied_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-9.jpg',
  },
  {
    id: 'swarm-fleet',
    num: 'SIM 05',
    title: 'SWARM & FLEET SIMULATOR',
    desc: 'One vehicle is impressive. One hundred moving as a single intelligence changes everything. Validate coordinated autonomy at fleet scale.',
    cta: 'COMMAND THE SWARM',
    image: '/assets/swarm_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-10.jpg',
  },
  {
    id: 'lidar-depth',
    num: 'SIM 06',
    title: 'LiDAR & DEPTH PERCEPTION SIMULATOR',
    desc: 'Teach machines to see the world in three dimensions. Generate massive volumes of spatial intelligence for mapping, navigation, and next-generation perception systems.',
    cta: 'EXPLORE MACHINE PERCEPTION',
    image: '/assets/lidar-sim-new.jpg',
    imageMobile: '/assets/mobile/asset-11.jpg',
  },
  {
    id: 'khonsu-space',
    num: 'SIM 07',
    title: 'KHONSU SPACE SIMULATOR',
    desc: 'Built for the environments where human control becomes impossible. Validate autonomous systems across orbital operations, lunar missions, and the future of deep-space exploration.',
    cta: 'EXPLORE BEYOND EARTH',
    image: '/assets/khonshu-space-simulator-img.jpg',
    imageMobile: '/assets/mobile/asset-12.jpg',
    video: '/assets/khonshu-space-simulator-gif.mp4',
  },
  {
    id: 'telemetry-anomaly',
    num: 'SIM 08',
    title: 'TELEMETRY ANOMALY SIMULATOR',
    desc: 'The difference between a mission and a failure is knowing what happens next. Train AI systems to identify anomalies before they become critical events.',
    cta: 'PREDICT THE UNEXPECTED',
    image: '/assets/telemetry_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-13.jpg',
  },
  {
    id: 'hal-portability',
    num: 'SIM 09',
    title: 'HAL PORTABILITY EMULATOR',
    desc: 'One intelligence. Infinite hardware. Certify autonomous systems across platforms without rewriting the software that powers them.',
    cta: 'VALIDATE COMPATIBILITY',
    image: '/assets/hal_portability_simulator_img.jpg',
    imageMobile: '/assets/mobile/asset-14.jpg',
  },
];

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('releases');

  const containerRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const systemsVideoRef = useRef<HTMLVideoElement>(null);
  const simVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleToggleSound = () => {
    setIsHeroMuted((prev) => !prev);
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

  // Intersection Observer to track active section / simulator panel
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // 50% visibility
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe vertical pages
    const verticalPages = ['releases', 'platforms', 'simulation', 'systems', 'thoth'];
    verticalPages.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Observe individual simulator panels inside the horizontal scroll
    simulators.forEach((sim) => {
      const el = document.getElementById(`sim-${sim.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Synchronize audio and video mute/play states based on active section and global mute state
  useEffect(() => {
    const isMuted = isHeroMuted;

    // 1. Hero Page 1 (id="releases")
    const heroVideo = heroVideoRef.current;
    const heroAudio = audioRef.current;
    const isHeroActive = activeSection === 'releases';
    const heroMute = isMuted || !isHeroActive;

    if (heroVideo) {
      heroVideo.muted = heroMute;
      if (!heroMute) {
        heroVideo.play().catch((err) => console.log("Hero video play failed:", err));
      }
    }
    if (heroAudio) {
      heroAudio.muted = heroMute;
      if (!heroMute) {
        heroAudio.play().catch((err) => console.log("Hero audio play failed:", err));
      } else {
        heroAudio.pause();
      }
    }

    // 2. Page 2 (id="platforms") - keep current behavior (always muted)
    // This is handled by having muted={true} on the Page 2 video elements in JSX.

    // 3. Page 4 Systems (id="systems")
    const systemsVideo = systemsVideoRef.current;
    const isSystemsActive = activeSection === 'systems';
    const systemsMute = isMuted || !isSystemsActive;

    if (systemsVideo) {
      systemsVideo.muted = systemsMute;
      if (!systemsMute) {
        systemsVideo.play().catch((err) => console.log("Systems video play failed:", err));
      }
    }

    // 4. Simulator panels
    simulators.forEach((sim) => {
      const simVideo = simVideoRefs.current[sim.id];
      if (simVideo) {
        const isSimActive = activeSection === `sim-${sim.id}`;
        const simMute = isMuted || !isSimActive;
        simVideo.muted = simMute;
        if (!simMute) {
          simVideo.play().catch((err) => console.log(`Sim ${sim.id} video play failed:`, err));
        }
      }
    });
  }, [activeSection, isHeroMuted]);

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
              <source media="(max-width: 1100px)" src="/assets/mobile/asset-1.mp4" type="video/mp4" />
              <source src="/assets/spaceborn-hero-GIF.mp4" type="video/mp4" />
            </video>
            <audio 
              ref={audioRef}
              loop
              preload="auto"
            >
              <source media="(max-width: 1100px)" src="/assets/mobile/asset-1.mp3" type="audio/mp3" />
              <source src="/assets/spaceborn-hero-GIF-audio.mp3" type="audio/mp3" />
            </audio>
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

        <div className="section-merge-boundary" />

        {/* Page 2: Aligning Human Intent */}
        <section className="landing-section section-left" id="platforms">

          <div className="video-background-container desktop-only">
            <video autoPlay muted loop playsInline className="video-background">
              <source src="/assets/robot-intent-section-two-vid.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
          </div>
          <div className="video-background-container mobile-only">
            <video autoPlay muted loop playsInline className="video-background">
              <source src="/assets/mobile/asset-2.mp4" type="video/mp4" />
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

        <div className="section-merge-boundary" />

        {/* Page 3: Making Autonomy Human-Centric */}
        <section className="landing-section section-right" id="simulation">

          <div className="image-background-container">
            <img src="/assets/explore-ansa-img.jpg" alt="Making Autonomy Human-Centric" className="image-background explore-ansa-bg desktop-only" />
            <img src="/assets/mobile/asset-3.jpg" alt="Making Autonomy Human-Centric" className="image-background explore-ansa-bg mobile-only" />
            <div className="overlay-right-dark" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              MAKING <br className="mob-br" />AUTONOMY <br />
              HUMAN-CENTRIC
            </h2>
            <p className="section-body desktop-only">
              ANSA is a complete autonomous intelligence platform designed to <br />
              enable robots and drones to understand human intent, navigate complex <br />
              environments, and execute missions with minimal human intervention.
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

        <div className="section-merge-boundary" />

        {/* Page 4: Building the Systems of Autonomy */}
        <section className="landing-section section-left" id="systems">

          <div className="video-background-container">
            <video 
              ref={systemsVideoRef}
              autoPlay 
              muted={isHeroMuted} 
              loop 
              playsInline 
              className="video-background"
            >
              <source src="/assets/flight-controller-gif.mp4" type="video/mp4" />
            </video>
            <div className="overlay-left-dark" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              BUILDING THE <br />
              SYSTEMS <br className="mob-br" />OF <br />
              AUTONOMY
            </h2>
            <p className="section-body desktop-only">
              Spaceborn develops flight controllers, autonomous intelligence <br />
              platforms, and next-generation robotic systems designed to power the <br />
              future of autonomous flight, ground mobility, and intelligent machines.
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

        <div className="section-merge-boundary" />

        {/* Page 5: Putting Humans at the Center */}
        <section className="landing-section section-right" id="thoth">
          <div className="image-background-container">
            <img src="/assets/join-our-mission-section-img.jpg" alt="Join Our Mission" className="image-background join-mission-bg desktop-only" />
            <img src="/assets/mobile/asset-5.jpg" alt="Join Our Mission" className="image-background join-mission-bg mobile-only" />
          </div>
          <div className="section-content">
            <h2 className="section-title">
              PUTTING HUMANS<br />
              AT THE CENTER<br />
              OF AUTONOMY
            </h2>
            <p className="section-body desktop-only">
              Spaceborn was founded on the belief that robots should adapt to humans, not the<br />
              other way around. We are building the intelligence layer that enables autonomous<br />
              systems to understand human intent and act with confidence in the real world.
            </p>
            <p className="section-body mobile-only">
              Spaceborn was founded on the belief that robots should adapt to humans, not the<br />
              other way around. We are building the intelligence layer that enables autonomous<br />
              systems to understand context and act with confidence in the real world.
            </p>

            <a href="#simulators-hub" className="btn font-mono">
              join the mission
            </a>
          </div>
        </section>

        <div className="section-merge-boundary" />

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
                style={
                  sim.image 
                    ? { 
                        '--bg-image': `url(${sim.image})`,
                        '--bg-image-mobile': `url(${sim.imageMobile || sim.image})`
                      } as React.CSSProperties 
                    : undefined
                }
              >
                {sim.video && (
                  <div className="video-background-container">
                    <video 
                      ref={(el) => {
                        simVideoRefs.current[sim.id] = el;
                      }}
                      autoPlay 
                      muted={isHeroMuted} 
                      loop 
                      playsInline 
                      className="video-background"
                    >
                      <source src={sim.video} type="video/mp4" />
                    </video>
                    <div className="video-overlay" />
                  </div>
                )}
                <div className="sim-content" style={{ position: 'relative', zIndex: 2 }}>
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
