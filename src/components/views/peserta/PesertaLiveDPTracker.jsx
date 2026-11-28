import React from 'react';
import { Bell, Check } from 'lucide-react';

function formatTimeWib(val) {
  if (!val) return '';
  try {
    return (
      new Date(val).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    );
  } catch {
    return '';
  }
}

export default function PesertaLiveDPTracker({
  activeRegistration,
  dpStatus,
  notificationPermission = 'unsupported',
  pushSubscribed = false,
  pushBusy = false,
  pushFeedback = null,
  onRequestNotificationPermission,
  onSimulatePopup,
  onSimulateTopPush,
}) {
  if (!activeRegistration) return null;

  const steps = Array.isArray(dpStatus?.steps) && dpStatus.steps.length === 4
    ? dpStatus.steps
    : [
      { orderIndex: 1, shortName: 'DP 1', label: 'Cek Dokumen', status: 'UPCOMING' },
      { orderIndex: 2, shortName: 'DP 2', label: 'Photoshoot', status: 'UPCOMING' },
      { orderIndex: 3, shortName: 'DP 3', label: 'Persiapan', status: 'UPCOMING' },
      { orderIndex: 4, shortName: 'DP 4', label: 'Arena Utama', status: 'UPCOMING' },
    ];

  const currentPos = dpStatus?.currentPos ?? null;
  const isQualified = dpStatus ? Boolean(dpStatus.isQualifiedForDP) : ['VALIDATED', 'SCHEDULED', 'SCORED', 'FEEDBACK_GENERATED', 'FINALIZED'].includes(activeRegistration.status);
  const activeDp = dpStatus?.activeDp || null;

  // Hitung lebar garis progres berwarna #C94B3C (identik dengan gaya PesertaTimeline)
  let progressPercent = 0;
  if (currentPos === 'FINISHED') {
    progressPercent = 100;
  } else if (typeof currentPos === 'number' && currentPos >= 1 && currentPos <= 4) {
    progressPercent = ((currentPos - 1) / 3) * 100;
  }

  const getHeaderBadge = () => {
    if (currentPos === 'FINISHED') {
      return { text: 'SELESAI TAMPIL', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
    }
    if (typeof currentPos === 'number') {
      return { text: `POSISI: DP ${currentPos}`, bg: 'rgba(201, 75, 60, 0.12)', color: '#C94B3C', border: 'rgba(201, 75, 60, 0.35)' };
    }
    if (isQualified) {
      return { text: 'SIAP DIPANGGIL DP 1', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
    }
    return { text: 'MENUNGGU VALIDASI', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
  };

  const badge = getHeaderBadge();

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.35rem 1.5rem',
        border: currentPos === 1 ? '1.5px solid #C94B3C' : '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Baris Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.15rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--pub-ink)',
                margin: 0,
              }}
            >
              Posisi Pasukan Saat Ini (DP 1 – DP 4)
            </h3>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                letterSpacing: '0.03em',
              }}
            >
              {badge.text}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', margin: '0.25rem 0 0 0' }}>
            Pantau pergerakan tim secara real-time saat hari pelaksanaan lomba.
          </p>
        </div>

        {/* Kontrol Notifikasi HP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {!pushSubscribed && notificationPermission !== 'denied' && onRequestNotificationPermission && (
                <button
                  type="button"
                  disabled={pushBusy}
                  onClick={onRequestNotificationPermission}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '9px',
                    border: '1px solid #C94B3C',
                    backgroundColor: 'rgba(201, 75, 60, 0.08)',
                    color: '#C94B3C',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: pushBusy ? 'wait' : 'pointer',
                    opacity: pushBusy ? 0.7 : 1,
                  }}
                >
                  <Bell size={13} />
                  <span>{pushBusy ? 'Mengaktifkan...' : 'Aktifkan Notifikasi HP'}</span>
                </button>
              )}
                { pushSubscribed && notificationPermission === 'granted' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '999px',
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      border: '1px solid #A7F3D0',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    <Bell size={12} />
                    <span>Web Push HP Aktif</span>
                  </span>
                )}
              {(notificationPermission === 'denied' || notificationPermission === 'unsupported') && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--pub-muted)',
                    backgroundColor: 'var(--pub-canvas)',
                    border: '1px solid var(--pub-line)',
                    padding: '0.28rem 0.6rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}
                >
                  Mode Pop-up &amp; Getar Aktif
                </span>
              )}
            </div>
      </div>

        {/* Horizontal 4-Step Progress Bar DP 1..4 */}
        <div style={{ position: 'relative', padding: '0.45rem 0 0.25rem 0', marginBottom: '1.1rem' }}>
          {/* Garis Dasar */}
          <div
            style={{
              position: 'absolute',
              top: '21px',
              left: '12.5%',
              right: '12.5%',
              height: '3px',
              backgroundColor: 'var(--pub-line)',
              borderRadius: '999px',
              zIndex: 0,
            }}
          />
          {/* Garis Progres Aktif (#C94B3C) */}
          <div
            style={{
              position: 'absolute',
              top: '21px',
              left: '12.5%',
              width: `${(progressPercent / 100) * 75}%`,
              height: '3px',
              backgroundColor: currentPos === 'FINISHED' ? '#059669' : '#C94B3C',
              borderRadius: '999px',
              transition: 'width 0.35s ease',
              zIndex: 1,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.35rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {steps.map((step) => {
              const isCompleted = step.status === 'COMPLETED';
              const isActive = step.status === 'ACTIVE';

              const circleBg = isCompleted
                ? '#059669'
                : isActive
                  ? '#C94B3C'
                  : 'var(--pub-surface)';
              const circleBorder = isCompleted
                ? '#059669'
                : isActive
                  ? '#C94B3C'
                  : 'var(--pub-line)';
              const circleColor = isCompleted || isActive ? '#FFFFFF' : 'var(--pub-muted)';

              return (
                <div
                  key={step.orderIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: circleBg,
                      border: `2px solid ${circleBorder}`,
                      color: circleColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      boxShadow: isActive ? '0 0 0 5px rgba(201, 75, 60, 0.16)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.orderIndex}
                  </div>

                  <div
                    style={{
                      marginTop: '0.45rem',
                      fontSize: '0.76rem',
                      fontWeight: isActive ? 800 : 700,
                      color: isActive ? '#C94B3C' : isCompleted ? 'var(--pub-ink)' : 'var(--pub-muted)',
                    }}
                  >
                    {step.shortName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: isActive ? 'var(--pub-ink)' : 'var(--pub-muted)',
                      fontWeight: isActive ? 700 : 500,
                      lineHeight: 1.25,
                    }}
                  >
                    {step.label}
                  </div>
                  {step.enteredAt && (
                    <div
                      style={{
                        marginTop: '0.18rem',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: isActive ? '#C94B3C' : '#047857',
                        fontWeight: 700,
                      }}
                    >
                      {formatTimeWib(step.enteredAt)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Keterangan Status Aktif */}
        {!isQualified ? (
          <div
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            <strong>Belum Masuk Antrean DP 1:</strong> Berkas kontingen Anda masih berstatus{' '}
            <strong>{dpStatus?.participantStatus || activeRegistration.status}</strong>. Setelah divalidasi oleh Admin Panitia, tim Anda akan otomatis masuk ke antrean pemanggilan DP 1.
          </div>
        ) : currentPos === 'FINISHED' ? (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '0.82rem',
              lineHeight: 1.5,
            }}
          >
            <strong>Penampilan Selesai:</strong> Pasukan telah menyelesaikan seluruh tahapan dari DP 1 hingga DP 4 (Arena Utama). Pantau hasil penilaian pada menu <strong>Nilai &amp; Evaluasi Juri</strong>.
          </div>
        ) : typeof currentPos === 'number' && activeDp ? (
          <div
            style={{
              padding: '0.9rem 1.05rem',
              borderRadius: '11px',
              backgroundColor: currentPos === 1 ? 'rgba(201, 75, 60, 0.08)' : 'var(--pub-canvas)',
              border: currentPos === 1 ? '1px solid rgba(201, 75, 60, 0.35)' : '1px solid var(--pub-line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: currentPos === 1 ? '#C94B3C' : 'var(--pub-ink)' }}>
                {activeDp.name}
                {activeDp.dp4ScoringOpen && (
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                    }}
                  >
                    PENILAIAN JURI TERBUKA
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--pub-muted)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                {activeDp.instruction}
              </div>
            </div>
            {activeDp.enteredAt && (
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--pub-ink)',
                  backgroundColor: 'var(--pub-surface)',
                  border: '1px solid var(--pub-line)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                Masuk: <span className="tabular-nums">{formatTimeWib(activeDp.enteredAt)}</span>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--pub-canvas)',
              border: '1px solid var(--pub-line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
              fontSize: '0.8rem',
              color: 'var(--pub-ink)',
            }}
          >
            <div>
              <strong>Menunggu Panggilan DP 1:</strong> Tim Anda sudah tervalidasi dan siap dipanggil oleh Panitia Pos DP 1.
            </div>
            {(dpStatus?.currentlyInPos1 || dpStatus?.currentlyInPos4) && (
              <div style={{ fontSize: '0.74rem', color: 'var(--pub-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {dpStatus?.currentlyInPos1 && (
                  <span>
                    Sedang di DP 1: <strong style={{ color: 'var(--pub-ink)' }}>{dpStatus.currentlyInPos1.teamName}</strong>
                  </span>
                )}
                {dpStatus?.currentlyInPos4 && (
                  <span>
                    Tampil di Arena: <strong style={{ color: 'var(--pub-ink)' }}>{dpStatus.currentlyInPos4.teamName}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Baris Simulasi Notifikasi */}
        {(onSimulatePopup || onSimulateTopPush) && (
          <div
            style={{
              marginTop: '0.95rem',
              paddingTop: '0.85rem',
              borderTop: '1px dashed var(--pub-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
              Uji Tampilan Notifikasi:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {onSimulatePopup && (
                <button
                  type="button"
                  onClick={onSimulatePopup}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '8px',
                    border: '1px solid var(--pub-line)',
                    backgroundColor: 'var(--pub-canvas)',
                    color: 'var(--pub-ink)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Simulasi Pop-up (Dalam Web)
                </button>
              )}
              {onSimulateTopPush && (
                <>
                  <button
                    type="button"
                    disabled={pushBusy}
                    onClick={() => onSimulateTopPush(0)}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 75, 60, 0.35)',
                      backgroundColor: 'rgba(201, 75, 60, 0.06)',
                      color: '#C94B3C',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: pushBusy ? 'wait' : 'pointer',
                      opacity: pushBusy ? 0.7 : 1,
                    }}
                  >
                    Simulasi Notif Atas HP
                  </button>
                  <button
                    type="button"
                    disabled={pushBusy}
                    onClick={() => onSimulateTopPush(5)}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--pub-line)',
                      backgroundColor: 'var(--pub-surface)',
                      color: 'var(--pub-muted)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: pushBusy ? 'wait' : 'pointer',
                      opacity: pushBusy ? 0.7 : 1,
                    }}
                    title="Kirim notifikasi push 5 detik kemudian agar Anda bisa keluar browser / mematikan layar terlebih dahulu"
                  >
                    Tes 5 Detik (Tutup/Kunci Layar)
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {pushFeedback?.text && (
          <div
            style={{
              marginTop: '0.65rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '9px',
              fontSize: '0.76rem',
              lineHeight: 1.45,
              backgroundColor:
                pushFeedback.type === 'success'
                  ? '#ECFDF5'
                  : pushFeedback.type === 'error'
                    ? '#FEF2F2'
                    : '#EFF6FF',
              border:
                pushFeedback.type === 'success'
                  ? '1px solid #A7F3D0'
                  : pushFeedback.type === 'error'
                    ? '1px solid #FECACA'
                    : '1px solid #BFDBFE',
              color:
                pushFeedback.type === 'success'
                  ? '#065F46'
                  : pushFeedback.type === 'error'
                    ? '#991B1B'
                    : '#1E40AF',
            }}
          >
            {pushFeedback.text}
          </div>
        )}
      </div>
      );
}

