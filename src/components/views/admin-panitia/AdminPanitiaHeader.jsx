import React from 'react';
import { Radio } from 'lucide-react';

export default function AdminPanitiaHeader({
  eventName = 'LKBB Nasional Paskibra 2026',
  eventSlug = 'LKBB-2026-NASIONAL',
  eventLocation = 'GOR Remaja Jakarta Timur',
  eventDate = '15 November 2026',
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.75rem 2rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              backgroundColor: 'var(--pub-teal-light)',
              color: 'var(--pub-teal)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}
          >
            FASE: REGISTRASI & SETUP
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
            {eventSlug}
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            margin: '0 0 0.35rem 0',
            color: 'var(--pub-ink)',
          }}
        >
          {eventName}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', margin: 0 }}>
          {eventLocation} · {eventDate} · Kapasitas Pos: 1 Tim per Pos
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="pub-btn-coral" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
          <Radio size={15} />
          <span>Mulai Live Hari H</span>
        </button>
      </div>
    </div>
  );
}
