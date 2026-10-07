import React from 'react';

export default function PanitiaDPHeader({
  dpName = 'DP 1 — Pengecekan Dokumen & Berkas',
  dpPosNumber = '01',
  eventName = 'LKBB Nasional 2026',
  operatorName = 'Budi Santoso',
  targetDpCapacity,
  onToggleTargetCapacity,
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span
            style={{
              backgroundColor: 'var(--pub-teal-light)',
              color: 'var(--pub-teal)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.725rem',
              fontWeight: 700,
            }}
          >
            POS {dpPosNumber} AKTIF
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
            margin: '0 0 0.25rem 0',
            color: 'var(--pub-ink)',
          }}
        >
          {dpName}
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
          Operator: <strong style={{ color: 'var(--pub-ink)' }}>{operatorName}</strong> · Kapasitas Batas:{' '}
          <strong>Tepat 1 Tim</strong>
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', fontWeight: 600 }}>Simulasi Kapasitas DP 2 (Tujuan)</div>
        <button
          type="button"
          onClick={onToggleTargetCapacity}
          className="pub-btn-outline"
          style={{
            fontSize: '0.75rem',
            padding: '0.35rem 0.75rem',
            marginTop: '0.35rem',
            color: targetDpCapacity === 'AVAILABLE' ? 'var(--pub-teal)' : 'var(--pub-coral)',
            borderColor: targetDpCapacity === 'AVAILABLE' ? 'var(--pub-teal)' : 'var(--pub-coral)',
          }}
        >
          {targetDpCapacity === 'AVAILABLE' ? '🟢 DP 2 Kosong (Slot Ada)' : '🔴 DP 2 Penuh (1 Tim Aktif)'}
        </button>
      </div>
    </div>
  );
}
