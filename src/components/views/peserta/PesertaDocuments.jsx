import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const STORAGE_KEY_PARTICIPANTS = 'kompas_panitia_participants_data';

export default function PesertaDocuments({ documents = [] }) {
  const defaultDocs = [
    { name: 'File Kartu Pelajar (Kolektif Anggota)', status: 'VERIFIED', size: '3.4 MB', note: '' },
    { name: 'File Surat Rekomendasi / Pengantar Sekolah', status: 'VERIFIED', size: '1.2 MB', note: '' },
    { name: 'Formulir Pendaftaran & Pakta Integritas', status: 'PENDING', size: '840 KB', note: '' },
  ];

  const [items, setItems] = useState(documents.length > 0 ? documents : defaultDocs);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
        if (!raw) return;
        const list = JSON.parse(raw);
        const mainTeam = list.find((p) => p.id === 'part-1') || list[0];
        if (mainTeam && Array.isArray(mainTeam.documents)) {
          setItems(
            mainTeam.documents.map((d) => ({
              name: d.title,
              status: d.status,
              size: d.size || '1.5 MB',
              note: d.note || '',
            }))
          );
        }
      } catch (err) {
        console.error('Error syncing PesertaDocuments:', err);
      }
    };

    if (documents.length === 0) {
      syncFromStorage();
      window.addEventListener('kompas_participants_updated', syncFromStorage);
      return () => window.removeEventListener('kompas_participants_updated', syncFromStorage);
    } else {
      setItems(documents);
    }
  }, [documents]);

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
              border: doc.status === 'REVISION' ? '1.5px solid #FCD34D' : '1px solid var(--pub-line)',
              backgroundColor: doc.status === 'REVISION' ? '#FFFBEB' : 'var(--pub-canvas)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pub-ink)' }}>{doc.name}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                  Ukuran file: {doc.size}
                </div>
              </div>

              {doc.status === 'VERIFIED' && (
                <span
                  style={{
                    backgroundColor: 'var(--pub-teal-light)',
                    color: 'var(--pub-teal)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <CheckCircle2 size={12} />
                  TERVERIFIKASI
                </span>
              )}

              {doc.status === 'REVISION' && (
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    border: '1px solid #FCD34D',
                  }}
                >
                  <AlertCircle size={12} />
                  PERLU REVISI
                </span>
              )}

              {doc.status === 'PENDING' && (
                <span
                  style={{
                    backgroundColor: 'rgba(217, 119, 6, 0.15)',
                    color: '#B45309',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Clock size={12} />
                  MENUNGGU VALIDASI
                </span>
              )}

              {doc.status === 'EMPTY' && (
                <span
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--pub-radius-pill)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  BELUM DIUNGGAH
                </span>
              )}
            </div>

            {doc.note && (
              <div
                style={{
                  fontSize: '0.725rem',
                  color: '#92400E',
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.35rem',
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={12} style={{ flexShrink: 0, marginTop: '2px', color: '#D97706' }} />
                <span>
                  <strong>Catatan Panitia:</strong> {doc.note}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
