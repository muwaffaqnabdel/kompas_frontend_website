import React, { useState } from 'react';
import { GitCommit, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function PanitiaDPView() {
  const [dpStatus, setDpStatus] = useState('IN_PROGRESS'); // WAITING, IN_PROGRESS, COMPLETED, BLOCKED
  const [targetDpCapacity, setTargetDpCapacity] = useState('AVAILABLE'); // AVAILABLE or FULL
  const [notification, setNotification] = useState(null);

  const handleFinishDP = () => {
    if (targetDpCapacity === 'FULL') {
      setDpStatus('BLOCKED');
      setNotification({
        type: 'danger',
        msg: 'PERINGATAN ATOMIC LOCK: DP 2 (Photoshoot) sedang terisi 1 tim! Tim PASKIBRA GARUDA SAKTI tertahan di ruang tunggu DP 1 sampai slot DP 2 bebas.',
      });
    } else {
      setDpStatus('COMPLETED');
      setNotification({
        type: 'success',
        msg: 'SUKSES: DP 2 tersedia! Tim PASKIBRA GARUDA SAKTI otomatis dipindahkan ke DP 2 (Photoshoot Resmi). Slot DP 1 kini siap menerima tim berikutnya.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Workstation Pos DP */}
      <div
        style={{
          backgroundColor: 'var(--midnight-navy)',
          color: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-validated">POS 01 AKTIF</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>LKBB Nasional 2026</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#FFFFFF' }}>
            DP 1 — Pengecekan Dokumen & Berkas
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            Operator: Budi Santoso · Kapasitas Batas: <strong>Tepat 1 Tim</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Simulasi Kapasitas DP 2 (Tujuan)</div>
          <button
            onClick={() => setTargetDpCapacity(targetDpCapacity === 'AVAILABLE' ? 'FULL' : 'AVAILABLE')}
            className={`btn ${targetDpCapacity === 'AVAILABLE' ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', marginTop: '0.35rem' }}
          >
            {targetDpCapacity === 'AVAILABLE' ? '🟢 DP 2 Kosong (Slot Ada)' : '🔴 DP 2 Penuh (1 Tim Aktif)'}
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: notification.type === 'danger' ? 'var(--crimson-light)' : 'var(--emerald-light)',
            color: notification.type === 'danger' ? 'var(--crimson-text)' : 'var(--emerald-text)',
            border: `1px solid ${notification.type === 'danger' ? 'rgba(153, 27, 27, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {notification.msg}
        </div>
      )}

      {/* Active Team Workstation Card */}
      <div className="card" style={{ borderTop: '4px solid var(--crimson)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--crimson)', letterSpacing: '0.08em' }}>
              TIM SEDANG DI POS INI
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--deep-slate)', margin: '0.2rem 0' }}>
              PASKIBRA GARUDA SAKTI
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted-slate)' }}>
              SMAN 1 Jakarta · Nomor Urut Tampil: <strong className="tabular-nums">01</strong> · 16 Anggota
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${dpStatus === 'IN_PROGRESS' ? 'badge-pending' : dpStatus === 'BLOCKED' ? 'badge-revision' : 'badge-validated'}`}>
              STATUS: {dpStatus}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)', marginTop: '0.35rem' }}>
              Waktu Masuk: 08:15 WIB
            </div>
          </div>
        </div>

        {/* Action Controls for Operator DP */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--deep-slate)' }}>
              Pemeriksaan Berkas Fisik & Kehadiran Anggota Selesai?
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)', margin: '0.2rem 0 0 0' }}>
              Sistem akan memvalidasi ketersediaan pos DP 2 secara otomatis sebelum memindahkan pasukan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleFinishDP}
              disabled={dpStatus === 'COMPLETED'}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9375rem' }}
            >
              <CheckCircle2 size={18} />
              <span>Selesai DP & Cek Tujuan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Antrean Tim Berikutnya */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-slate)', marginBottom: '0.75rem' }}>
          Antrean Menunggu Masuk ke DP 1
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>02 — PASKIBRA WIJAYA KUSUMA</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>SMAN 28 Jakarta · 16 Pasukan</div>
            </div>
            <span className="badge badge-pending">WAITING</span>
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>03 — PASKIBRA PATRIOT 70</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-slate)' }}>SMAN 70 Jakarta · 16 Pasukan</div>
            </div>
            <span className="badge badge-neutral">STANDBY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
