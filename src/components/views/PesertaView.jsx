import React from 'react';
import PesertaHero from './peserta/PesertaHero';
import PesertaMetrics from './peserta/PesertaMetrics';
import PesertaTimeline from './peserta/PesertaTimeline';
import PesertaDocuments from './peserta/PesertaDocuments';
import PesertaAgenda from './peserta/PesertaAgenda';
import PesertaDataTimBerkas from './peserta/PesertaDataTimBerkas';
import PesertaScheduleView from './peserta/PesertaScheduleView';
import PesertaResultsView from './peserta/PesertaResultsView';

export default function PesertaView({ activeTab = 'dashboard', onSelectTab }) {
  if (activeTab === 'registration') {
    return <PesertaDataTimBerkas />;
  }

  if (activeTab === 'schedule') {
    return <PesertaScheduleView />;
  }

  if (activeTab === 'results') {
    return <PesertaResultsView />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Event Aktif Pasukan */}
      <PesertaHero onOpenSchedule={() => onSelectTab && onSelectTab('schedule')} />

      {/* 2. Metrics 3 Kolom Status & Pasukan */}
      <PesertaMetrics />

      {/* 3. Timeline Perjalanan 6 Tahapan Lomba */}
      <PesertaTimeline />

      {/* 4. Grid Dokumen Berkas & Agenda Kegiatan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <PesertaDocuments />
        <PesertaAgenda onOpenSchedule={() => onSelectTab && onSelectTab('schedule')} />
      </div>
    </div>
  );
}
