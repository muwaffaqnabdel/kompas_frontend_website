import React from 'react';
import { Lock, Unlock, Users } from 'lucide-react';

export default function AdminPanitiaReadiness({
  dpFlowLocked,
  setDpFlowLocked,
  scoringLocked,
  setScoringLocked,
}) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--pub-ink)', margin: 0 }}>
            Kesiapan Konfigurasi Operasional
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Flow DP dan Kriteria Nilai wajib dikunci sebelum hari H dimulai.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pub-muted)' }}>Status Kesiapan:</span>
          <span
            style={{
              backgroundColor: 'var(--pub-teal-light)',
              color: 'var(--pub-teal)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            85% SIAP
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Flow DP Locking */}
        <div style={{ padding: '1rem', border: '1px solid var(--pub-line)', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--pub-ink)' }}>Flow 4 DP Standar</div>
            <span
              style={{
                backgroundColor: dpFlowLocked ? 'var(--pub-teal-light)' : '#FEF3C7',
                color: dpFlowLocked ? 'var(--pub-teal)' : 'var(--pub-amber)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {dpFlowLocked ? 'DIKUNCI' : 'BELUM DIKUNCI'}
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', marginBottom: '0.85rem' }}>
            Dokumen → Photoshoot → Persiapan → Tampil
          </p>
          <button
            onClick={() => setDpFlowLocked(!dpFlowLocked)}
            className="pub-btn-outline"
            style={{ width: '100%', fontSize: '0.775rem', padding: '0.45rem', justifyContent: 'center', fontWeight: 500 }}
          >
            {dpFlowLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{dpFlowLocked ? 'Buka Kunci Flow' : 'Kunci Flow DP'}</span>
          </button>
        </div>

        {/* Scoring Locking */}
        <div style={{ padding: '1rem', border: '1px solid var(--pub-line)', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--pub-ink)' }}>Kriteria & Nilai Dinamis</div>
            <span
              style={{
                backgroundColor: scoringLocked ? 'var(--pub-teal-light)' : '#FEF3C7',
                color: scoringLocked ? 'var(--pub-teal)' : 'var(--pub-amber)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {scoringLocked ? 'DIKUNCI' : 'BELUM DIKUNCI'}
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', marginBottom: '0.85rem' }}>
            4 Aba-aba / Kriteria Terkonfigurasi
          </p>
          <button
            onClick={() => setScoringLocked(!scoringLocked)}
            className="pub-btn-outline"
            style={{ width: '100%', fontSize: '0.775rem', padding: '0.45rem', justifyContent: 'center', fontWeight: 500 }}
          >
            {scoringLocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{scoringLocked ? 'Buka Kunci Nilai' : 'Kunci Kriteria Penilaian'}</span>
          </button>
        </div>

        {/* Juri & Panitia DP Assignment */}
        <div style={{ padding: '1rem', border: '1px solid var(--pub-line)', borderRadius: '12px', backgroundColor: 'var(--pub-canvas)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--pub-ink)' }}>Penugasan Petugas</div>
            <span
              style={{
                backgroundColor: 'var(--pub-teal-light)',
                color: 'var(--pub-teal)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              LENGKAP
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--pub-muted)', marginBottom: '0.85rem' }}>
            4 Operator DP & 3 Juri Resmi Ditugaskan
          </p>
          <button className="pub-btn-outline" style={{ width: '100%', fontSize: '0.775rem', padding: '0.45rem', justifyContent: 'center', fontWeight: 500 }}>
            <Users size={14} />
            <span>Kelola Akun Lapangan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
