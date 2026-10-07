import React from 'react';

export default function PesertaHero({
  eventName = 'LKBB Nasional Paskibra 2026',
  regCode = 'REG-LKBB-2026-001',
  location = 'GOR Remaja Jakarta Timur',
  date = '15 November 2026',
  category = 'SMA/SMK Putra-Putri',
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
            STATUS: VALIDATED
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
            {regCode}
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
          {location} · Tanggal: {date} · Kategori: {category}
        </p>
      </div>

      <button className="pub-btn-coral" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
        Lihat Notulensi TM
      </button>
    </div>
  );
}
