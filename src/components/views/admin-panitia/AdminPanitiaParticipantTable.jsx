import React from 'react';

export default function AdminPanitiaParticipantTable({ participants = [] }) {
  const defaultParticipants = [
    {
      teamNumber: '01 / LKBB-2026-001',
      teamName: 'PASKIBRA GARUDA SAKTI',
      school: 'SMAN 1 Jakarta',
      members: 16,
      category: 'SMA/SMK Putra-Putri',
      docs: '✓ 4 Dokumen Lengkap',
      status: 'VALIDATED',
    },
  ];

  const items = participants.length > 0 ? participants : defaultParticipants;

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
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
            Verifikasi Berkas Pasukan Peserta
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Pemeriksaan kelengkapan dokumen tim dan penerbitan nomor urut tampil.
          </p>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', fontWeight: 600 }}>
          Total: {items.length} Pendaftar Terverifikasi
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Nomor Tim
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Nama Pasukan & Sekolah
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Kategori
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Kelengkapan Berkas
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                Keputusan Panitia
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((pt, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--pub-line)' }}>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--pub-ink)' }} className="tabular-nums">
                  {pt.teamNumber}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>{pt.teamName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                    {pt.school} · {pt.members} Anggota
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', color: 'var(--pub-ink-soft)' }}>{pt.category}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ color: 'var(--pub-teal)', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {pt.docs}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--pub-teal-light)',
                      color: 'var(--pub-teal)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--pub-radius-pill)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {pt.status}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <button className="pub-btn-coral" style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem' }}>
                    Beri Jadwal Tampil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
