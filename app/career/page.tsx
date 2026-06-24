import Link from 'next/link';
import MobileMenu from '../../components/MobileMenu';

export const metadata = {
  title: 'Careers | Spaceborn',
  description: "Join Spaceborn and build the systems of autonomy.",
};

export default function CareerPage() {
  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar">
          <Link href="/" className="logo" aria-label="Spaceborn home">
            <img src="/assets/spaceborn-transparent-logo.png" alt="Spaceborn Logo" />
          </Link>
          <ul className="nav-links">
            <li><Link href="/#platforms">PLATFORMS</Link></li>
            <li><Link href="/#simulation">SIMULATION</Link></li>
            <li><Link href="/#systems">SYSTEMS</Link></li>
            <li><Link href="/#thoth">THOTH</Link></li>
            <li><Link href="/#khonsu">KHONSU</Link></li>
            <li><Link href="/#simulators-hub">COMPANY</Link></li>
          </ul>
          <Link href="/#releases" className="btn font-mono desktop-only">UPCOMING RELEASES →</Link>
          <MobileMenu isCareer={true} />
        </nav>
      </header>

      <main>
        {/* Section 1: Hero / Search Console */}
        <section className="career-hero">
          <h1 className="career-title font-ethno">
            BUILD THE <br className="mob-br" />FUTURE <span className="desktop-only"><br />OF AUTONOMY</span><span className="mobile-only">OF <br />AUTONOMY</span>
          </h1>
          <p className="career-desc font-inter">
            Spaceborn is looking for engineers, builders, researchers, and problem-solvers ready to
            develop the next generation of autonomous intelligence. Together, we're building the
            systems that will power intelligent machines across Earth, air, and beyond.
          </p>

          <div className="search-console desktop-only">
            <input type="text" className="search-input" placeholder="" aria-label="Job title or keywords" />
            <input type="text" className="search-input" placeholder="" aria-label="Location or department" />
            <button className="search-btn" type="button">SEARCH</button>
          </div>

          <div className="search-sub-links font-mono desktop-only">
            <a href="#openings">VIEW ALL OPENINGS</a>
            <a href="#internships">INTERNSHIPS</a>
          </div>

          <div className="mobile-only" style={{ marginTop: '40px' }}>
            <a href="#internships" className="btn font-mono">
              INTERNSHIPS
            </a>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Section 2: Shape the Age / Aligning Human Intent */}
        <section className="career-section-2">
          <div className="section-content">
            {/* Desktop content */}
            <div className="desktop-only">
              <h2 className="career-title font-ethno">
                SHAPE THE AGE<br />OF AUTONOMY
              </h2>
              <p className="career-desc font-inter">
                Autonomy is more than a technology. It is a new era of engineering.
                At Spaceborn, we are building the systems, intelligence, and
                infrastructure that will power the next generation of autonomous
                machines. The challenges are difficult. The impact is real.
              </p>
            </div>

            {/* Mobile content */}
            <div className="mobile-only" style={{ width: '100%' }}>
              <h2 className="career-title font-ethno">
                ALIGNING HUMAN <br className="mob-br" />INTENT WITH <br className="mob-br" />ROBOT ACTION
              </h2>
              <p className="career-desc font-inter">
                We believe a future where anyone can work with autonomous systems through natural conversation is fundamentally more powerful than one where only engineers can.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider-line" />

        {/* Section 3: Quote Block */}
        <section className="career-section-3">
          <p className="career-quote font-inter">
            We believe a future where autonomous systems understand human intent
            is fundamentally better than one where humans must adapt to machines.
          </p>
          <span className="career-author font-inter">- Adarsh Kumar</span>
          <a href="#contact" className="btn font-mono">
            FIND YOUR CAREER
          </a>
        </section>

        {/* Footer Overlay */}
        <footer className="simulators-scroll-section footer-wrapper-responsive">
          <div className="footer-fixed" style={{ borderTop: 'none' }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin-link" aria-label="Spaceborn LinkedIn">
              <img src="/assets/linkedin-icon.png" alt="LinkedIn Logo" />
            </a>

            <ul className="footer-nav">
              <li><Link href="/career">CAREERS</Link></li>
              <li><Link href="/#releases">UPDATES</Link></li>
              <li><a href="#">PRIVACY POLICY</a></li>
              <li><Link href="/partners">PARTNERS</Link></li>
            </ul>

            <span className="footer-copyright">
              COPYRIGHT © 2026 SPACEBORN
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
