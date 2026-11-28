import React from 'react';

function resolveAutoStepStatus(stepIdx, totalSteps, registration) {
  if (!registration) {
    return stepIdx === 0 ? 'CURRENT' : 'UPCOMING';
  }

  const regStatus = String(registration.status || 'DRAFT').toUpperCase();
  const evStatus = String(registration.eventStatus || '').toUpperCase();

  let currentStageIdx = 0;
  if (
    evStatus === 'PUBLISHED' ||
    evStatus === 'ARCHIVED' ||
    regStatus === 'FINALIZED' ||
    regStatus === 'FEEDBACK_GENERATED'
  ) {
    currentStageIdx = totalSteps;
  } else if (evStatus === 'LIVE' || evStatus === 'SCORING_REVIEW' || regStatus === 'SCORED') {
    currentStageIdx = Math.min(4, totalSteps - 1);
  } else if (regStatus === 'SCHEDULED' || registration.queueNumber) {
    currentStageIdx = Math.min(3, totalSteps - 1);
  } else if (evStatus === 'TECHNICAL_MEETING' || registration.eventTechnicalMeeting?.isPublished) {
    currentStageIdx = Math.min(2, totalSteps - 1);
  } else if (regStatus === 'VALIDATED') {
    currentStageIdx = Math.min(2, totalSteps - 1);
  } else if (regStatus === 'SUBMITTED' || regStatus === 'REVISION_REQUIRED') {
    currentStageIdx = Math.min(1, totalSteps - 1);
  } else {
    currentStageIdx = 0;
  }

  if (stepIdx < currentStageIdx) return 'COMPLETED';
  if (stepIdx === currentStageIdx) return 'CURRENT';
  return 'UPCOMING';
}

