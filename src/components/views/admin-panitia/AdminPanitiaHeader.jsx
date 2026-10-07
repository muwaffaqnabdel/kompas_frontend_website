import React from 'react';
import { Radio, Sparkles } from 'lucide-react';
import { getStoredPublicEvents } from '../../../data/publicEvents';

export default function AdminPanitiaHeader({
  eventId = 'lkbb-nasional-2026',
  activeSection = 'settings',
  onSelectSection,
}) {
  const events = getStoredPublicEvents();
  const currentEvent = events.find((e) => e.id === eventId || e.slug === eventId) || events[0];

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span
            style={{
              backgroundColor: 'var(--pub-teal-light)',
              color: 'var(--pub-teal)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
            }}
          >
            FASE: REGISTRASI & SETUP
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
            {currentEvent?.slug || 'LKBB-2026-NASIONAL'}
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            margin: '0 0 0.25rem 0',
            color: 'var(--pub-ink)',
          }}
        >
          {currentEvent?.title || 'LKBB Nasional Paskibra 2026'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', margin: 0 }}>
          {currentEvent?.location || 'GOR Remaja Jakarta Timur'} · {currentEvent?.date || '15 November 2026'} · Kuota: {currentEvent?.quota || '32 Tim'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {onSelectSection && (
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.25rem',
              borderRadius: 'var(--pub-radius-pill)',
              border: '1px solid var(--pub-line)',
            }}
          >
            <button
              onClick={() => onSelectSection('settings')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--pub-radius-pill)',
                border: 'none',
                backgroundColor: activeSection === 'settings' ? 'var(--pub-coral)' : 'transparent',
                color: activeSection === 'settings' ? '#FFFFFF' : 'var(--pub-ink)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Pengaturan Detail & Card
            </button>
            <button
              onClick={() => onSelectSection('operations')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--pub-radius-pill)',
                border: 'none',
                backgroundColor: activeSection === 'operations' ? 'var(--pub-coral)' : 'transparent',
                color: activeSection === 'operations' ? '#FFFFFF' : 'var(--pub-ink)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Kesiapan Hari H & Pos DP
            </button>
          </div>
        )}

        <button className="pub-btn-coral" style={{ padding: '0.55rem 1.15rem', fontSize: '0.825rem' }}>
          <Radio size={14} />
          <span>Mulai Live Hari H</span>
        </button>
      </div>
    </div>
  );
}

