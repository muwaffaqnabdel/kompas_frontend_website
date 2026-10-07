import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PanitiaDPWorkstation({
  notification,
  dpStatus,
  onFinishDP,
  teamName = 'PASKIBRA GARUDA SAKTI',
  school = 'SMAN 1 Jakarta',
  orderNumber = '01',
  members = 16,
  entryTime = '08:15 WIB',
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: notification.type === 'danger' ? 'var(--pub-coral-pale)' : 'var(--pub-teal-light)',
            color: notification.type === 'danger' ? 'var(--pub-coral)' : 'var(--pub-teal)',
            border: `1px solid ${notification.type === 'danger' ? 'var(--pub-coral)' : 'var(--pub-teal)'}`,
            fontWeight: 600,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Active Team Workstation Card */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem',
          border: '1px solid var(--pub-line)',
          borderTop: '5px solid var(--pub-coral)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--pub-coral)', letterSpacing: '0.08em' }}>
              TIM SEDANG DI POS INI
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0' }}>
              {teamName}
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--pub-muted)' }}>
              {school} · Nomor Urut Tampil: <strong className="tabular-nums" style={{ color: 'var(--pub-ink)' }}>{orderNumber}</strong> · {members} Anggota
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                backgroundColor: dpStatus === 'COMPLETED' ? 'var(--pub-teal-light)' : dpStatus === 'BLOCKED' ? 'var(--pub-coral-pale)' : '#FEF3C7',
                color: dpStatus === 'COMPLETED' ? 'var(--pub-teal)' : dpStatus === 'BLOCKED' ? 'var(--pub-coral)' : 'var(--pub-amber)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              STATUS: {dpStatus}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.35rem' }}>
              Waktu Masuk: {entryTime}
            </div>
          </div>
        </div>

        {/* Action Controls for Operator DP */}
        <div
          style={{
            backgroundColor: 'var(--pub-canvas)',
            border: '1px solid var(--pub-line)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--pub-ink)' }}>
              Pemeriksaan Berkas Fisik & Kehadiran Anggota Selesai?
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Sistem akan memvalidasi ketersediaan pos DP 2 secara otomatis sebelum memindahkan pasukan.
            </p>
          </div>

          <button
            type="button"
            onClick={onFinishDP}
            disabled={dpStatus === 'COMPLETED'}
            className="pub-btn-coral"
            style={{
              padding: '0.7rem 1.4rem',
              fontSize: '0.925rem',
              opacity: dpStatus === 'COMPLETED' ? 0.6 : 1,
              cursor: dpStatus === 'COMPLETED' ? 'not-allowed' : 'pointer',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Selesai DP & Cek Tujuan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
