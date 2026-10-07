import React from 'react';

export default function AdminPanitiaDPMonitoring({ dps = [] }) {
  const defaultDps = [
    { id: 1, name: 'DP 1 - Pengecekan Dokumen', activeCount: 1, queueCount: 2, status: 'RUNNING' },
    { id: 2, name: 'DP 2 - Photoshoot Resmi', activeCount: 1, queueCount: 1, status: 'RUNNING' },
    { id: 3, name: 'DP 3 - Persiapan & Pemanasan', activeCount: 1, queueCount: 0, status: 'AVAILABLE' },
    { id: 4, name: 'DP 4 - Panggung Penampilan', activeCount: 1, queueCount: 0, status: 'PERFORMING' },
  ];

  const items = dps.length > 0 ? dps : defaultDps;

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
            Monitoring Alur Pos DP Hari H
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Perpindahan otomatis dengan proteksi kapasitas: Maksimal 1 tim aktif per pos.
          </p>
        </div>
        <span
          style={{
            backgroundColor: 'var(--pub-teal-light)',
            color: 'var(--pub-teal)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--pub-radius-pill)',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          LIVE MONITORING
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {items.map((dp) => (
          <div
            key={dp.id}
            style={{
              backgroundColor: 'var(--pub-canvas)',
              border: '1px solid var(--pub-line)',
              borderTop: `4px solid ${dp.activeCount >= 1 ? 'var(--pub-coral)' : 'var(--pub-teal)'}`,
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-ink)' }}>POS 0{dp.id}</span>
              <span
                style={{
                  backgroundColor: 'var(--pub-surface)',
                  color: 'var(--pub-ink-soft)',
                  border: '1px solid var(--pub-line)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
                KAPASITAS: 1 TIM
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pub-ink)', margin: '0.4rem 0' }}>
              {dp.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--pub-line)' }}>
              <span style={{ color: 'var(--pub-muted)' }}>Aktif di Pos:</span>
              <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>{dp.activeCount} Tim</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--pub-muted)' }}>Antrean Menunggu:</span>
              <span className="tabular-nums" style={{ fontWeight: 600, color: dp.queueCount > 0 ? 'var(--pub-coral)' : 'var(--pub-muted)' }}>
                {dp.queueCount} Tim
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
