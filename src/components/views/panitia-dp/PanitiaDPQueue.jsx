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
    const participantsList = Array.isArray(allParticipants) ? allParticipants : [];

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
              Daftar Kontingen Tervalidasi (Antrean Masuk Pos 01)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Hanya tim yang sudah divalidasi Admin Panitia yang muncul di sini. Klik <strong>Panggil Masuk DP 1</strong> untuk mengirim panggilan ke akun peserta.
            </p>
          </div>
          <span style={{ fontSize: '0.725rem', backgroundColor: 'var(--pub-sand)', color: 'var(--pub-ink)', padding: '0.25rem 0.65rem', borderRadius: 'var(--pub-radius-pill)', fontWeight: 700 }}>
            Total: {participantsList.length} Kontingen
          </span>
        </div>

        {participantsList.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px dashed var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              textAlign: 'center',
              color: 'var(--pub-muted)',
              fontSize: '0.84rem',
              lineHeight: 1.55,
            }}
          >
            Belum ada kontingen yang tervalidasi pada event ini. Validasi berkas peserta terlebih dahulu melalui menu <strong>Admin Panitia → Peserta &amp; Berkas</strong>.
          </div>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {participantsList.map((team, idx) => {
            const isTransferred = transferredTeamIds.includes(team.id);
            const isActiveInPos1 = activeTeamId === team.id;
            const isCalled = calledTeamIds.includes(team.id) || isActiveInPos1;
            const membersQty = team.membersCount ?? (Array.isArray(team.members) ? team.members.length : 16);
            const isQualifiedStatus = ['VALIDATED', 'SCHEDULED', 'SCORED', 'FEEDBACK_GENERATED', 'FINALIZED'].includes(team.status);

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
                    {team.queueNumber || String(idx + 1).padStart(2, '0')}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pub-ink)' }}>
                      {team.teamName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.1rem' }}>
                      {team.schoolName || team.school} · {membersQty} Personel Pasukan
                    </div>
                  </div>
                </div>

                {/* Status Berkas & Aksi Panggilan */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Status Berkas */}
                  <span
                    style={{
                      backgroundColor: isQualifiedStatus ? 'var(--pub-teal-light)' : '#FEF3C7',
                      color: isQualifiedStatus ? 'var(--pub-teal)' : '#B45309',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {team.status === 'SCHEDULED' ? 'Terjadwal' : isQualifiedStatus ? 'Tervalidasi' : 'Belum Valid'}
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
        )}
      </div>
    );
  }

  // ==============================================================
  // JIKA POS 02, 03, 04: TAMPILKAN ANTREAN SEDERHANA PER POS
  // ==============================================================
  const items = Array.isArray(queueItems) ? queueItems : [];

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
      {items.length === 0 ? (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px dashed var(--pub-line)',
            backgroundColor: 'var(--pub-canvas)',
            textAlign: 'center',
            color: 'var(--pub-muted)',
            fontSize: '0.82rem',
          }}
        >
          Belum ada kontingen tervalidasi dalam antrean untuk event ini.
        </div>
      ) : (
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
      )}
    </div>
  );
}
