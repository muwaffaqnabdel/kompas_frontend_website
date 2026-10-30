import React from 'react';
import { Download } from 'lucide-react';

export default function PesertaResultsView() {
  const criteriaScores = [
    { name: '1. Gerakan Dasar PBB di Tempat', score: 92, max: 100, weight: '30%' },
    { name: '2. Gerakan Berjalan & Variasi Formasi', score: 88, max: 100, weight: '40%' },
    { name: '3. Kerapian, Kostum & Kekompakan Pasukan', score: 95, max: 100, weight: '15%' },
    { name: '4. Artikulasi & Intonasi Aba-aba Danton', score: 90, max: 100, weight: '15%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
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
          <span
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              color: '#B45309',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.725rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            HASIL & EVALUASI
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: '0.4rem 0 0.35rem 0',
            }}
          >
            Nilai & Evaluasi Dewan Juri
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', margin: 0 }}>
            Rekapitulasi nilai resmi, catatan evaluasi audio/AI, serta sertifikat keikutsertaan kontingen.
          </p>
        </div>

        <button
          className="pub-btn-coral"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
          onClick={() => alert('Mengunduh lembar rekap nilai & sertifikat (.PDF)...')}
        >
          <Download size={16} />
          <span>Unduh Rekap Nilai</span>
        </button>
      </div>

      {/* Ringkasan Skor Akhir */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--pub-line)',
            borderLeft: '5px solid var(--pub-coral)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Total Nilai Akhir
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
            365 <span style={{ fontSize: '1rem', color: 'var(--pub-muted)', fontWeight: 600 }}>/ 400</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pub-teal)', fontWeight: 700, marginTop: '0.2rem' }}>
            Kategori Sangat Memuaskan (A)
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--pub-line)',
            borderLeft: '5px solid var(--pub-teal)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Peringkat Sementara
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pub-teal)', marginTop: '0.2rem' }}>
            #02 <span style={{ fontSize: '1rem', color: 'var(--pub-muted)', fontWeight: 600 }}>dari 32 Tim</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.2rem' }}>
            Kategori SMA/SMK Putra-Putri
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--pub-line)',
            borderLeft: '5px solid var(--pub-amber)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase' }}>
            Penalti Pengurangan Waktu
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pub-ink)', marginTop: '0.2rem' }}>
            0 <span style={{ fontSize: '1rem', color: 'var(--pub-muted)', fontWeight: 600 }}>Poin</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pub-teal)', fontWeight: 700, marginTop: '0.2rem' }}>
            Tampil Tepat Waktu (09:48 / 10:00)
          </div>
        </div>
      </div>

      {/* Rincian Kriteria Penilaian */}
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          borderRadius: 'var(--pub-radius-card)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-card)',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0 0 1.25rem 0' }}>
          Rincian Nilai Berdasarkan 4 Kriteria Lomba
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {criteriaScores.map((c, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--pub-line)',
                backgroundColor: 'var(--pub-canvas)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--pub-ink)' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>Bobot Penilaian: {c.weight}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-ink)' }}>{c.score}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--pub-muted)' }}>Maks. {c.max}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

