import React from 'react';
import { Bell, CheckCircle, Users, ArrowRight, Clock } from 'lucide-react';

export default function PanitiaDPQueue({
  posIndex = 1,
  title = 'Antrean Tim Menunggu Masuk ke Pos',
  queueItems = [],
  allParticipants = [],
  activeTeamId = null,
  calledTeamIds = [],
  transferredTeamIds = [],
  onCallParticipant,
}) {
  // ==============================================================
  // JIKA POS 01: TAMPILKAN SELURUH DATA PESERTA DENGAN AKSI PANGGIL
  // ==============================================================
  if (posIndex === 1) {
    const participantsList = allParticipants.length > 0 ? allParticipants : [
      { id: 'part-1', queueNumber: '01', teamName: 'PASKIBRA GARUDA SAKTI', schoolName: 'SMAN 1 Jakarta', status: 'VALIDATED' },
      { id: 'part-2', queueNumber: '02', teamName: 'SATRIA BHAYANGKARA', schoolName: 'SMAN 3 Bandung', status: 'SUBMITTED' },
      { id: 'part-3', queueNumber: '03', teamName: 'KARTIKA WIRATAMA', schoolName: 'SMKN 2 Surabaya', status: 'REVISION_REQUIRED' },
      { id: 'part-4', queueNumber: '04', teamName: 'PASKIBRA PANDU NUSANTARA', schoolName: 'SMA Taruna Nusantara Magelang', status: 'VALIDATED' },
    ];

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Daftar Seluruh Kontingen Peserta (Antrean Masuk Pos 01)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Peserta berada di area tunggu sekitar lomba. Klik <strong>Panggil Masuk DP 1</strong> untuk memanggil pasukan masuk ke pemeriksaan berkas.
            </p>
          </div>
          <span style={{ fontSize: '0.725rem', backgroundColor: 'var(--pub-sand)', color: 'var(--pub-ink)', padding: '0.25rem 0.65rem', borderRadius: 'var(--pub-radius-pill)', fontWeight: 700 }}>
            Total: {participantsList.length} Kontingen
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {participantsList.map((team, idx) => {
            const isTransferred = transferredTeamIds.includes(team.id);
            const isActiveInPos1 = activeTeamId === team.id;
            const isCalled = calledTeamIds.includes(team.id) || isActiveInPos1;

            return (
              <div
                key={team.id || idx}
                style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '12px',
                  border: isActiveInPos1 ? '1.5px solid var(--pub-teal)' : '1px solid var(--pub-line)',
                  backgroundColor: isActiveInPos1 ? '#F0FDF4' : 'var(--pub-canvas)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Info Tim */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: isActiveInPos1 ? 'var(--pub-teal)' : '#FFFFFF',
                      color: isActiveInPos1 ? '#FFFFFF' : 'var(--pub-ink)',
                      border: '1px solid var(--pub-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {team.queueNumber || `0${idx + 1}`}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pub-ink)' }}>
                      {team.teamName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                      {team.schoolName || team.school} · 16 Personel Pasukan
                    </div>
                  </div>
                </div>

                {/* Status Berkas & Aksi Panggilan */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Status Berkas */}
                  <span
                    style={{
                      backgroundColor: team.status === 'VALIDATED' ? 'var(--pub-teal-light)' : '#FEF3C7',
                      color: team.status === 'VALIDATED' ? 'var(--pub-teal)' : '#B45309',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {team.status === 'VALIDATED' ? 'Berkas Valid' : 'Menunggu Review'}
                  </span>

                  {/* Tombol Aksi Panggilan */}
                  {isTransferred ? (
                    <span
                      style={{
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid #A7F3D0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <CheckCircle size={13} />
                      <span>Lolos ke Pos 02 ✓</span>
                    </span>
                  ) : isActiveInPos1 ? (
                    <span
                      style={{
                        backgroundColor: 'var(--pub-teal)',
                        color: '#FFFFFF',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Clock size={13} />
                      <span>Sedang di Pos 1 (Aktif)</span>
                    </span>
                  ) : isCalled ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--pub-sand)',
                        color: 'var(--pub-muted)',
                        border: '1px solid var(--pub-line)',
                        cursor: 'not-allowed',
                      }}
                    >
                      Telah Dipanggil
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCallParticipant && onCallParticipant(team)}
                      className="pub-btn-coral"
                      style={{
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <Bell size={13} />
                      <span>Panggil Masuk DP 1</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==============================================================
  // JIKA POS 02, 03, 04: TAMPILKAN ANTREAN SEDERHANA PER POS
  // ==============================================================
  const items = queueItems.length > 0 ? queueItems : [
    { order: '02', teamName: 'SATRIA BHAYANGKARA', school: 'SMAN 3 Bandung', members: 16, status: 'WAITING' },
    { order: '03', teamName: 'KARTIKA WIRATAMA', school: 'SMKN 2 Surabaya', members: 16, status: 'STANDBY' },
  ];

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
        {title}
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
