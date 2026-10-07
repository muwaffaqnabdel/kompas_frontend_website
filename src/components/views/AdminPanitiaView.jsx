import React, { useState } from 'react';
import AdminPanitiaHeader from './admin-panitia/AdminPanitiaHeader';
import AdminPanitiaReadiness from './admin-panitia/AdminPanitiaReadiness';
import AdminPanitiaDPMonitoring from './admin-panitia/AdminPanitiaDPMonitoring';
import AdminPanitiaParticipantTable from './admin-panitia/AdminPanitiaParticipantTable';

export default function AdminPanitiaView() {
  const [dpFlowLocked, setDpFlowLocked] = useState(false);
  const [scoringLocked, setScoringLocked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Header Banner */}
      <AdminPanitiaHeader />

      {/* 2. Checklist Kesiapan Konfigurasi */}
      <AdminPanitiaReadiness
        dpFlowLocked={dpFlowLocked}
        setDpFlowLocked={setDpFlowLocked}
        scoringLocked={scoringLocked}
        setScoringLocked={setScoringLocked}
      />

      {/* 3. Monitoring 4 Pos DP Live */}
      <AdminPanitiaDPMonitoring />

      {/* 4. Tabel Verifikasi Dokumen & Jadwal Peserta */}
      <AdminPanitiaParticipantTable />
    </div>
  );
}
