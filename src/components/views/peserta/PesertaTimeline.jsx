import React from 'react';

export default function PesertaTimeline({ steps = [] }) {
  const defaultSteps = [
    { title: 'Pendaftaran Tim', date: '26 - 27 Oktober 2026', status: 'COMPLETED' },
    { title: 'Validasi Berkas', date: '28 - 30 Oktober 2026', status: 'COMPLETED' },
    { title: 'Technical Meeting', date: '08 November 2026', status: 'CURRENT' },
    { title: 'Jadwal Tampil', date: '10 November 2026', status: 'UPCOMING' },
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', overflowX: 'auto', padding: '0.5rem 0' }}>
        {/* Connecting track line */}
        <div
          style={{
            position: 'absolute',
            top: '21px',
            left: '60px',
            right: '60px',
            height: '2px',
            backgroundColor: 'var(--pub-line)',
            zIndex: 0,
          }}
        />

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
                minWidth: '135px',
                flex: '1 1 0px',
                position: 'relative',
                zIndex: 1,
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
                  backgroundColor: isCompleted ? 'var(--pub-teal)' : isCurrent ? 'var(--pub-coral)' : 'var(--pub-surface)',
                  border: isCompleted || isCurrent ? 'none' : '2px solid var(--pub-line)',
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
                  fontSize: '0.785rem',
                  fontWeight: isCurrent ? 800 : 700,
                  color: isCurrent ? 'var(--pub-coral)' : 'var(--pub-ink)',
                  lineHeight: 1.25,
                }}
              >
                {st.title}
              </div>

              {st.date && (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: isCurrent ? 'var(--pub-coral)' : 'var(--pub-muted)',
                    fontWeight: isCurrent ? 700 : 600,
                    marginTop: '0.2rem',
                    lineHeight: 1.2,
                  }}
                >
                  {st.date}
                </div>
              )}

              <div
                style={{
                  fontSize: '0.6875rem',
                  color: isCompleted ? 'var(--pub-teal)' : isCurrent ? 'var(--pub-coral)' : 'var(--pub-muted)',
                  marginTop: '0.25rem',
                  fontWeight: 600,
                }}
              >
                {isCompleted ? 'Selesai' : isCurrent ? 'Tahap Aktif' : 'Menunggu'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
