import React, { useState } from 'react';
import { Clock, Search, ArrowRight, ShieldCheck, CheckCircle2, History, Filter } from 'lucide-react';

export default function PanitiaDPTransitionLogs({ logs = [], eventName = 'LKBB Nasional 2026' }) {
  const [search, setSearch] = useState('');

  // Default logs simulasi jika logs state masih kosong
  const defaultLogs = [
    {
      id: 'log-01',
      time: '08:45 WIB',
      orderNumber: '01',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      action: '🔓 Buka Penilaian Juri (Pos 04)',
      actionType: 'JURI_OPEN',
      operator: 'Hendro Kusuma (Pimpinan Arena)',
      status: 'AKTIF',
    },
    {
      id: 'log-02',
      time: '08:35 WIB',
      orderNumber: '01',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      action: '➡️ Transisi dari Pos 03 ke Pos 04 (Panggung Utama)',
      actionType: 'MOVE_POS4',
      operator: 'Agus Wijaya (Petugas Persiapan)',
      status: 'SUKSES',
    },
    {
      id: 'log-03',
      time: '08:25 WIB',
      orderNumber: '01',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      action: '➡️ Transisi dari Pos 02 ke Pos 03 (Persiapan)',
      actionType: 'MOVE_POS3',
      operator: 'Siti Rahma (Petugas Photoshoot)',
      status: 'SUKSES',
    },
    {
      id: 'log-04',
      time: '08:15 WIB',
      orderNumber: '01',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      action: '➡️ Transisi dari Pos 01 ke Pos 02 (Photoshoot)',
      actionType: 'MOVE_POS2',
      operator: 'Budi Santoso (Petugas Dokumen)',
      status: 'SUKSES',
    },
    {
      id: 'log-05',
      time: '08:05 WIB',
      orderNumber: '01',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      action: '📢 Notifikasi Panggilan Masuk ke Pos 01 (Dokumen)',
      actionType: 'CALL_POS1',
      operator: 'Budi Santoso (Petugas Dokumen)',
      status: 'SUKSES',
    },
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const filtered = displayLogs.filter(
    (l) =>
      l.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      l.school?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.operator?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font-sans)' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.5rem 1.75rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: 'var(--pub-sand)',
                color: 'var(--pub-ink)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.725rem',
                fontWeight: 800,
              }}
            >
              LOG AUDIT OPERASIONAL
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontFamily: 'var(--font-mono)' }}>
              {eventName}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0 0 0.25rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <History size={22} color="var(--pub-coral)" />
            <span>Riwayat Transisi & Pergerakan Pasukan</span>
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: 0 }}>
            Catatan log otomatis seluruh perpindahan pasukan dari pra-lomba, Pos 1, Pos 2, Pos 3, pembukaan penilaian juri, hingga selesai tampil.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--pub-muted)' }} />
          <input
            type="text"
            placeholder="Cari tim, aksi, atau operator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.25rem', fontSize: '0.8rem', backgroundColor: '#FFFFFF' }}
          />
        </div>
      </div>

      {/* Tabel Riwayat Transisi */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '2px solid var(--pub-line)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)', fontWeight: 700, width: '110px' }}>WAKTU</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)', fontWeight: 700 }}>KONTINGEN & SEKOLAH</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)', fontWeight: 700 }}>AKSI TRANSISI ALUR</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)', fontWeight: 700 }}>OPERATOR POS</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)', fontWeight: 700, textAlign: 'center', width: '120px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => (
                <tr key={log.id || idx} style={{ borderBottom: '1px solid var(--pub-line)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--pub-ink)' }}>
                    {log.time}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--pub-canvas)',
                          color: 'var(--pub-coral)',
                          border: '1px solid var(--pub-line)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                        }}
                      >
                        {log.orderNumber || '01'}
                      </span>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--pub-ink)' }}>{log.teamName}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)' }}>{log.school}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        color:
                          log.actionType === 'JURI_OPEN'
                            ? '#059669'
                            : log.actionType === 'FINISH'
                            ? '#dc2626'
                            : 'var(--pub-ink)',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--pub-muted)' }}>
                    <strong style={{ color: 'var(--pub-ink)' }}>{log.operator}</strong>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        backgroundColor: log.status === 'AKTIF' ? 'var(--pub-teal-light)' : '#ECFDF5',
                        color: log.status === 'AKTIF' ? 'var(--pub-teal)' : '#059669',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--pub-radius-pill)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      {log.status} ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

