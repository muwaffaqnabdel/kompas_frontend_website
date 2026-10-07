import React from 'react';
import { X } from 'lucide-react';

export default function ControlEventModal({
  isOpen,
  onClose,
  onSubmit,
  selectedEvent,
  controlForm,
  setControlForm,
}) {
  if (!isOpen || !selectedEvent) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 42, 70, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          width: '100%',
          maxWidth: '520px',
          borderRadius: '20px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-hover)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Kontrol Status: {selectedEvent.name}
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Kendalikan status tahapan lomba dan proteksi sistem secara real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Tahapan Status Lomba
            </label>
            <select
              value={controlForm.status}
              onChange={(e) => setControlForm({ ...controlForm, status: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            >
              <option value="DRAFT_SETUP">DRAFT SETUP — Persiapan Dokumen Teknis</option>
              <option value="REGISTRATION_OPEN">REGISTRATION OPEN — Pendaftaran Kontingen Dibuka</option>
              <option value="VALIDATION">VALIDATION — Pemeriksaan & Verifikasi Berkas</option>
              <option value="TECHNICAL_MEETING">TECHNICAL MEETING — Pengundian Nomor & Rundown</option>
              <option value="LIVE">LIVE HARI H — Operasional 4 Pos DP & Penilaian Juri</option>
              <option value="SCORING_REVIEW">SCORING REVIEW — Rekapitulasi Nilai & Evaluasi Juri</option>
              <option value="PUBLISHED">PUBLISHED — Pengumuman Juara & Leaderboard Live</option>
              <option value="ARCHIVED">ARCHIVED — Arsipkan Perlombaan Selesai</option>
            </select>
          </div>

          {/* Toggles Proteksi */}
          <div
            style={{
              backgroundColor: 'var(--pub-canvas)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pub-ink)', textTransform: 'uppercase' }}>
              Kunci Keamanan Sistem (Operational Locks)
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                  Kunci Alur 4 Pos DP (Lock Flow)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                  Mencegah perubahan pos saat lomba hari H berlangsung
                </div>
              </div>
              <input
                type="checkbox"
                checked={controlForm.dpFlowLocked}
                onChange={(e) => setControlForm({ ...controlForm, dpFlowLocked: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                  Kunci Penilaian Juri (Lock Scoring)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                  Mencegah pengubahan nilai setelah seluruh dewan juri submit
                </div>
              </div>
              <input
                type="checkbox"
                checked={controlForm.scoringLocked}
                onChange={(e) => setControlForm({ ...controlForm, scoringLocked: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                  Publikasikan Hasil ke Web Publik
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>
                  Tampilkan live leaderboard dan pemenang di katalog event
                </div>
              </div>
              <input
                type="checkbox"
                checked={controlForm.resultsPublished}
                onChange={(e) => setControlForm({ ...controlForm, resultsPublished: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--pub-coral)' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="pub-btn-outline"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              Batal
            </button>
            <button type="submit" className="pub-btn-coral" style={{ padding: '0.65rem 1.5rem' }}>
              <span>Terapkan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
