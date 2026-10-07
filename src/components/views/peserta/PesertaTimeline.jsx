import React from 'react';

export default function PesertaTimeline({ steps = [] }) {
  const defaultSteps = [
    { title: 'Pendaftaran Tim', status: 'COMPLETED' },
    { title: 'Validasi Berkas', status: 'COMPLETED' },
    { title: 'Technical Meeting', status: 'CURRENT' },
    { title: 'Jadwal Tampil', status: 'UPCOMING' },
    { title: 'Penampilan Hari H', status: 'UPCOMING' },
    { title: 'Hasil & Evaluasi Juri', status: 'UPCOMING' },
  ];

  const items = steps.length > 0 ? steps : defaultSteps;

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
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 1.25rem 0' }}>
        Tahapan Perjalanan Lomba Pasukan
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', padding: '0.5rem 0' }}>
        {items.map((st, idx) => {
          const isCompleted = st.status === 'COMPLETED';
          const isCurrent = st.status === 'CURRENT';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minWidth: '130px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? 'var(--pub-teal)' : isCurrent ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                  border: isCompleted || isCurrent ? 'none' : '1px solid var(--pub-line)',
                  color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--pub-muted)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  boxShadow: isCurrent ? 'var(--pub-shadow-hover)' : 'none',
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div
                style={{
                  fontSize: '0.775rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? 'var(--pub-coral)' : 'var(--pub-ink)',
                }}
              >
                {st.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                {isCompleted ? 'Selesai' : isCurrent ? 'Tahap Aktif' : 'Menunggu'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
