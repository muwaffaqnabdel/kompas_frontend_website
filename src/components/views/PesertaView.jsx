import React from 'react';
import PesertaHero from './peserta/PesertaHero';
import PesertaMetrics from './peserta/PesertaMetrics';
import PesertaTimeline from './peserta/PesertaTimeline';
import PesertaDocuments from './peserta/PesertaDocuments';
import PesertaAgenda from './peserta/PesertaAgenda';

export default function PesertaView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Event Aktif Pasukan */}
      <PesertaHero />

      {/* 2. Metrics 4 Kolom Status & Pasukan */}
      <PesertaMetrics />

      {/* 3. Timeline Perjalanan 6 Tahapan Lomba */}
      <PesertaTimeline />

      {/* 4. Grid Dokumen Berkas & Agenda Kegiatan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <PesertaDocuments />
        <PesertaAgenda />
      </div>
    </div>
  );
}
