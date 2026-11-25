import React from 'react';
import { FileText, Camera, Clock, Award, Shield, CheckCircle2, RotateCcw, RefreshCw } from 'lucide-react';

const POS_CONFIG = [
  {
    index: 1,
    code: 'DOC_CHECK',
    name: 'Pos 01 — Pengecekan Dokumen & Berkas',
    shortName: 'Pos 1: Dokumen',
    icon: FileText,
    targetName: 'Pos 02 (Photoshoot)',
    desc: 'Verifikasi berkas administratif yang diunggah peserta sebelum masuk alur fisik.',
  },
  {
    index: 2,
    code: 'PHOTOSHOOT',
    name: 'Pos 02 — Photoshoot Kontingen & Pasukan',
    shortName: 'Pos 2: Photoshoot',
    icon: Camera,
    targetName: 'Pos 03 (Persiapan)',
    desc: 'Pemantauan sesi foto resmi formasi pasukan & danton untuk layar videotron.',
  },
  {
    index: 3,
    code: 'FINAL_PREP',
    name: 'Pos 03 — Daerah Persiapan & Pemanasan (Warm Up)',
    shortName: 'Pos 3: Persiapan',
    icon: Clock,
    targetName: 'Pos 04 (Panggung)',
    desc: 'Isolasi steril dan countdown pemanasan 10 menit sebelum dipanggil ke arena.',
  },
  {
    index: 4,
    code: 'STAGE_PERFORMANCE',
    name: 'Pos 04 — Penampilan Arena & Lapangan Utama',
    shortName: 'Pos 4: Panggung Utama',
    icon: Award,
    targetName: 'Selesai Lomba (Keluar Arena)',
    desc: 'Live stopwatch waktu tampil resmi LKBB 10:00 menit dan pemantauan 5 dewan juri.',
  },
];

export default function PanitiaDPHeader({
  posIndex = 1,
  onSelectPos,
  eventId = '08007fe4-8f16-4324-b815-2cb8ead844af',
  onSelectEvent,
  eventName = 'LKBB Nasional 2026',
  operatorName = 'Budi Santoso',
  targetDpCapacity = 'AVAILABLE',
  onToggleTargetCapacity,
  onResetFlow,
  onRefresh,
  isRefreshing = false,
  lastSyncTime,
}) {
  const currentPos = POS_CONFIG.find((p) => p.index === posIndex) || POS_CONFIG[0];
  const IconComp = currentPos.icon;

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      {/* 1. Baris Atas: Switcher Pos, Switcher Event & Real-time Live Sync */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--pub-line)',
        }}
      >
        {/* Pos Navigation Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            PILIH POS DP:
          </span>
          {POS_CONFIG.map((p) => {
            const isActive = p.index === posIndex;
            const PIcon = p.icon;
            return (
              <button
                key={p.index}
                type="button"
                onClick={() => onSelectPos && onSelectPos(p.index)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 800 : 600,
                  border: isActive ? '1.5px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                  backgroundColor: isActive ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                  color: isActive ? '#FFFFFF' : 'var(--pub-ink)',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(201, 75, 60, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <PIcon size={14} />
                <span>{p.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Event Selector, Live Sync Pill, Refresh & Reset Flow Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Live Sync Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ECFDF5',
              color: '#047857',
              border: '1px solid #A7F3D0',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
            title={`Real-time sync aktif antar tab & perangkat. ${lastSyncTime ? `Terakhir sync: ${lastSyncTime}` : ''}`}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 6px #10B981',
              }}
            />
            <span>REAL-TIME LIVE</span>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
                color: 'var(--pub-ink)',
                cursor: isRefreshing ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Klik untuk segarkan data posisi tim saat ini"
            >
              <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} color="var(--pub-teal)" />
              <span>{isRefreshing ? 'Sync...' : 'Segarkan'}</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)' }}>
              EVENT:
            </span>
            <select
              value={eventId}
              onChange={(e) => onSelectEvent && onSelectEvent(e.target.value)}
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1.5px solid var(--pub-coral)',
                backgroundColor: '#FFFFFF',
                color: 'var(--pub-ink)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="08007fe4-8f16-4324-b815-2cb8ead844af">🏆 LKBB Nasional 2026</option>
              <option value="0b85acba-5fc6-4861-b0ce-e35a3bf4cc19">🚩 FORDA Jawa Tengah 2026</option>
            </select>
          </div>

          {onResetFlow && (
            <button
              type="button"
              onClick={onResetFlow}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.38rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
                color: 'var(--pub-ink)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Reset seluruh pos ke kondisi steril untuk mulai uji coba baru"
            >
              <RotateCcw size={13} color="var(--pub-coral)" />
              <span>Reset Alur</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Baris Utama: Detail Pos Aktif & Status Alur */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: posIndex === 1 ? 'var(--pub-teal-light)' : posIndex === 4 ? '#FEE2E2' : 'var(--pub-sand)',
                color: posIndex === 1 ? 'var(--pub-teal)' : posIndex === 4 ? '#DC2626' : 'var(--pub-ink)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.725rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              POS 0{posIndex} AKTIF
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
              {eventName}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              margin: '0 0 0.35rem 0',
              color: 'var(--pub-ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <IconComp size={24} color="var(--pub-coral)" />
            <span>{currentPos.name}</span>
          </h1>

          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
            Operator: <strong style={{ color: 'var(--pub-ink)' }}>{operatorName}</strong> · Tugas:{' '}
            <span style={{ color: 'var(--pub-ink)', fontWeight: 600 }}>{currentPos.desc}</span>
          </p>
        </div>

        {/* Kontrol Simulasi Atomic Lock Pos Berikutnya */}
        {posIndex < 4 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Simulasi Status {currentPos.targetName}
            </div>
            <button
              type="button"
              onClick={onToggleTargetCapacity}
              className="pub-btn-outline"
              style={{
                fontSize: '0.75rem',
                padding: '0.4rem 0.85rem',
                marginTop: '0.35rem',
                color: targetDpCapacity === 'AVAILABLE' ? 'var(--pub-teal)' : 'var(--pub-coral)',
                borderColor: targetDpCapacity === 'AVAILABLE' ? 'var(--pub-teal)' : 'var(--pub-coral)',
                fontWeight: 700,
              }}
            >
              {targetDpCapacity === 'AVAILABLE'
                ? `🟢 ${currentPos.targetName} Kosong (Slot Tersedia)`
                : `🔴 ${currentPos.targetName} Penuh (Atomic Lock)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