function buildFallbackSteps(registration) {
  let dayStr = 'Jadwal menyusul';
  if (registration?.eventDate) {
    try {
      const d = new Date(registration.eventDate);
      if (!Number.isNaN(d.getTime())) {
        dayStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch {}
  }

  return [
    { title: 'Pendaftaran Tim', date: 'Pendaftaran Dibuka', status: 'AUTO' },
    { title: 'Validasi Berkas', date: 'Verifikasi Panitia', status: 'AUTO' },
    { title: 'Technical Meeting', date: 'Sesuai Agenda TM', status: 'AUTO' },
    { title: 'Jadwal Tampil', date: 'Setelah Undian TM', status: 'AUTO' },
    { title: 'Penampilan Hari H', date: dayStr, status: 'AUTO' },
    { title: 'Hasil & Evaluasi Juri', date: dayStr, status: 'AUTO' },
  ];
}

export default function PesertaTimeline({ steps = [], activeRegistration = null }) {
  const rawSteps =
    Array.isArray(steps) && steps.length > 0
      ? steps
      : Array.isArray(activeRegistration?.eventTimeline) && activeRegistration.eventTimeline.length > 0
      ? activeRegistration.eventTimeline
      : buildFallbackSteps(activeRegistration);

  const items = rawSteps.map((st, idx) => ({
    ...st,
    resolvedStatus:
      !st.status || st.status === 'AUTO'
        ? resolveAutoStepStatus(idx, rawSteps.length, activeRegistration)
        : st.status,
  }));

  // Hitung indeks progres terjauh untuk garis penghubung progresif ("mipil" warna #C94B3C)
  let currentStepIdx = items.findIndex((st) => st.resolvedStatus === 'CURRENT');
  let highestReachedIdx = currentStepIdx;
  if (highestReachedIdx === -1) {
    const lastCompleted = items.reduce(
      (acc, st, i) => (st.resolvedStatus === 'COMPLETED' ? i : acc),
      -1
    );
    highestReachedIdx = lastCompleted;
  }

  const allCompleted = items.length > 0 && items.every((st) => st.resolvedStatus === 'COMPLETED');
  const activeStepObj =
    currentStepIdx >= 0
      ? items[currentStepIdx]
      : allCompleted
      ? items[items.length - 1]
      : items[0];

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.35rem',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.08rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: 0,
            }}
          >
            Tahapan Perjalanan Lomba {activeRegistration?.eventName ? `— ${activeRegistration.eventName}` : ''}
          </h3>
          <div style={{ fontSize: '0.76rem', color: 'var(--pub-muted)', marginTop: '0.2rem' }}>
            {allCompleted
              ? 'Seluruh tahapan lomba telah selesai dilaksanakan.'
              : activeStepObj
              ? `Posisi saat ini: Tahap ${Math.max(1, (currentStepIdx >= 0 ? currentStepIdx : 0) + 1)} dari ${items.length} — ${activeStepObj.title}`
              : `${items.length} Tahapan`}
          </div>
        </div>

        <span
          style={{
            backgroundColor: allCompleted ? 'var(--pub-teal-light)' : 'rgba(201, 75, 60, 0.12)',
            color: allCompleted ? 'var(--pub-teal)' : '#C94B3C',
            border: allCompleted ? '1px solid rgba(31, 138, 120, 0.25)' : '1px solid rgba(201, 75, 60, 0.28)',
            padding: '0.25rem 0.7rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}
        >
          {allCompleted
            ? 'SELESAI'
            : activeStepObj
            ? `AKTIF: ${activeStepObj.title.toUpperCase()}`
            : 'PROGRES'}
        </span>
      </div>

      {/* Stepper dengan garis progresif #C94B3C yang mengisi bertahap per langkah */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          overflowX: 'auto',
          padding: '0.5rem 0 0.25rem 0',
        }}
      >
        {items.map((st, idx) => {
          const isCompleted = st.resolvedStatus === 'COMPLETED';
          const isCurrent = st.resolvedStatus === 'CURRENT';
          const isReached = isCompleted || isCurrent || idx <= highestReachedIdx;

          // Garis kiri berwarna #C94B3C jika langkah ini sudah tercapai (COMPLETED / CURRENT)
          const leftLineActive = idx > 0 && isReached;
          // Garis kanan berwarna #C94B3C jika langkah ini sudah terlewati (progres sudah maju ke langkah berikutnya)
          const rightLineActive =
            idx < items.length - 1 && (idx < highestReachedIdx || (isCompleted && items[idx + 1]?.resolvedStatus !== 'UPCOMING'));

          return (
            <div
              key={st.id || idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minWidth: '132px',
                flex: '1 1 0px',
                position: 'relative',
                padding: '0 0.35rem',
              }}
              title={st.description || st.title}
            >
              {/* Baris Lingkaran + Garis Kiri & Kanan */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '38px',
                  marginBottom: '0.5rem',
                }}
              >
                {/* Segmen Garis Kiri */}
                {idx > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: '50%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: leftLineActive ? '3.5px' : '2px',
                      backgroundColor: leftLineActive ? '#C94B3C' : 'var(--pub-line)',
                      transition: 'background-color 0.25s ease, height 0.2s ease',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Segmen Garis Kanan */}
                {idx < items.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: rightLineActive ? '3.5px' : '2px',
                      backgroundColor: rightLineActive ? '#C94B3C' : 'var(--pub-line)',
                      transition: 'background-color 0.25s ease, height 0.2s ease',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Lingkaran Penanda Tahap */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: isCurrent ? '38px' : '34px',
                    height: isCurrent ? '38px' : '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCurrent
                      ? '#C94B3C'
                      : isCompleted
                      ? '#C94B3C'
                      : 'var(--pub-surface)',
                    border: isCurrent
                      ? '3px solid #FFFFFF'
                      : isCompleted
                      ? 'none'
                      : '2px solid var(--pub-line)',
                    color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--pub-muted)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    boxShadow: isCurrent
                      ? '0 0 0 3px rgba(201, 75, 60, 0.25), 0 4px 12px rgba(201, 75, 60, 0.32)'
                      : isCompleted
                      ? '0 2px 6px rgba(201, 75, 60, 0.22)'
                      : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
              </div>

              {/* Label Status Kecil untuk Tahap Aktif */}
              {isCurrent && (
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: '#C94B3C',
                    backgroundColor: 'rgba(201, 75, 60, 0.1)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Saat Ini
                </span>
              )}

              <div
                style={{
                  fontSize: '0.79rem',
                  fontWeight: isCurrent ? 800 : isCompleted ? 700 : 600,
                  color: isCurrent ? '#C94B3C' : isCompleted ? 'var(--pub-ink)' : '#64748B',
                  lineHeight: 1.25,
                }}
              >
                {st.title}
              </div>

              {st.date && (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: isCurrent ? '#C94B3C' : 'var(--pub-muted)',
                    fontWeight: isCurrent ? 700 : 600,
                    marginTop: '0.2rem',
                    lineHeight: 1.25,
                  }}
                >
                  {st.date}
                </div>
              )}

              {st.description && (
                <div
                  style={{
                    fontSize: '0.66rem',
                    color: '#94A3B8',
                    marginTop: '0.18rem',
                    lineHeight: 1.3,
                    maxWidth: '150px',
                  }}
                >
                  {st.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
