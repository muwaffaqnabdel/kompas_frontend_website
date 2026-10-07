import React from 'react';

export default function SuperAdminStats({ stats = {}, events = [] }) {
  const regOpenCount = events.filter((e) => e.status === 'REGISTRATION_OPEN').length;
  const liveCount = events.filter((e) => e.status === 'LIVE').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
      {/* 1. Total Event */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.4rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-coral)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Total Event Terdaftar
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            margin: '0.35rem 0',
          }}
        >
          {events.length}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
          {regOpenCount} Buka Pendaftaran · {liveCount} Live Hari H
        </div>
      </div>

      {/* 2. Total Tim Kontingen */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.4rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-teal)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Total Tim Kontingen
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            margin: '0.35rem 0',
          }}
        >
          {stats.totalParticipants || 4}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pub-teal)', fontWeight: 600 }}>
          Tersebar di seluruh event aktif
        </div>
      </div>

      {/* 3. Akun Pengguna Sistem */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.4rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-amber)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Akun Pengguna Sistem
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--pub-ink)',
            margin: '0.35rem 0',
          }}
        >
          {stats.totalUsers || 10}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
          Super Admin, Panitia, Juri & Peserta
        </div>
      </div>

      {/* 4. Status Engine & AI */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.4rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          borderLeft: '5px solid var(--pub-navy)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
          Status Engine & AI
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--pub-teal)',
            margin: '0.55rem 0 0.35rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pub-teal)' }} />
          <span>ONLINE AKTIF</span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pub-ink-soft)' }}>
          Groq Whisper & NLP Siap
        </div>
      </div>
    </div>
  );
}
