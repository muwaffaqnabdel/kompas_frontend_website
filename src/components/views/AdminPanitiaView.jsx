import React, { useState } from 'react';
import AdminPanitiaHeader from './admin-panitia/AdminPanitiaHeader';
import AdminPanitiaEventSettings from './admin-panitia/AdminPanitiaEventSettings';
import AdminPanitiaReadiness from './admin-panitia/AdminPanitiaReadiness';
import AdminPanitiaDPConfig from './admin-panitia/AdminPanitiaDPConfig';
import AdminPanitiaDPMonitoring from './admin-panitia/AdminPanitiaDPMonitoring';
import AdminPanitiaParticipantTable from './admin-panitia/AdminPanitiaParticipantTable';

export default function AdminPanitiaView({ activeTab = 'dashboard' }) {
  const [dpFlowLocked, setDpFlowLocked] = useState(false);
  const [scoringLocked, setScoringLocked] = useState(false);
  const [dashboardSection, setDashboardSection] = useState('settings'); // 'settings' or 'operations'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Dynamic Header Banner */}
      <AdminPanitiaHeader
        activeSection={dashboardSection}
        onSelectSection={setDashboardSection}
      />

      {/* 2. Content View Based on activeTab */}
      {activeTab === 'dashboard' && (
        <>
          {dashboardSection === 'settings' ? (
            <AdminPanitiaEventSettings />
          ) : (
            <>
              {/* Checklist Kesiapan Konfigurasi */}
              <AdminPanitiaReadiness
                dpFlowLocked={dpFlowLocked}
                setDpFlowLocked={setDpFlowLocked}
                scoringLocked={scoringLocked}
                setScoringLocked={setScoringLocked}
              />

              {/* Monitoring 4 Pos DP Live */}
              <AdminPanitiaDPMonitoring />
            </>
          )}
        </>
      )}

      {activeTab === 'participants' && (
        <AdminPanitiaParticipantTable />
      )}

      {activeTab === 'flow-dp' && (
        <>
          <AdminPanitiaReadiness
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
          <AdminPanitiaDPConfig
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
          />
        </>
      )}

      {activeTab === 'live-dp' && (
        <AdminPanitiaDPMonitoring />
      )}

      {activeTab === 'staff' && (
        <AdminPanitiaEventSettings />
      )}

      {activeTab === 'criteria' && (
        <AdminPanitiaReadiness
          dpFlowLocked={dpFlowLocked}
          setDpFlowLocked={setDpFlowLocked}
          scoringLocked={scoringLocked}
          setScoringLocked={setScoringLocked}
        />
      )}

      {(activeTab === 'schedule' || activeTab === 'results') && (
        <div
          style={{
            backgroundColor: 'var(--pub-surface)',
            borderRadius: 'var(--pub-radius-card)',
            padding: '2.5rem',
            textAlign: 'center',
            border: '1px solid var(--pub-line)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--pub-ink)', marginBottom: '0.5rem' }}>
            {activeTab === 'schedule' ? 'Jadwal Pertandingan & Technical Meeting' : 'Hasil Resmi & Publikasi Nilai'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--pub-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Data jadwal dan hasil lomba disinkronkan otomatis dengan status verifikasi berkas peserta dan input penilaian juri di lapangan.
          </p>
          <button
            onClick={() => setDashboardSection('settings')}
            className="pub-btn-coral"
            style={{ fontSize: '0.85rem' }}
          >
            Kelola di Pengaturan Event
          </button>
        </div>
      )}
    </div>
  );
}

