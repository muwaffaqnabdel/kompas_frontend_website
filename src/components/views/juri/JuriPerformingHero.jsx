import React from 'react';

export default function JuriPerformingHero({
  teamName = 'PASKIBRA GARUDA SAKTI — SMAN 1 Jakarta',
  teamOrder = '01',
  judgeName = 'Mayor TNI (Purn) Hendra Wijaya',
  totalScore = 350,
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem 1.75rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span
            style={{
              backgroundColor: 'var(--pub-coral-pale)',
              color: 'var(--pub-coral)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}
          >
            SEDANG TAMPIL DI LAPANGAN
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
            Nomor Urut {teamOrder}
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            margin: '0 0 0.25rem 0',
            color: 'var(--pub-ink)',
          }}
        >
          {teamName}
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
          Juri Penilai: <strong style={{ color: 'var(--pub-ink)' }}>{judgeName}</strong>
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
          Total Nilai Sementara
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--pub-coral)',
            lineHeight: 1,
            marginTop: '0.2rem',
          }}
        >
          {totalScore}
        </div>
      </div>
    </div>
  );
}
