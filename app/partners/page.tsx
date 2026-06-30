import Link from 'next/link';
import MobileMenu from '../../components/MobileMenu';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Partners | Spaceborn',
  description: 'Become an OEM / ODM partner with Spaceborn.',
};

export default function PartnersPage() {
  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar">
          <Link href="/" className="logo" aria-label="Spaceborn home">
            <img src="https://res.cloudinary.com/dq9x4mk1y/image/upload/v1782734333/spaceborn_assets/spaceborn-transparent-logo.png" alt="Spaceborn Logo" />
          </Link>
          <ul className="nav-links">
            <li><Link href="/#platforms">PLATFORMS</Link></li>
            <li><Link href="/#simulation">SIMULATION</Link></li>
            <li><Link href="/#systems">SYSTEMS</Link></li>
            <li><Link href="/#thoth">THOTH</Link></li>
            <li><a href="https://khonsu.in" target="_blank" rel="noopener noreferrer">KHONSU</a></li>
            <li><Link href="/#simulators-hub">COMPANY</Link></li>
          </ul>
          <Link href="/#releases" className="btn font-mono desktop-only">UPCOMING RELEASES →</Link>
          <MobileMenu />
        </nav>
      </header>

      <main>
        {/* Partners Hero Section */}
        <section className="partners-hero">
          <h1 className="partners-title font-ethno">
            BECOME AN <br className="mob-br" />OEM/ODM <br className="mob-br" />PARTNER
          </h1>
          <p className="partners-desc font-inter">
            Spaceborn collaborates with manufacturers, technology providers, and engineering organizations to accelerate the
            development of next-generation autonomous systems. Through our OEM and ODM partnership programs, organizations
            can integrate, customize, and deploy Spaceborn technologies across a wide range of industries and applications.
          </p>
          <p className="partners-desc font-inter">
            Whether you're building drones, robotics platforms, intelligent sensors, or specialized autonomous solutions, we work
            closely with partners to transform ambitious ideas into production-ready systems.
          </p>

          <div className="partners-ctas-grid">
            <div className="partner-cta-box">
              <span className="partner-cta-label font-inter">Interested in building with Spaceborn?</span>
              <a href="#contact" className="btn font-mono">
                BECOME A PARTNER
              </a>
            </div>

            <div className="partner-cta-box">
              <span className="partner-cta-label font-inter">Already a partner?</span>
              <a href="#login" className="btn font-mono">
                PARTNER LOGIN
              </a>
            </div>
          </div>
        </section>

        {/* Footer Overlay */}
        <Footer isHome={false} />
      </main>
    </>
  );
}
