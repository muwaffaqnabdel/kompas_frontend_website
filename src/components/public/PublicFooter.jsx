import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUpRight, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--pub-navy)',
        color: '#F8FAFC',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="pub-container">
        {/* Main Grid Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--pub-coral)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={18} strokeWidth={2.4} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                KOMPAS<span style={{ color: 'var(--pub-coral)' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Platform terintegrasi untuk membantu penyelenggara menjalankan kompetisi Paskibra dengan lebih rapi, transparan, dan terkendali—dari pendaftaran sampai hasil akhir.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#CBD5E1', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.3rem 0.65rem', borderRadius: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/platform" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Overview Fitur
                </Link>
              </li>
              <li>
                <Link to="/cara-kerja" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Alur 4 Pos DP (Atomic Lock)
                </Link>
              </li>
              <li>
                <Link to="/platform" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Scoring Sheet & AI Feedback
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#F87171', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Buka Dashboard Operasional</span>
                  <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Event & Peserta Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
              Event & Peserta
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/event" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Katalog Lomba Aktif
                </Link>
              </li>
              <li>
                <Link to="/event/lkbb-nasional-2026" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  LKBB Nasional 2026
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Panduan Pendaftaran & Berkas
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Portal Kontingen Sekolah
                </Link>
              </li>
            </ul>
          </div>

          {/* Penyelenggara & Kontak Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
              Untuk Penyelenggara
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/untuk-penyelenggara" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Mulai Selenggarakan Lomba
                </Link>
              </li>
              <li>
                <Link to="/untuk-penyelenggara" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Konsultasi Konfigurasi Pos DP
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
              <li>
                <a href="mailto:halo@kompas.id" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s ease' }}>
                  halo@kompas.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748B',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} KOMPAS. Platform Manajemen Kompetisi Paskibra Indonesia.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#64748B' }}>Kebijakan Privasi</span>
            <span style={{ color: '#64748B' }}>Syarat & Ketentuan</span>
            <Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Akses Internal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
