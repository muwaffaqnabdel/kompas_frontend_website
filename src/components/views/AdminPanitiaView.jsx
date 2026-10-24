import React, { useState } from 'react';
import AdminPanitiaHeader from './admin-panitia/AdminPanitiaHeader';
import AdminPanitiaEventSettings from './admin-panitia/AdminPanitiaEventSettings';
import AdminPanitiaReadiness from './admin-panitia/AdminPanitiaReadiness';
import AdminPanitiaDPConfig from './admin-panitia/AdminPanitiaDPConfig';
import AdminPanitiaJudgesConfig from './admin-panitia/AdminPanitiaJudgesConfig';
import AdminPanitiaCriteriaConfig, { STORAGE_KEY_SCORING_LOCKED } from './admin-panitia/AdminPanitiaCriteriaConfig';
import AdminPanitiaDPMonitoring from './admin-panitia/AdminPanitiaDPMonitoring';
import AdminPanitiaParticipantTable from './admin-panitia/AdminPanitiaParticipantTable';
import AdminPanitiaTechnicalMeeting from './admin-panitia/AdminPanitiaTechnicalMeeting';
import AdminPanitiaResults from './admin-panitia/AdminPanitiaResults';

export default function AdminPanitiaView({ activeTab = 'dashboard' }) {
  const [dpFlowLocked, setDpFlowLocked] = useState(false);
  const [scoringLocked, setScoringLocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SCORING_LOCKED) === 'true';
    } catch {
      return false;
    }
  });
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

      {(activeTab === 'judges' || activeTab === 'staff') && (
        <AdminPanitiaJudgesConfig />
      )}

      {activeTab === 'criteria' && (
        <>
          <AdminPanitiaReadiness
            dpFlowLocked={dpFlowLocked}
            setDpFlowLocked={setDpFlowLocked}
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
          <AdminPanitiaCriteriaConfig
            scoringLocked={scoringLocked}
            setScoringLocked={setScoringLocked}
          />
        </>
      )}

      {activeTab === 'schedule' && (
        <AdminPanitiaTechnicalMeeting />
      )}

      {activeTab === 'results' && (
        <AdminPanitiaResults />
      )}
    </div>
  );
}

