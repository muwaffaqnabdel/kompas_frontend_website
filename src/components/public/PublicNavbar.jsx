import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function PublicNavbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', path: '/platform' },
    { label: 'Cara Kerja', path: '/cara-kerja' },
    { label: 'Event', path: '/event' },
    { label: 'Untuk Penyelenggara', path: '/untuk-penyelenggara' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.25s ease',
        backgroundColor: scrolled ? 'rgba(247, 245, 240, 0.94)' : 'var(--pub-canvas)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--pub-line)' : '1px solid transparent',
      }}
    >
      <div className="pub-container" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--pub-coral)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(201, 75, 60, 0.3)',
            }}
          >
            <Shield size={19} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--pub-ink)',
            }}
          >
            KOMPAS<span style={{ color: 'var(--pub-coral)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="pub-desktop-nav">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--pub-coral)' : 'var(--pub-ink-soft)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  position: 'relative',
                  padding: '0.25rem 0',
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--pub-coral)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="pub-desktop-cta">
          <Link
            to="/login"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--pub-ink)',
              textDecoration: 'none',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--pub-radius-pill)',
              transition: 'background-color 0.15s ease',
            }}
          >
            Masuk
          </Link>

          <Link to="/event" className="pub-btn-coral" style={{ fontSize: '0.875rem', padding: '0.55rem 1.25rem' }}>
            <span>Lihat Event</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="pub-mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--pub-ink)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--pub-canvas)',
            borderBottom: '1px solid var(--pub-line)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: location.pathname === item.path ? 'var(--pub-coral)' : 'var(--pub-ink)',
                textDecoration: 'none',
                padding: '0.5rem 0',
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--pub-line)', margin: '0.5rem 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="pub-btn-outline"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Masuk ke Akun
            </Link>
            <Link
              to="/event"
              onClick={() => setMobileMenuOpen(false)}
              className="pub-btn-coral"
              style={{ width: '100%', textAlign: 'center' }}
            >
              <span>Lihat Event Lomba</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Inline styles for responsive toggling */}
      <style>{`
        @media (min-width: 900px) {
          .pub-desktop-nav { display: flex !important; }
          .pub-desktop-cta { display: flex !important; }
          .pub-mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
