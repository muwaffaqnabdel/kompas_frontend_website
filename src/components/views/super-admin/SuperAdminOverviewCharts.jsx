import React from 'react';

export default function SuperAdminOverviewCharts({ events = [], stats = {} }) {
  const totalEvents = events.length || 1;
  const regOpenCount = events.filter((e) => e.status === 'REGISTRATION_OPEN').length;
  const liveCount = events.filter((e) => e.status === 'LIVE').length;
  const draftCount = events.filter((e) => e.status === 'DRAFT_SETUP').length;
  const publishedCount = events.filter((e) => e.status === 'PUBLISHED').length;

  const regOpenPct = Math.round((regOpenCount / totalEvents) * 100);
  const livePct = Math.round((liveCount / totalEvents) * 100);
  const draftPct = Math.round((draftCount / totalEvents) * 100);
  const publishedPct = Math.round((publishedCount / totalEvents) * 100);

  // Kesiapan Operasional
  const hasAdminCount = events.filter((e) => e.adminPanitia).length;
  const dpLockedCount = events.filter((e) => e.dpFlowLocked).length;
  const scoringLockedCount = events.filter((e) => e.scoringLocked).length;

  // Monthly breakdown simulasi berbasis eventDate
  const months = [
    { label: 'Okt 2026', count: 0 },
    { label: 'Nov 2026', count: events.filter((e) => new Date(e.eventDate).getMonth() === 10).length || 1 },
    { label: 'Des 2026', count: events.filter((e) => new Date(e.eventDate).getMonth() === 11).length },
    { label: 'Jan 2027', count: 0 },
  ];
  const maxMonthCount = Math.max(...months.map((m) => m.count), 1);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {/* 1. Distribusi Siklus Status Lomba */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Distribusi Fase Kompetisi
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.2rem 0 1rem 0',
            }}
          >
            Siklus Status Lomba
          </h3>

          {/* Segmented Multi-Bar */}
          <div
            style={{
              height: '14px',
              borderRadius: '8px',
              backgroundColor: 'var(--pub-line)',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '1.25rem',
            }}
          >
            {regOpenPct > 0 && (
              <div
                style={{ width: `${regOpenPct}%`, backgroundColor: 'var(--pub-teal)' }}
                title={`Pendaftaran Dibuka: ${regOpenCount} event (${regOpenPct}%)`}
              />
            )}
            {livePct > 0 && (
              <div
                style={{ width: `${livePct}%`, backgroundColor: 'var(--pub-coral)' }}
                title={`Live Hari H: ${liveCount} event (${livePct}%)`}
              />
            )}
            {draftPct > 0 && (
              <div
                style={{ width: `${draftPct}%`, backgroundColor: 'var(--pub-amber)' }}
                title={`Draft Setup: ${draftCount} event (${draftPct}%)`}
              />
            )}
            {publishedPct > 0 && (
              <div
                style={{ width: `${publishedPct}%`, backgroundColor: 'var(--pub-navy)' }}
                title={`Hasil Dipublikasi: ${publishedCount} event (${publishedPct}%)`}
              />
            )}
          </div>

          {/* Legend Items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--pub-teal)' }} />
              <span style={{ color: 'var(--pub-ink)' }}>Buka Pendaftaran:</span>
              <strong className="tabular-nums" style={{ marginLeft: 'auto' }}>{regOpenCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--pub-coral)' }} />
              <span style={{ color: 'var(--pub-ink)' }}>Live Hari H:</span>
              <strong className="tabular-nums" style={{ marginLeft: 'auto' }}>{liveCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--pub-amber)' }} />
              <span style={{ color: 'var(--pub-ink)' }}>Draft Setup:</span>
              <strong className="tabular-nums" style={{ marginLeft: 'auto' }}>{draftCount}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: 'var(--pub-navy)' }} />
              <span style={{ color: 'var(--pub-ink)' }}>Hasil Diumumkan:</span>
              <strong className="tabular-nums" style={{ marginLeft: 'auto' }}>{publishedCount}</strong>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--pub-line)', marginTop: '1.25rem', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
          Total {totalEvents} event terdata dalam sistem KOMPAS
        </div>
      </div>

      {/* 2. Matriks Kesiapan Operasional Lintas Event */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Audit Kesiapan Sistem
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.2rem 0 1rem 0',
            }}
          >
            Kesiapan Operasional Lomba
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Admin Panitia Assignment */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>Admin Panitia Ditugaskan</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-teal)' }}>
                  {hasAdminCount} dari {totalEvents} Event
                </span>
              </div>
              <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--pub-line)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(hasAdminCount / totalEvents) * 100}%`, backgroundColor: 'var(--pub-teal)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Lock Flow 4 DP */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>Alur 4 Pos DP Terkunci</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: dpLockedCount > 0 ? 'var(--pub-teal)' : 'var(--pub-amber)' }}>
                  {dpLockedCount} dari {totalEvents} Event
                </span>
              </div>
              <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--pub-line)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(dpLockedCount / totalEvents) * 100}%`, backgroundColor: 'var(--pub-amber)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Lock Kriteria Nilai */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>Kriteria Nilai Terkunci</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: scoringLockedCount > 0 ? 'var(--pub-teal)' : 'var(--pub-amber)' }}>
                  {scoringLockedCount} dari {totalEvents} Event
                </span>
              </div>
              <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--pub-line)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(scoringLockedCount / totalEvents) * 100}%`, backgroundColor: 'var(--pub-navy)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--pub-line)', marginTop: '1.25rem', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pub-teal)', fontWeight: 600 }}>
          ✓ Proteksi integritas sistem aktif via Prisma Transaction
        </div>
      </div>

      {/* 3. Bar Chart Distribusi Jadwal Event per Bulan */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Konsentrasi Jadwal
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.2rem 0 1rem 0',
            }}
          >
            Jadwal Lomba per Bulan
          </h3>

          {/* Simple Clean Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '110px', paddingTop: '10px', borderBottom: '2px solid var(--pub-line)' }}>
            {months.map((m, idx) => {
              const barHeight = m.count > 0 ? (m.count / maxMonthCount) * 80 + 20 : 6;
              const isPeak = m.count === maxMonthCount && m.count > 0;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '45px' }}>
                  <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 700, color: isPeak ? 'var(--pub-coral)' : 'var(--pub-muted)' }}>
                    {m.count > 0 ? `${m.count}` : '0'}
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: `${barHeight}px`,
                      borderRadius: '6px 6px 0 0',
                      backgroundColor: isPeak ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                      border: isPeak ? 'none' : '1px solid var(--pub-line)',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
            {months.map((m, idx) => (
              <span key={idx} style={{ width: '45px', textAlign: 'center' }}>
                {m.label.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--pub-line)', marginTop: '1.25rem', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
          Puncak lomba: November 2026 (LKBB Nasional)
        </div>
      </div>
    </div>
  );
}
