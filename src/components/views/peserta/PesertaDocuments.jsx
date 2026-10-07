import React from 'react';

export default function PesertaDocuments({ documents = [] }) {
  const defaultDocs = [
    { name: 'Surat Tugas Kepala Sekolah', status: 'VERIFIED', size: '1.2 MB' },
    { name: 'Bukti Pembayaran Registrasi', status: 'VERIFIED', size: '450 KB' },
    { name: 'Foto Resmi Pasukan (16 Orang)', status: 'VERIFIED', size: '3.8 MB' },
    { name: 'Surat Keterangan Sehat Anggota', status: 'VERIFIED', size: '920 KB' },
  ];

  const items = documents.length > 0 ? documents : defaultDocs;

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
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 1rem 0' }}>
        Dokumen Persyaratan Tim
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((doc, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)' }}>{doc.name}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                Ukuran file: {doc.size}
              </div>
            </div>
            <span
              style={{
                backgroundColor: 'var(--pub-teal-light)',
                color: 'var(--pub-teal)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--pub-radius-pill)',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              TERVERIFIKASI
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
