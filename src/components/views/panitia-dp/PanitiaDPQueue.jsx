import React from 'react';

export default function PanitiaDPQueue({ queueItems = [] }) {
  const defaultQueue = [
    {
      order: '02',
      teamName: 'PASKIBRA WIJAYA KUSUMA',
      school: 'SMAN 28 Jakarta',
      members: 16,
      status: 'WAITING',
    },
    {
      order: '03',
      teamName: 'PASKIBRA PATRIOT 70',
      school: 'SMAN 70 Jakarta',
      members: 16,
      status: 'STANDBY',
    },
  ];

  const items = queueItems.length > 0 ? queueItems : defaultQueue;

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
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 0.85rem 0' }}>
        Antrean Menunggu Masuk ke DP 1
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((team, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.85rem 1.15rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pub-ink)' }}>
                {team.order} — {team.teamName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                {team.school} · {team.members} Pasukan
              </div>
            </div>
            <span
              style={{
                backgroundColor: team.status === 'WAITING' ? '#FEF3C7' : 'var(--pub-sand)',
                color: team.status === 'WAITING' ? 'var(--pub-amber)' : 'var(--pub-muted)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {team.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
